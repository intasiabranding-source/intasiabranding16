import { prisma } from "@/lib/db";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 10;

export async function checkRateLimit(key: string): Promise<boolean> {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + WINDOW_MS);

  const existing = await prisma.rateLimitEntry.findUnique({
    where: { key },
  });

  if (!existing) {
    await prisma.rateLimitEntry.create({
      data: { key, count: 1, windowEnd },
    });
    return true;
  }

  if (existing.windowEnd < now) {
    await prisma.rateLimitEntry.update({
      where: { key },
      data: { count: 1, windowEnd },
    });
    return true;
  }

  if (existing.count >= MAX_REQUESTS) {
    return false;
  }

  await prisma.rateLimitEntry.update({
    where: { key },
    data: { count: existing.count + 1 },
  });

  return true;
}
