import { z } from "zod";
import { AnimationPreset, type Prisma } from "@prisma/client";

export const animationPresets = [
  "NONE",
  "FADE_UP",
  "STAGGER",
  "FLOAT",
  "PARALLAX_LIGHT",
] as const;

export const heroBlockSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  ctaLabel: z.string().default("Start Growing"),
  ctaLink: z.string().default("/contact"),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  trustItems: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  backgroundImage: z.string().optional(),
});

export const servicesGridSchema = z.object({
  title: z.string().default("Our Services"),
  subtitle: z.string().optional(),
});

export const ctaBlockSchema = z.object({
  headline: z.string(),
  subheadline: z.string().optional(),
  ctaLabel: z.string(),
  ctaLink: z.string(),
});

export const statsBlockSchema = z.object({
  title: z.string().optional(),
});

export const faqBlockSchema = z.object({
  title: z.string().default("Frequently Asked Questions"),
});

export const richTextBlockSchema = z.object({
  title: z.string().optional(),
  body: z.string(),
});

export const howItWorksSchema = z.object({
  title: z.string().default("How It Works"),
  steps: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().optional(),
    })
  ),
});

export const BLOCK_TYPES = [
  "hero",
  "trustBar",
  "servicesGrid",
  "howItWorks",
  "caseStudies",
  "portfolio",
  "testimonials",
  "reviews",
  "stats",
  "faq",
  "cta",
  "richText",
  "teamGrid",
  "timeline",
  "contactStrip",
  "pricingTable",
  "comparisonTable",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const blockLabels: Record<BlockType, string> = {
  hero: "Hero Section",
  trustBar: "Trust Bar",
  servicesGrid: "Services Grid",
  howItWorks: "How It Works",
  caseStudies: "Case Studies",
  portfolio: "Portfolio Showcase",
  testimonials: "Testimonials",
  reviews: "Reviews",
  stats: "Statistics",
  faq: "FAQ",
  cta: "Call to Action",
  richText: "Rich Text",
  teamGrid: "Team Grid",
  timeline: "Timeline",
  contactStrip: "Contact Strip",
  pricingTable: "Pricing Table",
  comparisonTable: "Comparison Table",
};

export function defaultBlockContent(type: BlockType): BlockContent {
  switch (type) {
    case "hero":
      return {
        headline: "Scale Your Business With Our Digital Growth Ecosystem",
        subheadline:
          "Branding, websites, apps, AI automation, and marketing — all in one premium platform.",
        ctaLabel: "Get Started",
        ctaLink: "/contact",
        secondaryCtaLabel: "Explore Services",
        secondaryCtaLink: "/services",
        trustItems: ["Brand-first strategy", "End-to-end delivery", "Dedicated support"],
      };
    case "servicesGrid":
      return { title: "Our Services", subtitle: "Everything you need to grow" };
    case "howItWorks":
      return {
        title: "How It Works",
        steps: [
          { title: "Discover", description: "We analyze your goals and market." },
          { title: "Strategize", description: "Custom growth roadmap built for you." },
          { title: "Execute", description: "Our team delivers across all channels." },
          { title: "Scale", description: "Optimize and grow with data-driven insights." },
        ],
      };
    case "cta":
      return {
        headline: "Ready to Transform Your Business?",
        subheadline: "Join hundreds of brands scaling with our ecosystem.",
        ctaLabel: "Book a Consultation",
        ctaLink: "/contact",
      };
    case "faq":
      return { title: "Frequently Asked Questions" };
    case "stats":
      return { title: "Our Impact" };
    case "richText":
      return { title: "", body: "<p>Content goes here.</p>" };
    default:
      return { title: blockLabels[type] };
  }
}

export type BlockContent = Record<string, Prisma.InputJsonValue | undefined>;

export type AnimationPresetType = AnimationPreset;
