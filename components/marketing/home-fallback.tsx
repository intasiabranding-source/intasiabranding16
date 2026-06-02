import { HeroBlock } from "@/components/blocks/hero-block";
import { TrustBarBlock } from "@/components/blocks/trust-bar-block";
import { ServicesGridBlock } from "@/components/blocks/services-grid-block";
import { HowItWorksBlock } from "@/components/blocks/how-it-works-block";
import { CaseStudiesBlock } from "@/components/blocks/case-studies-block";
import { PortfolioBlock } from "@/components/blocks/portfolio-block";
import { TestimonialsBlock } from "@/components/blocks/testimonials-block";
import { ReviewsBlock } from "@/components/blocks/reviews-block";
import { StatsBlock } from "@/components/blocks/stats-block";
import { FaqBlock } from "@/components/blocks/faq-block";
import { CtaBlock } from "@/components/blocks/cta-block";
import { getServices } from "@/lib/cms/fetch";
import { defaultBlockContent } from "@/lib/cms/blocks";

export async function HomeFallback() {
  const services = await getServices();

  const serviceData = services.map((s: {
    id: string;
    slug: string;
    title: string;
    description: string;
    shortDesc: string | null;
    category: string;
    features: unknown;
    pricing: string | null;
    priceNote: string | null;
    ctaLabel: string;
    ctaLink: string;
    imageUrl: string | null;
    gallery: unknown;
  }) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.description,
    shortDesc: s.shortDesc,
    category: s.category,
    features: (s.features as string[]) ?? [],
    pricing: s.pricing,
    priceNote: s.priceNote,
    ctaLabel: s.ctaLabel,
    ctaLink: s.ctaLink,
    imageUrl: s.imageUrl,
    gallery: (s.gallery as string[]) ?? [],
  }));

  return (
    <>
      <HeroBlock content={defaultBlockContent("hero")} preset="FADE_UP" />
      <TrustBarBlock content={{}} preset="NONE" />
      <ServicesGridBlock
        content={defaultBlockContent("servicesGrid")}
        services={serviceData}
        preset="STAGGER"
      />
      <HowItWorksBlock content={defaultBlockContent("howItWorks")} preset="FADE_UP" />
      <CaseStudiesBlock content={{ title: "Case Studies" }} preset="FADE_UP" />
      <PortfolioBlock content={{ title: "Portfolio" }} preset="FADE_UP" />
      <TestimonialsBlock content={{}} preset="FADE_UP" />
      <ReviewsBlock content={{}} preset="FADE_UP" />
      <StatsBlock content={{ title: "Our Impact" }} preset="FADE_UP" />
      <FaqBlock content={{ title: "FAQ" }} preset="FADE_UP" />
      <CtaBlock content={defaultBlockContent("cta")} preset="FLOAT" />
    </>
  );
}

