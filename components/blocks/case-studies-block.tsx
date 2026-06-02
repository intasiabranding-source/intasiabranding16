import Image from "next/image";
import { AnimatedSection } from "@/components/marketing/animated-section";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { prisma } from "@/lib/db";

export async function CaseStudiesBlock({
  content,
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const cases = await prisma.caseStudy.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: 6,
  });

  return (
    <AnimatedSection className="section-padding" preset={preset}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-h2 font-display font-bold">
          {(content.title as string) ?? "Case Studies"}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c: { id: string; imageUrl: string | null; title: string; description: string; results: string | null }) => (
            <div key={c.id} className="group overflow-hidden rounded-xl border bg-card">
              {c.imageUrl && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={c.imageUrl}
                    alt={c.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{c.description}</p>
                {c.results && (
                  <p className="mt-3 text-sm font-medium text-primary">{c.results}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
