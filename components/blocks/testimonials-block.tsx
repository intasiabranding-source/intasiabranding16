import { AnimatedSection } from "@/components/marketing/animated-section";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { prisma } from "@/lib/db";
import Image from "next/image";

export async function TestimonialsBlock({
  content,
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: 6,
  });

  return (
    <AnimatedSection className="section-padding" preset={preset}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-h2 font-display font-bold">
          {(content.title as string) ?? "What Clients Say"}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t: { id: string; content: string; name: string; role: string | null; company: string | null; imageUrl: string | null }) => (
            <div key={t.id} className="glass-card rounded-xl p-6">
              <p className="text-muted-foreground">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                {t.imageUrl && (
                  <Image src={t.imageUrl} alt={t.name} width={40} height={40} className="rounded-full" />
                )}
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.role}{t.company ? `, ${t.company}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
