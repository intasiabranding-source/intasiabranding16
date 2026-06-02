import { AnimatedSection } from "@/components/marketing/animated-section";
import { StatsCounter } from "@/components/marketing/stats-counter";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { prisma } from "@/lib/db";

export async function StatsBlock({
  content,
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const stats = await prisma.statistic.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <AnimatedSection className="section-padding" preset={preset}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-h2 font-display font-bold">
          {(content.title as string) ?? "Our Impact"}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat: { label: string; value: string; suffix: string | null }) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold gradient-text md:text-5xl">
                <StatsCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
