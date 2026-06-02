import { escapeHtml } from "../config.js";

export function renderStats(content = {}, stats = []) {
  const section = document.createElement("section");
  section.className = "ib-section ib-section--lime ib-stats-band ib-reveal";
  section.innerHTML = `
    <div class="ib-container">
      <h2 class="ib-display text-center text-2xl md:text-3xl">${escapeHtml(content.title || "Our Impact")}</h2>
      <div class="ib-stats-grid mt-12 ib-stagger-parent">
        ${stats
          .map(
            (stat) => `
          <div class="ib-stagger-child text-center">
            <p class="ib-stat-num"><span data-count-to="${escapeHtml(String(stat.value))}" data-suffix="${escapeHtml(stat.suffix || "")}">0</span></p>
            <p class="mt-2 font-semibold">${escapeHtml(stat.label)}</p>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
  return section;
}
