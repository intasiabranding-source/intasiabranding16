import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseUserAgent } from "@/lib/analytics/track";
import { z } from "zod";
import { type Prisma } from "@prisma/client";

const schema = z.object({
  sessionId: z.string(),
  path: z.string().optional(),
  referrer: z.string().optional(),
  eventType: z.enum(["page_view", "conversion"]).default("page_view"),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const ua = req.headers.get("user-agent");
    const { device, browser } = parseUserAgent(ua);

    await prisma.analyticsEvent.create({
      data: {
        sessionId: parsed.data.sessionId,
        eventType: parsed.data.eventType,
        path: parsed.data.path,
        referrer: parsed.data.referrer,
        device,
        browser,
        metadata: parsed.data.metadata as Prisma.InputJsonValue | undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
