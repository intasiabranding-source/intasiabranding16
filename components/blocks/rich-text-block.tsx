import { AnimatedSection } from "@/components/marketing/animated-section";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { sanitizeHtml } from "@/lib/security/sanitize";

export function RichTextBlock({
  content,
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {
  return (
    <AnimatedSection className="section-padding" preset={preset}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-invert dark:prose-invert">
        {content.title && (
          <h2 className="text-h2 font-display font-bold mb-6">{content.title as string}</h2>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml((content.body as string) ?? ""),
          }}
        />
      </div>
    </AnimatedSection>
  );
}
