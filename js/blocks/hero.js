import { escapeHtml } from "../config.js";

export function renderHero(content = {}) {
  const c = content;
  const trustItems = (c.trustItems || [])
    .map((item) => `<span class="text-sm font-semibold">✓ ${escapeHtml(item)}</span>`)
    .join("");
  const section = document.createElement("section");
  section.className = "ib-section ib-hero ib-section--cream ib-grain";
  section.innerHTML = `
    <div class="ib-container ib-hero-grid">
      <div class="ib-hero-blocks ib-reveal hidden lg:flex">
        <div class="ib-hero-block ib-hero-block--lime">Branding</div>
        <div class="ib-hero-block ib-hero-block--purple">Development</div>
        <div class="ib-hero-block ib-hero-block--sky">Marketing</div>
      </div>
      <div class="ib-reveal">
        <span class="ib-badge">★ Premium Digital Growth</span>
        <h1 class="ib-display ib-hero-title mt-6">${escapeHtml(c.headline || "Scale Your Business")}</h1>
        <p class="mt-6 max-w-xl text-lg text-[var(--ib-gray)]">${escapeHtml(c.subheadline || "")}</p>
        <div class="mt-8 flex flex-wrap gap-4">
          <a href="${escapeHtml(c.ctaLink || "/contact")}" class="ib-btn ib-btn--lime ib-btn--lg">${escapeHtml(c.ctaLabel || "Get Started")} →</a>
          ${c.secondaryCtaLabel ? `<a href="${escapeHtml(c.secondaryCtaLink || "/services")}" class="ib-btn ib-btn--outline ib-btn--lg">${escapeHtml(c.secondaryCtaLabel)}</a>` : ""}
        </div>
        ${trustItems ? `<div class="mt-10 flex flex-wrap gap-6">${trustItems}</div>` : ""}
      </div>
    </div>
  `;
  return section;
}
