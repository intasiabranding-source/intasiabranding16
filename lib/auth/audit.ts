import { prisma } from "@/lib/db";
import { type Prisma } from "@prisma/client";

export async function logAudit(params: {
  adminId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: params.metadata as Prisma.InputJsonValue | undefined,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch {
    console.error("Failed to write audit log");
  }
}

export async function logLogin(params: {
  adminId?: string;
  email: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
}) {
  await prisma.loginHistory.create({ data: params });
}
