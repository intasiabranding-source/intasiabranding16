import { escapeHtml } from "../config.js";
import { renderServiceCardHtml } from "../services-modal.js";

export function renderServicesGrid(content = {}, services = []) {
  const section = document.createElement("section");
  section.className = "ib-section ib-section--cream ib-py ib-reveal";
  const grid = document.createElement("div");
  grid.className = "ib-services-grid ib-stagger-parent mt-12";
  grid.setAttribute("data-services-grid", "");
  grid.innerHTML = services.map((s) => renderServiceCardHtml(s)).join("");
  const inner = document.createElement("div");
  inner.className = "ib-container";
  inner.innerHTML = `
      <div class="text-center">
        <h2 class="ib-display text-3xl">${escapeHtml(content.title || "Our Services")}</h2>
        ${content.subtitle ? `<p class="mx-auto mt-4 max-w-2xl text-[var(--ib-gray)]">${escapeHtml(content.subtitle)}</p>` : ""}
      </div>
  `;
  inner.appendChild(grid);
  section.appendChild(inner);
  return section;
}
