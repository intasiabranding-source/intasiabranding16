"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { type BlockContent } from "@/lib/cms/blocks";
import { ArrowRight, Star } from "lucide-react";

type HeroContent = {
  headline?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaLink?: string;
  secondaryCtaLabel?: string;
  secondaryCtaLink?: string;
  trustItems?: string[];
  imageUrl?: string;
};

export function HeroBlock({
  content,
}: {
  content: BlockContent;
}) {

  const c = content as HeroContent;

  return (
    <section className="relative min-h-[90vh] overflow-hidden pt-24">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -left-32 bottom-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Star className="h-3.5 w-3.5 fill-primary" />
              Premium Digital Growth Ecosystem
            </span>
          </motion.div>
          <motion.h1
            className="text-hero mt-6 font-display font-bold text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {c.headline ?? "Scale Your Business"}
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-body text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {c.subheadline}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button asChild size="lg">
              <Link href={c.ctaLink ?? "/contact"}>
                {c.ctaLabel ?? "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {c.secondaryCtaLabel && (
              <Button asChild variant="outline" size="lg">
                <Link href={c.secondaryCtaLink ?? "/services"}>{c.secondaryCtaLabel}</Link>
              </Button>
            )}
          </motion.div>
          {c.trustItems && c.trustItems.length > 0 && (
            <motion.div
              className="mt-10 flex flex-wrap gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {c.trustItems.map((item) => (
                <span key={item} className="text-sm font-medium text-muted-foreground">
                  ✓ {item}
                </span>
              ))}
            </motion.div>
          )}
        </div>

        <div className="relative hidden lg:block">
          <motion.div
            className="relative aspect-square"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-4 rounded-3xl glass-card p-4">
              <Image
                src={c.imageUrl ?? "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"}
                alt="Digital growth"
                width={600}
                height={600}
                className="rounded-2xl object-cover"
                priority
              />
            </div>
            <FloatingCard className="absolute -left-8 top-1/4" label="Partner brands" />
            <FloatingCard className="absolute -right-4 bottom-1/4" label="Dedicated support" delay={1} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  className,
  label,
  delay = 0,
}: {
  className?: string;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`glass-card rounded-xl px-4 py-3 shadow-lg ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}

    >
      <p className="text-sm font-semibold">{label}</p>
    </motion.div>
  );
}

