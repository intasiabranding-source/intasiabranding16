import { RichTextBlock } from "@/components/blocks/rich-text-block";
import { TeamGridBlock } from "@/components/blocks/team-grid-block";
import { TimelineBlock } from "@/components/blocks/timeline-block";
import { CtaBlock } from "@/components/blocks/cta-block";

export function AboutFallback() {
  return (
    <div className="pt-24">
      <RichTextBlock
        preset="FADE_UP"
        content={{
          title: "Our Story",
          body: "<p>We are building the world's most comprehensive digital growth ecosystem — combining premium agency services with SaaS-grade technology and AI-powered automation.</p>",
        }}
      />
      <RichTextBlock
        preset="FADE_UP"
        content={{
          title: "Vision & Mission",
          body: "<p><strong>Vision:</strong> Empower every business to scale globally through integrated digital growth.</p><p><strong>Mission:</strong> Deliver branding, development, marketing, and AI solutions that drive measurable results.</p>",
        }}
      />
      <RichTextBlock
        preset="FADE_UP"
        content={{
          title: "Core Values",
          body: "<ul><li>Innovation First</li><li>Client Success</li><li>Transparency</li><li>Excellence in Execution</li></ul>",
        }}
      />
      <TeamGridBlock content={{ title: "Meet the Team" }} preset="STAGGER" />
      <TimelineBlock content={{ title: "Company Journey" }} preset="FADE_UP" />
      <CtaBlock
        preset="FLOAT"
        content={{
          headline: "Join Our Growth Journey",
          subheadline: "Partner with us to transform your digital presence.",
          ctaLabel: "Contact Us",
          ctaLink: "/contact",
        }}
      />
    </div>
  );
}
