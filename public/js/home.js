import { apiFetch, escapeHtml } from "./config.js";
import { populateServicesGrid } from "./services-modal.js";
import { initFaq } from "./faq.js";
import { initReveal } from "./reveal.js";
import { initStaggerParents } from "./motion.js";

async function loadHomeServices() {
  const grid = document.getElementById("home-services-grid");
  if (!grid) return;
  try {
    const { services } = await apiFetch("/api/public/services");
    await populateServicesGrid(grid, services);
  } catch {
    grid.innerHTML =
      '<p class="col-span-full text-center text-[var(--ib-gray)]">Services loading...</p>';
  }
}

async function loadHomeFaqs() {
  const container = document.getElementById("home-faq-list");
  if (!container) return;
  try {
    const { faqs } = await apiFetch("/api/public/faqs");
    if (!faqs?.length) return;
    container.innerHTML = faqs
      .map(
        (faq) => `
      <div class="ib-faq-item">
        <button type="button">${escapeHtml(faq.question)}<svg class="ib-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>
        <div class="ib-faq-answer">${escapeHtml(faq.answer)}</div>
      </div>
    `
      )
      .join("");
    initFaq();
  } catch {
    /* keep placeholder */
  }
}

async function initHomePage() {
  await Promise.all([loadHomeServices(), loadHomeFaqs()]).catch(() => {});
  initReveal();
  initStaggerParents();
}

const main = document.getElementById("page-content");
if (main?.dataset.staticPage === "true") {
  initHomePage();
}
