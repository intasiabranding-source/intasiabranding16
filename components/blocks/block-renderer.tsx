import { PageSection, Service } from "@prisma/client";
import { type BlockContent } from "@/lib/cms/blocks";
import { HeroBlock } from "./hero-block";
import { ServicesGridBlock } from "./services-grid-block";
import { HowItWorksBlock } from "./how-it-works-block";
import { StatsBlock } from "./stats-block";
import { TestimonialsBlock } from "./testimonials-block";
import { ReviewsBlock } from "./reviews-block";
import { FaqBlock } from "./faq-block";
import { CtaBlock } from "./cta-block";
import { CaseStudiesBlock } from "./case-studies-block";
import { PortfolioBlock } from "./portfolio-block";
import { RichTextBlock } from "./rich-text-block";
import { TeamGridBlock } from "./team-grid-block";
import { TimelineBlock } from "./timeline-block";
import { ContactStripBlock } from "./contact-strip-block";
import { TrustBarBlock } from "./trust-bar-block";
import { getServices } from "@/lib/cms/fetch";

export async function BlockRenderer({ sections }: { sections: PageSection[] }) {
  const services: Service[] = await getServices();
  const serviceData = services.map((s) => ({
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
      {sections.map((section) => {
        const content = section.content as BlockContent;
        switch (section.type) {
          case "hero":
            return <HeroBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "trustBar":
            return <TrustBarBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "servicesGrid":
            return (
              <ServicesGridBlock
                key={section.id}
                content={content}
                services={serviceData}
                preset={section.animationPreset}
              />
            );
          case "howItWorks":
            return <HowItWorksBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "caseStudies":
            return <CaseStudiesBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "portfolio":
            return <PortfolioBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "testimonials":
            return <TestimonialsBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "reviews":
            return <ReviewsBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "stats":
            return <StatsBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "faq":
            return <FaqBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "cta":
            return <CtaBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "richText":
            return <RichTextBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "teamGrid":
            return <TeamGridBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "timeline":
            return <TimelineBlock key={section.id} content={content} preset={section.animationPreset} />;
          case "contactStrip":
            return <ContactStripBlock key={section.id} content={content} preset={section.animationPreset} />;
          default:
            return null;
        }
      })}
    </>
  );
}
