import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/security/encrypt";
import type { SmtpProfile } from "@prisma/client";

export type ResolvedSmtpConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: string;
  fromEmail: string;
  fromName: string;
  source: "database" | "environment";
};

export async function resolveSmtpConfig(): Promise<ResolvedSmtpConfig | null> {
  try {
    const profile = await prisma.smtpProfile.findFirst({
      where: { isActive: true },
    });

    if (profile) {
      return profileToConfig(profile);
    }
  } catch {
    /* DB unavailable — fall back to SMTP_* in .env */
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER ?? process.env.SMTP_USERNAME;
  const pass = process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD;

  if (host && user && pass) {
    return {
      host,
      port: parseInt(process.env.SMTP_PORT ?? "587", 10),
      username: user,
      password: pass,
      encryption: process.env.SMTP_ENCRYPTION ?? "TLS",
      fromEmail: process.env.SMTP_FROM_EMAIL ?? user,
      fromName: process.env.SMTP_FROM_NAME ?? "Digital Growth Ecosystem",
      source: "environment",
    };
  }

  return null;
}

function profileToConfig(profile: SmtpProfile): ResolvedSmtpConfig {
  return {
    host: profile.host,
    port: profile.port,
    username: profile.username,
    password: decrypt(profile.passwordEnc),
    encryption: profile.encryption,
    fromEmail: profile.fromEmail,
    fromName: profile.fromName,
    source: "database",
  };
}

export async function isSmtpConfigured(): Promise<boolean> {
  return (await resolveSmtpConfig()) !== null;
}
