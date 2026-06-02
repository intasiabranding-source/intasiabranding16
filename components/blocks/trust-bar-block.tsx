import { AnimatedSection } from "@/components/marketing/animated-section";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";

export function TrustBarBlock({
  content,
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const items = (content.items as string[]) ?? [
    "Vekara",
    "Calkwalk",
    "BT Builder",
    "24/7 Premium Support",
  ];

  return (
    <AnimatedSection className="border-y border-border/50 bg-muted/20 py-6" preset={preset}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 text-sm font-medium text-muted-foreground sm:px-6">
        {items.map((item) => (
          <span key={item}>✦ {item}</span>
        ))}
      </div>
    </AnimatedSection>
  );
}
