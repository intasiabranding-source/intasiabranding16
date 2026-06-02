import { Resend } from "resend";
import nodemailer from "nodemailer";
import { EmailStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/cms/fetch";
import { resolveSmtpConfig, type ResolvedSmtpConfig } from "@/lib/email/smtp-config";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

async function logEmail(
  to: string,
  subject: string,
  status: EmailStatus,
  provider: string,
  error?: string,
  metadata?: Prisma.InputJsonValue
) {
  try {
    await prisma.emailLog.create({
      data: {
        to,
        subject,
        status,
        provider,
        error,
        metadata: metadata as Prisma.InputJsonValue | undefined,
      },
    });
  } catch {
    /* ignore logging failures */
  }
}

function createTransporter(config: ResolvedSmtpConfig) {
  const secure = config.port === 465 || config.encryption === "SSL";

  const options: {
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string };
    requireTLS?: boolean;
    tls?: { minVersion: string; rejectUnauthorized: boolean };
  } = {
    host: config.host,
    port: config.port,
    secure,
    auth: {
      user: config.username,
      pass: config.password,
    },
  };

  if (!secure && config.encryption === "TLS") {
    options.requireTLS = true;
  }

  if (process.env.SMTP_TLS_INSECURE === "true") {
    options.tls = { minVersion: "TLSv1.2", rejectUnauthorized: false };
  }

  return nodemailer.createTransport(options as unknown as nodemailer.TransportOptions);
}

export async function sendViaSmtp(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  const config = await resolveSmtpConfig();
  if (!config) {
    return {
      success: false as const,
      error:
        "SMTP is not configured. Add an active SMTP profile in Admin → Email / SMTP or set SMTP_* variables in .env.",
    };
  }

  try {
    const transporter = createTransporter(config);
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    await logEmail(
      params.to,
      params.subject,
      EmailStatus.SENT,
      `smtp:${config.source}`,
      undefined,
      params.metadata
    );

    return { success: true as const, provider: `smtp:${config.source}` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "SMTP send failed";
    await logEmail(
      params.to,
      params.subject,
      EmailStatus.FAILED,
      "smtp",
      msg,
      params.metadata
    );
    return { success: false as const, error: msg };
  }
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  preferSmtp?: boolean;
  metadata?: Prisma.InputJsonValue;
}) {
  const preferSmtp = params.preferSmtp !== false;
  const smtpConfig = await resolveSmtpConfig();

  if (preferSmtp && smtpConfig) {
    const result = await sendViaSmtp(params);
    if (result.success) return result;
    return result;
  }

  if (resend) {
    try {
      const from =
        process.env.EMAIL_FROM ?? "noreply@digitalgrowthecosystem.com";
      await resend.emails.send({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });
      await logEmail(
        params.to,
        params.subject,
        EmailStatus.SENT,
        "resend",
        undefined,
        params.metadata
      );
      return { success: true as const, provider: "resend" };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Resend failed";
      await logEmail(params.to, params.subject, EmailStatus.FAILED, "resend", msg);
    }
  }

  if (smtpConfig) {
    return sendViaSmtp(params);
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[DEV EMAIL]", params.to, params.subject, params.html.slice(0, 120));
    return { success: true as const, provider: "dev-console" };
  }

  return { success: false as const, error: "No email provider configured" };
}

function buildOtpHtml(params: {
  brandName: string;
  code: string;
  title: string;
  subtitle: string;
  customBody?: string | null;
}) {
  if (params.customBody) {
    return params.customBody
      .replace(/\{\{code\}\}/g, params.code)
      .replace(/\{\{brand\}\}/g, params.brandName);
  }

  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px;">
      <h2 style="color:#6366f1;margin:0 0 8px;">${params.title}</h2>
      <p style="color:#64748b;margin:0 0 24px;">${params.subtitle}</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1e1b4b;margin:16px 0;">${params.code}</p>
      <p style="color:#64748b;font-size:14px;">This code expires in <strong>5 minutes</strong>. Maximum <strong>5 attempts</strong>. Do not share this code.</p>
      <p style="color:#94a3b8;font-size:12px;margin-top:24px;">${params.brandName}</p>
    </div>
  `;
}

/** Admin login & recovery OTP — always sent through SMTP (dashboard profile or .env). */
export async function sendOtpEmail(
  email: string,
  code: string,
  purpose: "LOGIN" | "RECOVERY" = "LOGIN"
) {
  const settings = await getSiteSettings();

  if (settings.useSmtpForAuth === false) {
    return sendEmail({
      to: email,
      subject:
        purpose === "RECOVERY"
          ? (settings.otpRecoverySubject ?? "Account recovery code")
          : (settings.otpLoginSubject ?? "Your admin login code"),
      html: buildOtpHtml({
        brandName: settings.brandName,
        code,
        title: purpose === "RECOVERY" ? "Account Recovery" : "Admin Login",
        subtitle:
          purpose === "RECOVERY"
            ? "Use this code to verify your backup email."
            : "Your one-time verification code:",
        customBody:
          purpose === "RECOVERY"
            ? settings.otpRecoveryBody
            : settings.otpLoginBody,
      }),
      preferSmtp: false,
      metadata: { type: "otp", purpose },
    });
  }

  const subject =
    purpose === "RECOVERY"
      ? (settings.otpRecoverySubject ?? `${settings.brandName} — Recovery verification code`)
      : (settings.otpLoginSubject ?? `${settings.brandName} — Admin login verification code`);

  const html = buildOtpHtml({
    brandName: settings.brandName,
    code,
    title: purpose === "RECOVERY" ? "Account Recovery" : "Admin Login Verification",
    subtitle:
      purpose === "RECOVERY"
        ? "Enter this code to verify your backup email."
        : "Enter this code to sign in to the admin dashboard.",
    customBody:
      purpose === "RECOVERY" ? settings.otpRecoveryBody : settings.otpLoginBody,
  });

  const text = `Your verification code is ${code}. It expires in 5 minutes.`;

  return sendViaSmtp({
    to: email,
    subject,
    html,
    text,
    metadata: { type: "otp", purpose },
  });
}

export async function sendTestOtpEmail(to: string) {
  return sendOtpEmail(to, "123456", "LOGIN");
}
