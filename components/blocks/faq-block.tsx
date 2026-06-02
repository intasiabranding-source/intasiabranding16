import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { prisma } from "@/lib/db";
import { FaqAccordion } from "./faq-accordion";

export async function FaqBlock({
  content,
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const faqs = await prisma.faq.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return <FaqAccordion faqs={faqs} content={content} preset={preset} />;
}
