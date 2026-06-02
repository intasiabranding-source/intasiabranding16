import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/marketing/animated-section";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { prisma } from "@/lib/db";

export async function PortfolioBlock({
  content,
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const items = await prisma.portfolioItem.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: 9,
  });

  return (
    <AnimatedSection className="section-padding bg-muted/30" preset={preset}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-h2 font-display font-bold">
          {(content.title as string) ?? "Portfolio"}
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: { id: string; imageUrl: string | null; title: string; link: string | null }) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl">
              {item.imageUrl && (
                <div className="relative aspect-[4/3]">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
              )}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                <h3 className="font-semibold text-white">{item.title}</h3>
                {item.link && (
                  <Link href={item.link} className="mt-2 text-sm text-primary-foreground underline">
                    View Project
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
