import { escapeHtml } from "../config.js";

export function renderHowItWorks(content = {}) {
  const steps = content.steps || [];
  const section = document.createElement("section");
  section.className = "ib-section ib-section--cream ib-py ib-grain ib-reveal";
  section.innerHTML = `
    <div class="ib-container">
      <h2 class="ib-display text-center text-3xl">${escapeHtml(content.title || "How It Works")}</h2>
      <div class="ib-steps mt-12 ib-stagger-parent">
        ${steps
          .map(
            (step, i) => `
          <div class="ib-card ib-step-card ib-stagger-child">
            <span class="ib-step-num">${i + 1}</span>
            <h3 class="font-bold text-lg mt-4">${escapeHtml(step.title)}</h3>
            <p class="mt-2 text-sm text-[var(--ib-gray)]">${escapeHtml(step.description)}</p>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
  return section;
}
