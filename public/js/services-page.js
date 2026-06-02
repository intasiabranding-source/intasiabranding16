import { apiFetch, escapeHtml } from "./config.js";
import { populateServicesGrid } from "./services-modal.js";
import { initReveal } from "./reveal.js";
import { initStaggerParents } from "./motion.js";

async function initServicesPage() {
  const grid = document.getElementById("services-page-grid");
  const plansEl = document.getElementById("pricing-plans");
  if (!grid && !plansEl) return;

  try {
    const data = await apiFetch("/api/public/services");
    if (grid) await populateServicesGrid(grid, data.services || []);

    if (plansEl && data.plans?.length) {
      plansEl.innerHTML = data.plans
        .map(
          (plan, i) => `
        <div class="ib-pricing-card ib-stagger-child ${plan.highlighted || i === 1 ? "ib-pricing-card--highlight" : ""}">
          <h3>${escapeHtml(plan.name)}</h3>
          <p class="ib-pricing-price">${escapeHtml(plan.price)}<span class="text-base font-normal opacity-80">${escapeHtml(plan.period)}</span></p>
          <ul class="space-y-2 text-sm opacity-90">
            ${(plan.features || []).map((f) => `<li>✓ ${escapeHtml(f)}</li>`).join("")}
          </ul>
          <a href="${escapeHtml(plan.ctaLink || "/contact")}" class="ib-btn ${plan.highlighted ? "ib-btn--ink" : "ib-btn--lime"} mt-6 w-full justify-center">${escapeHtml(plan.ctaLabel || "Choose plan")}</a>
        </div>
      `
        )
        .join("");
      plansEl.classList.add("is-visible");
    }
  } catch {
    if (grid) grid.innerHTML = '<p class="text-[var(--ib-gray)]">Unable to load services.</p>';
  }

  initReveal();
  initStaggerParents();
}

initServicesPage();
