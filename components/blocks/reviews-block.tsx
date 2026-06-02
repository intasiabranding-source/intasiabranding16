import { AnimatedSection } from "@/components/marketing/animated-section";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { prisma } from "@/lib/db";
import { Star } from "lucide-react";

export async function ReviewsBlock({
  content,
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const reviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: 8,
  });

  return (
    <AnimatedSection className="section-padding bg-muted/30" preset={preset}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-h2 font-display font-bold">
          {(content.title as string) ?? "Reviews"}
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r: { id: string; rating: number; content: string; author: string; platform: string | null }) => (
            <div key={r.id} className="rounded-xl border bg-card p-4">
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mt-3 text-sm">{r.content}</p>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                — {r.author}{r.platform ? ` · ${r.platform}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
