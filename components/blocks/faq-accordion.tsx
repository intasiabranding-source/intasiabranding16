"use client";

import { AnimatedSection } from "@/components/marketing/animated-section";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqAccordion({
  faqs,
  content,
  preset,
}: {
  faqs: { id: string; question: string; answer: string }[];
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <AnimatedSection className="section-padding" preset={preset}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-h2 font-display font-bold">
          {(content.title as string) ?? "FAQ"}
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="rounded-xl border bg-card">
              <button
                className="flex w-full items-center justify-between p-4 text-left font-medium"
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
              >
                {faq.question}
                <ChevronDown
                  className={cn("h-5 w-5 transition-transform", open === faq.id && "rotate-180")}
                />
              </button>
              {open === faq.id && (
                <div className="border-t px-4 pb-4 text-sm text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
