import { escapeHtml } from "../config.js";

export function renderFaq(content = {}, faqs = []) {
  const section = document.createElement("section");
  section.className = "ib-section ib-section--white ib-py ib-reveal";
  section.innerHTML = `
    <div class="ib-container max-w-3xl">
      <h2 class="ib-display text-center text-3xl">${escapeHtml(content.title || "FAQ")}</h2>
      <div class="mt-10 space-y-3" id="faq-accordion">
        ${faqs
          .map(
            (faq) => `
          <div class="ib-faq-item">
            <button type="button">${escapeHtml(faq.question)}<svg class="ib-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>
            <div class="ib-faq-answer">${escapeHtml(faq.answer)}</div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
  return section;
}
