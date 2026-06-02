import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { buildContactAutoReply, buildLeadNotifyEmail } from "@/lib/email/contact-templates";
import { LeadSource } from "@prisma/client";

/** Primary inbox for contact form leads */
export const INTASIA_LEAD_EMAIL = "intasiabranding@gmail.com";

const DEFAULT_BRAND = "Intasia Branding";

export const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

async function saveLeadSafely(data: ContactFormInput) {
  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        service: data.service,
        message: data.message,
        source: LeadSource.CONTACT_FORM,
      },
    });
  } catch (err) {
    console.error("[contact] Lead save failed (DB):", err);
  }
}

async function getContactSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    if (settings) return settings;
  } catch (err) {
    console.error("[contact] Settings load failed (DB):", err);
  }
  return {
    brandName: DEFAULT_BRAND,
    leadNotifyEmail: INTASIA_LEAD_EMAIL,
    contactEmail: INTASIA_LEAD_EMAIL,
    autoReplySubject: `Thanks for contacting ${DEFAULT_BRAND}`,
    autoReplyBody: null as string | null,
  };
}

export async function processContactSubmission(data: ContactFormInput) {
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, error: "Please check the form and try again." };
  }

  const { name, email } = parsed.data;

  await saveLeadSafely(parsed.data);

  const settings = await getContactSettings();
  const notifyTo =
    settings.leadNotifyEmail ?? settings.contactEmail ?? INTASIA_LEAD_EMAIL;
  const brandName = settings.brandName ?? DEFAULT_BRAND;

  const notifyResult = await sendEmail({
    to: notifyTo,
    subject: `New inquiry from ${name} — Intasia Branding`,
    html: buildLeadNotifyEmail(parsed.data),
    text: `New contact from ${name} (${email})\nPhone: ${parsed.data.phone || "—"}\n\n${parsed.data.message}`,
    preferSmtp: true,
    metadata: { type: "lead_notify", fromEmail: email },
  });

  if (!notifyResult.success) {
    const smtpHint =
      notifyResult.error?.includes("not configured") ||
      notifyResult.error?.includes("SMTP")
        ? " Email is not configured on the server yet."
        : "";
    return {
      success: false as const,
      error: `We couldn't send your message right now.${smtpHint} Please email ${INTASIA_LEAD_EMAIL} or WhatsApp +91 9342035536.`,
    };
  }

  void sendEmail({
    to: email,
    subject: settings.autoReplySubject ?? `Thanks for contacting ${brandName}`,
    html:
      settings.autoReplyBody ?? buildContactAutoReply(name, brandName),
    preferSmtp: true,
    metadata: { type: "contact_auto_reply" },
  });

  return {
    success: true as const,
    message: "Your message was sent successfully! We'll get back to you soon.",
  };
}
