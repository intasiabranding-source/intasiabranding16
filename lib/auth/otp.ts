import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OtpPurpose } from "@prisma/client";
import { prisma } from "@/lib/db";

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function createOtpChallenge(
  email: string,
  purpose: OtpPurpose = OtpPurpose.LOGIN,
  ipAddress?: string
) {
  await prisma.otpChallenge.deleteMany({
    where: { email, purpose, usedAt: null },
  });

  const code = generateOtp();
  const codeHash = await bcrypt.hash(code, 10);

  await prisma.otpChallenge.create({
    data: {
      email,
      codeHash,
      purpose,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
      ipAddress,
    },
  });

  return code;
}

export async function verifyOtp(
  email: string,
  code: string,
  purpose: OtpPurpose = OtpPurpose.LOGIN
): Promise<{ success: boolean; error?: string }> {
  const challenge = await prisma.otpChallenge.findFirst({
    where: { email, purpose, usedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge) {
    return { success: false, error: "No active OTP. Request a new code." };
  }

  if (challenge.expiresAt < new Date()) {
    return { success: false, error: "OTP expired. Request a new code." };
  }

  if (challenge.attempts >= MAX_ATTEMPTS) {
    return { success: false, error: "Too many attempts. Request a new code." };
  }

  const valid = await bcrypt.compare(code, challenge.codeHash);

  await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: { attempts: challenge.attempts + 1 },
  });

  if (!valid) {
    return { success: false, error: "Invalid OTP code." };
  }

  await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: { usedAt: new Date() },
  });

  return { success: true };
}
