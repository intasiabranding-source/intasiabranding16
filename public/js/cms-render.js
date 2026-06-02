import { apiFetch } from "./config.js";
import { renderBlock } from "./blocks/index.js";
import { initFaq } from "./faq.js";
import { initServicesGrid } from "./services-modal.js";
import { initStatsCounters } from "./stats.js";
import { initReveal } from "./reveal.js";

async function loadContext(pageData) {
  const ctx = {
    services: [],
    faqs: pageData.faqs || [],
    stats: [],
  };

  const needsServices = pageData.sections?.some((s) => s.type === "servicesGrid");
  const needsStats = pageData.sections?.some((s) => s.type === "stats");
  const needsFaqs = pageData.sections?.some((s) => s.type === "faq");

  const fetches = [];
  if (needsServices) fetches.push(apiFetch("/api/public/services").then((d) => (ctx.services = d.services || [])));
  if (needsStats) fetches.push(apiFetch("/api/public/stats").then((d) => (ctx.stats = d.stats || [])));
  if (needsFaqs && !ctx.faqs.length)
    fetches.push(apiFetch("/api/public/faqs").then((d) => (ctx.faqs = d.faqs || [])));

  await Promise.all(fetches);
  return ctx;
}

export async function initCmsRender() {
  const main = document.getElementById("page-content");
  if (!main) return;

  if (main.dataset.staticPage === "true") return;

  const slug = main.dataset.cmsSlug;
  if (!slug) return;

  try {
    const page = await apiFetch(`/api/public/pages/${encodeURIComponent(slug)}`);
    if (!page.sections?.length) return;

    const ctx = await loadContext(page);
    main.innerHTML = "";

    for (const section of page.sections.sort((a, b) => a.order - b.order)) {
      const el = await renderBlock(section, ctx);
      if (el) main.appendChild(el);
    }

    initReveal();
    initStatsCounters();
    initFaq();
    await initServicesGrid();
    const { initMotion } = await import("./motion.js");
    initMotion();
  } catch {
    /* keep fallback HTML */
  }
}

const main = document.getElementById("page-content");
if (main?.dataset.cmsSlug) {
  initCmsRender();
}
