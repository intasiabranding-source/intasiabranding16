"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/require-auth";
import { revalidateCms } from "@/lib/cms/revalidate";
import { logAudit } from "@/lib/auth/audit";
import { encrypt } from "@/lib/security/encrypt";
import { sendTestOtpEmail, sendViaSmtp } from "@/lib/email/send";

import { isSmtpConfigured } from "@/lib/email/smtp-config";

export async function getSettings() {
  await requireAdmin();
  const [settings, theme] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.siteTheme.findUnique({ where: { id: "default" } }),
  ]);
  return { settings, theme };
}

export async function updateSiteSettings(data: {
  brandName?: string;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsapp?: string;
  instagram?: string;
  address?: string;
  mapEmbedUrl?: string;
  gaMeasurementId?: string;
  autoReplySubject?: string;
  autoReplyBody?: string;
  leadNotifyEmail?: string;
  otpLoginSubject?: string;
  otpLoginBody?: string;
  otpRecoverySubject?: string;
  otpRecoveryBody?: string;
  useSmtpForAuth?: boolean;
}) {
  const session = await requireAdmin();
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });
  await logAudit({
    adminId: session.user.id,
    action: "UPDATE_SETTINGS",
    entity: "SiteSettings",
  });
  await revalidateCms();
  return { success: true };
}

export async function updateSiteTheme(data: {
  primaryColor?: string;
  accentColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  darkModeDefault?: boolean;
}) {
  const session = await requireAdmin();
  await prisma.siteTheme.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });
  await logAudit({
    adminId: session.user.id,
    action: "UPDATE_THEME",
    entity: "SiteTheme",
  });
  await revalidateCms();
  return { success: true };
}

export async function getSmtpProfiles() {
  await requireAdmin();
  return prisma.smtpProfile.findMany({ orderBy: { createdAt: "desc" } });
}

export async function saveSmtpProfile(data: {
  id?: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: string;
  fromEmail: string;
  fromName: string;
  isActive?: boolean;
}) {
  const session = await requireAdmin();

  if (data.isActive) {
    await prisma.smtpProfile.updateMany({ data: { isActive: false } });
  }

  const payload = {
    name: data.name,
    host: data.host,
    port: data.port,
    username: data.username,
    passwordEnc: encrypt(data.password),
    encryption: data.encryption,
    fromEmail: data.fromEmail,
    fromName: data.fromName,
    isActive: data.isActive ?? false,
  };

  const profile = data.id
    ? await prisma.smtpProfile.update({ where: { id: data.id }, data: payload })
    : await prisma.smtpProfile.create({ data: payload });

  await logAudit({
    adminId: session.user.id,
    action: "SAVE_SMTP",
    entity: "SmtpProfile",
    entityId: profile.id,
  });
  return { success: true };
}

export async function testSmtpEmail(to: string) {
  await requireAdmin();
  return sendViaSmtp({
    to,
    subject: "SMTP Test Email",
    html: "<p>Your SMTP configuration is working correctly. Contact forms and notifications will use this server.</p>",
    metadata: { type: "smtp_test" },
  });
}

export async function testOtpSmtpEmail(to: string) {
  await requireAdmin();
  return sendTestOtpEmail(to);
}

export async function getEmailSystemStatus() {
  await requireAdmin();
  const smtpReady = await isSmtpConfigured();
  const activeProfile = await prisma.smtpProfile.findFirst({
    where: { isActive: true },
    select: { name: true, fromEmail: true, host: true },
  });
  return { smtpReady, activeProfile };
}

export async function getSeoSettings() {
  await requireAdmin();
  return prisma.seoSettings.findMany();
}

export async function upsertSeo(data: {
  path: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
  schemaJson?: object;
}) {
  const session = await requireAdmin();
  await prisma.seoSettings.upsert({
    where: { path: data.path },
    create: data,
    update: data,
  });
  await logAudit({
    adminId: session.user.id,
    action: "UPDATE_SEO",
    entity: "SeoSettings",
    metadata: { path: data.path },
  });
  await revalidateCms();
  return { success: true };
}

export async function getAeoGeoBlocks() {
  await requireAdmin();
  return prisma.aeoGeoBlock.findMany({ orderBy: { order: "asc" } });
}

export async function upsertAeoGeo(data: {
  id?: string;
  type: string;
  question?: string;
  answer: string;
  entityName?: string;
  keywords?: string[];
}) {
  const session = await requireAdmin();
  const block = data.id
    ? await prisma.aeoGeoBlock.update({ where: { id: data.id }, data })
    : await prisma.aeoGeoBlock.create({ data });
  await logAudit({
    adminId: session.user.id,
    action: "UPDATE_AEO_GEO",
    entity: "AeoGeoBlock",
    entityId: block.id,
  });
  await revalidateCms();
  return block;
}

export async function getSecurityLogs() {
  await requireAdmin();
  const [loginHistory, auditLogs] = await Promise.all([
    prisma.loginHistory.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  return { loginHistory, auditLogs };
}

export async function getEmailLogs() {
  await requireAdmin();
  return prisma.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}
