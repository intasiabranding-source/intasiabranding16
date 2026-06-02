"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/marketing/animated-section";
import { AnimationPreset } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";

export function CtaBlock({
  content,
  preset,
}: {
  content: BlockContent;
  preset: AnimationPreset;
}) {
  const subheadline = content.subheadline as string | undefined;

  return (
    <AnimatedSection className="section-padding" preset={preset}>
      <motion.div
        className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 px-8 py-16 text-center sm:px-16"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h2 className="text-h2 font-display font-bold">
          {(content.headline as string) ?? "Ready to Grow?"}
        </h2>
        {subheadline && (
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {subheadline}
          </p>
        )}
        <Button asChild size="lg" className="mt-8">
          <Link href={(content.ctaLink as string) ?? "/contact"}>
            {(content.ctaLabel as string) ?? "Get Started"}
          </Link>
        </Button>
      </motion.div>
    </AnimatedSection>
  );
}
