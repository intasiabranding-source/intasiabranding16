import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { prisma } from "@/lib/db";
import { TimelineBlockClient } from "./timeline-block-client";

export async function TimelineBlock({
  content,
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const events = await prisma.timelineEvent.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return <TimelineBlockClient events={events} content={content} preset={preset} />;
}
