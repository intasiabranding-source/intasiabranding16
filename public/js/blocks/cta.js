import { escapeHtml } from "../config.js";

export function renderCta(content = {}) {
  const section = document.createElement("section");
  section.className = "ib-section ib-cta-poster ib-section--lime ib-reveal";
  section.innerHTML = `
    <div class="ib-container text-center">
      <h2 class="ib-display text-3xl md:text-4xl">${escapeHtml(content.headline || "Ready to Grow?")}</h2>
      ${content.subheadline ? `<p class="mx-auto mt-4 max-w-xl">${escapeHtml(content.subheadline)}</p>` : ""}
      <a href="${escapeHtml(content.ctaLink || "/contact")}" class="ib-btn ib-btn--ink ib-btn--lg mt-8 inline-flex">${escapeHtml(content.ctaLabel || "Get Started")}</a>
    </div>
  `;
  return section;
}
