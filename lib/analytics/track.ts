import { prisma } from "@/lib/db";

import { type Prisma } from "@prisma/client";


export async function trackPageView(params: {
  sessionId: string;
  path: string;
  referrer?: string;
  device?: string;
  browser?: string;
}) {
  await prisma.analyticsEvent.create({
    data: {
      sessionId: params.sessionId,
      eventType: "page_view",
      path: params.path,
      referrer: params.referrer,
      device: params.device,
      browser: params.browser,
    },
  });
}

export async function trackConversion(params: {
  sessionId: string;
  path?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  await prisma.analyticsEvent.create({
    data: {
      sessionId: params.sessionId,
      eventType: "conversion",
      path: params.path,
      metadata: params.metadata as Prisma.InputJsonValue | undefined,
    },
  });
}

export function parseUserAgent(ua: string | null) {
  if (!ua) return { device: "unknown", browser: "unknown" };
  const device = /mobile|android|iphone/i.test(ua) ? "mobile" : "desktop";
  let browser = "other";
  if (/chrome/i.test(ua)) browser = "chrome";
  else if (/firefox/i.test(ua)) browser = "firefox";
  else if (/safari/i.test(ua)) browser = "safari";
  else if (/edge/i.test(ua)) browser = "edge";
  return { device, browser };
}

export async function getAnalyticsSummary(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: since } },
    select: {
      eventType: true,
      path: true,
      sessionId: true,
      device: true,
      referrer: true,
      createdAt: true,
    },
  });

  const sessions = new Set(events.map((e: { sessionId: string }) => e.sessionId)).size;
  const pageViews = events.filter((e: { eventType: string }) => e.eventType === "page_view").length;
  const conversions = events.filter((e: { eventType: string }) => e.eventType === "conversion").length;


  const pathCounts: Record<string, number> = {};
  const deviceCounts: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};

  for (const e of events) {
    if (e.path) pathCounts[e.path] = (pathCounts[e.path] ?? 0) + 1;
    if (e.device) deviceCounts[e.device] = (deviceCounts[e.device] ?? 0) + 1;
    if (e.referrer) referrerCounts[e.referrer] = (referrerCounts[e.referrer] ?? 0) + 1;
  }

  const topPages = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  const dailyMap: Record<string, number> = {};
  for (const e of events) {
    const day = e.createdAt.toISOString().split("T")[0];
    dailyMap[day] = (dailyMap[day] ?? 0) + 1;
  }

  const daily = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  return {
    sessions,
    pageViews,
    conversions,
    conversionRate: pageViews > 0 ? ((conversions / pageViews) * 100).toFixed(1) : "0",
    topPages,
    deviceCounts,
    referrerCounts,
    daily,
  };
}
