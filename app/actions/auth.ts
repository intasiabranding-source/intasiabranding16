"use server";

import { signIn } from "@/auth";
import { createOtpChallenge } from "@/lib/auth/otp";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { sendOtpEmail } from "@/lib/email/send";
import { prisma } from "@/lib/db";
import { OtpPurpose } from "@prisma/client";
import { headers } from "next/headers";

export async function requestOtp(email: string, purpose: "LOGIN" | "RECOVERY" = "LOGIN") {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";

  const rateKey = `otp:${ip}:${email}`;
  if (!(await checkRateLimit(rateKey))) {
    return { success: false, error: "Too many requests. Try again later." };
  }

  const admin = await prisma.admin.findFirst({
    where: {
      isActive: true,
      OR: [{ primaryEmail: email }, { backupEmail: email }],
    },
  });

  if (!admin) {
    return { success: false, error: "Unauthorized email address." };
  }

  if (purpose === "RECOVERY" && admin.backupEmail !== email) {
    return { success: false, error: "Use backup email for recovery." };
  }

  const code = await createOtpChallenge(
    email,
    purpose === "RECOVERY" ? OtpPurpose.RECOVERY : OtpPurpose.LOGIN,
    ip
  );

  const result = await sendOtpEmail(email, code, purpose);
  if (!result.success) {
    return {
      success: false,
      error:
        result.error ??
        "Failed to send verification email. Configure SMTP in Admin → Email / SMTP.",
    };
  }

  return {
    success: true,
    message: "Verification code sent via SMTP.",
  };
}

export async function verifyOtpLogin(email: string, code: string, purpose: "LOGIN" | "RECOVERY" = "LOGIN") {
  try {
    await signIn("otp", {
      email,
      code,
      purpose,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Invalid or expired code" };
  }
}

export async function updatePrimaryEmail(newEmail: string, backupEmail: string, code: string) {
  const admin = await prisma.admin.findFirst({
    where: { backupEmail, isActive: true },
  });
  if (!admin) return { success: false, error: "Admin not found" };

  const { verifyOtp } = await import("@/lib/auth/otp");
  const result = await verifyOtp(backupEmail, code, "RECOVERY" as import("@prisma/client").OtpPurpose);
  if (!result.success) return { success: false, error: result.error };

  await prisma.admin.update({
    where: { id: admin.id },
    data: { primaryEmail: newEmail },
  });

  const { logAudit } = await import("@/lib/auth/audit");
  await logAudit({
    adminId: admin.id,
    action: "UPDATE_PRIMARY_EMAIL",
    metadata: { newEmail },
  });

  return { success: true };
}
