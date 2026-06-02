import { renderHero } from "./hero.js";
import { renderTrustBar } from "./trust-bar.js";
import { renderServicesGrid } from "./services-grid.js";
import { renderHowItWorks } from "./how-it-works.js";
import { renderCta } from "./cta.js";
import { renderFaq } from "./faq.js";
import { renderStats } from "./stats.js";
import { renderGenericSection, renderRichText, renderContactStrip } from "./generic.js";

export async function renderBlock(section, ctx) {
  const content = section.content || {};
  const type = section.type;

  switch (type) {
    case "hero":
      return renderHero(content);
    case "trustBar":
      return renderTrustBar(content);
    case "servicesGrid":
      return renderServicesGrid(content, ctx.services || []);
    case "howItWorks":
      return renderHowItWorks(content);
    case "cta":
      return renderCta(content);
    case "faq":
      return renderFaq(content, ctx.faqs || []);
    case "stats":
      return renderStats(content, ctx.stats || []);
    case "richText":
      return renderRichText(content);
    case "contactStrip":
      return renderContactStrip();
    case "caseStudies":
    case "portfolio":
    case "testimonials":
    case "reviews":
    case "teamGrid":
    case "timeline":
      return renderGenericSection(type, content);
    default:
      return null;
  }
}
