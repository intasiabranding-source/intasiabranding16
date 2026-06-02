"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/require-auth";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/media/cloudinary";
import { logAudit } from "@/lib/auth/audit";

export async function getMediaAssets(folder?: string) {
  await requireAdmin();
  return prisma.mediaAsset.findMany({
    where: folder ? { folder } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function uploadMedia(formData: FormData) {
  const session = await requireAdmin();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) ?? "general";
  if (!file) return { success: false, error: "No file" };

  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await uploadToCloudinary(buffer, {
    folder,
    filename: file.name,
    mimeType: file.type,
  });

  await logAudit({
    adminId: session.user.id,
    action: "UPLOAD_MEDIA",
    entity: "MediaAsset",
    entityId: asset.id,
  });

  return { success: true, asset };
}

export async function deleteMedia(publicId: string) {
  const session = await requireAdmin();
  await deleteFromCloudinary(publicId);
  await logAudit({
    adminId: session.user.id,
    action: "DELETE_MEDIA",
    entity: "MediaAsset",
    metadata: { publicId },
  });
  return { success: true };
}
