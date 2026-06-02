import { escapeHtml } from "../config.js";

export function renderGenericSection(type, content = {}) {
  const section = document.createElement("section");
  section.className = "ib-section ib-section--white ib-py ib-reveal";
  const title = content.title || type;
  section.innerHTML = `
    <div class="ib-container text-center">
      <h2 class="ib-display text-3xl">${escapeHtml(title)}</h2>
      ${content.subtitle ? `<p class="mx-auto mt-4 max-w-2xl text-[var(--ib-gray)]">${escapeHtml(content.subtitle)}</p>` : ""}
    </div>
  `;
  return section;
}

export function renderRichText(content = {}) {
  const section = document.createElement("section");
  section.className = "ib-section ib-section--cream ib-py ib-grain ib-reveal";
  section.innerHTML = `
    <div class="ib-container max-w-3xl">
      ${content.title ? `<h2 class="ib-display text-3xl">${escapeHtml(content.title)}</h2>` : ""}
      <div class="prose prose-lg mt-6 max-w-none leading-relaxed">${content.body || ""}</div>
    </div>
  `;
  return section;
}

export function renderContactStrip() {
  const section = document.createElement("section");
  section.className = "ib-section ib-section--forest ib-py";
  section.innerHTML = `
    <div class="ib-container text-center text-white">
      <p class="text-lg font-semibold">Ready to start?</p>
      <a href="/contact" class="ib-btn ib-btn--lime mt-4 inline-flex">Contact Us Today</a>
    </div>
  `;
  return section;
}
