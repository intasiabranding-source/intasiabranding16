"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/require-auth";
import { revalidateCms } from "@/lib/cms/revalidate";
import { logAudit } from "@/lib/auth/audit";
import { slugify } from "@/lib/utils";

export async function getAdminServices() {
  await requireAdmin();
  return prisma.service.findMany({ orderBy: { order: "asc" } });
}

export async function upsertService(data: {
  id?: string;
  title: string;
  description: string;
  shortDesc?: string;
  category: string;
  features: string[];
  pricing?: string;
  priceNote?: string;
  ctaLabel?: string;
  ctaLink?: string;
  imageUrl?: string;
  published?: boolean;
}) {
  const session = await requireAdmin();
  const slug = slugify(data.title);

  const payload = {
    title: data.title,
    slug,
    description: data.description,
    shortDesc: data.shortDesc,
    category: data.category,
    features: data.features,
    pricing: data.pricing,
    priceNote: data.priceNote,
    ctaLabel: data.ctaLabel ?? "Get Started",
    ctaLink: data.ctaLink ?? "/contact",
    imageUrl: data.imageUrl,
    published: data.published ?? true,
  };

  const service = data.id
    ? await prisma.service.update({ where: { id: data.id }, data: payload })
    : await prisma.service.create({ data: payload });

  await logAudit({
    adminId: session.user.id,
    action: data.id ? "UPDATE_SERVICE" : "CREATE_SERVICE",
    entity: "Service",
    entityId: service.id,
  });
  await revalidateCms();
  return service;
}

export async function deleteService(id: string) {
  const session = await requireAdmin();
  await prisma.service.delete({ where: { id } });
  await logAudit({
    adminId: session.user.id,
    action: "DELETE_SERVICE",
    entity: "Service",
    entityId: id,
  });
  await revalidateCms();
  return { success: true };
}
