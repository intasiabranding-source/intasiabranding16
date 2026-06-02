import { apiFetch, escapeHtml } from "./config.js";

let servicesCache = null;
let hoverPopover = null;
let hoverTimer = null;
const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const DEFAULT_IMAGES = {
  branding: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
  "web-development": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  "mobile-apps": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
  seo: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=600&q=80",
  marketing: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
  default: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
};

export function serviceImageUrl(service) {
  if (service?.imageUrl) return service.imageUrl;
  const gallery = service?.gallery;
  if (Array.isArray(gallery) && gallery[0]) return gallery[0];
  return DEFAULT_IMAGES[service?.slug] || DEFAULT_IMAGES.default;
}

async function getServices() {
  if (servicesCache) return servicesCache;
  const data = await apiFetch("/api/public/services");
  servicesCache = data.services || [];
  return servicesCache;
}

function renderModal() {
  if (document.getElementById("service-modal")) return;
  const modal = document.createElement("div");
  modal.id = "service-modal";
  modal.className = "ib-modal";
  modal.innerHTML = `
    <div class="ib-modal-panel ib-modal-panel--wide">
      <button type="button" id="service-modal-close" class="ib-modal-close" aria-label="Close">✕</button>
      <div id="service-modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.getElementById("service-modal-close")?.addEventListener("click", closeModal);
}

function renderHoverPopover() {
  if (hoverPopover) return hoverPopover;
  hoverPopover = document.createElement("div");
  hoverPopover.id = "service-hover-popover";
  hoverPopover.className = "ib-service-popover";
  hoverPopover.setAttribute("role", "tooltip");
  hoverPopover.hidden = true;
  document.body.appendChild(hoverPopover);
  return hoverPopover;
}

function serviceModalBody(service) {
  const img = serviceImageUrl(service);
  return `
    <img class="ib-modal-hero-img" src="${escapeHtml(img)}" alt="${escapeHtml(service.title)}" loading="lazy" />
    <h3 class="ib-display text-2xl pr-8">${escapeHtml(service.title)}</h3>
    <p class="mt-4 text-[var(--ib-gray)] leading-relaxed">${escapeHtml(service.description)}</p>
    ${service.pricing ? `<p class="mt-4 text-lg font-bold">${escapeHtml(service.pricing)} ${escapeHtml(service.priceNote || "")}</p>` : ""}
    ${
      Array.isArray(service.features) && service.features.length
        ? `<ul class="mt-4 list-disc space-y-1 pl-5 text-sm">${service.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>`
        : ""
    }
    <a href="${escapeHtml(service.ctaLink || "/contact")}" class="ib-btn ib-btn--lime mt-6 inline-flex">${escapeHtml(service.ctaLabel || "Get Started")}</a>
  `;
}

function openModal(service) {
  hideHoverPopover();
  const modal = document.getElementById("service-modal");
  const body = document.getElementById("service-modal-body");
  if (!modal || !body) return;
  body.innerHTML = serviceModalBody(service);
  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("service-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  document.body.style.overflow = "";
}

function positionPopover(card, pop) {
  const rect = card.getBoundingClientRect();
  const popRect = pop.getBoundingClientRect();
  const gap = 10;
  let top = rect.top - popRect.height - gap;
  let left = rect.left + rect.width / 2 - popRect.width / 2;

  if (top < 8) top = rect.bottom + gap;
  left = Math.max(8, Math.min(left, window.innerWidth - popRect.width - 8));

  pop.style.top = `${top + window.scrollY}px`;
  pop.style.left = `${left + window.scrollX}px`;
}

function showHoverPopover(card, service) {
  if (!canHover()) return;
  const pop = renderHoverPopover();
  const img = serviceImageUrl(service);
  pop.innerHTML = `
    <img src="${escapeHtml(img)}" alt="" class="ib-service-popover-img" loading="lazy" />
    <div class="ib-service-popover-body">
      <p class="font-bold">${escapeHtml(service.title)}</p>
      <p class="text-sm text-[var(--ib-gray)] mt-1 line-clamp-3">${escapeHtml(service.shortDesc || service.description?.slice(0, 120) || "")}</p>
      <span class="ib-service-popover-hint">Click for details</span>
    </div>
  `;
  pop.hidden = false;
  pop.classList.add("is-visible");
  requestAnimationFrame(() => positionPopover(card, pop));
}

function hideHoverPopover() {
  if (!hoverPopover) return;
  hoverPopover.classList.remove("is-visible");
  hoverPopover.hidden = true;
}

function bindServiceCard(card, service) {
  card.addEventListener("click", () => openModal(service));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(service);
    }
  });

  if (!canHover()) return;

  card.addEventListener("mouseenter", () => {
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => showHoverPopover(card, service), 80);
  });
  card.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(hideHoverPopover, 120);
  });
  card.addEventListener("focus", () => showHoverPopover(card, service));
  card.addEventListener("blur", hideHoverPopover);
}

export async function initServicesGrid() {
  const grids = document.querySelectorAll("[data-services-grid]");
  if (!grids.length) return;

  renderModal();
  renderHoverPopover();
  const services = await getServices();

  grids.forEach((grid) => {
    grid.querySelectorAll("[data-service-slug]").forEach((card) => {
      const slug = card.dataset.serviceSlug;
      const service = services.find((s) => s.slug === slug);
      if (service) bindServiceCard(card, service);
    });
  });

  if (!document.body.dataset.serviceEscapeBound) {
    document.body.dataset.serviceEscapeBound = "1";
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
        hideHoverPopover();
      }
    });
    window.addEventListener(
      "scroll",
      () => hideHoverPopover(),
      { passive: true }
    );
  }
}

export function renderServiceCardHtml(s) {
  const img = serviceImageUrl(s);
  return `
    <div class="ib-card ib-service-card ib-stagger-child" data-service-slug="${escapeHtml(s.slug)}" tabindex="0" role="button">
      <div class="ib-service-card-media">
        <img src="${escapeHtml(img)}" alt="" loading="lazy" />
      </div>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.shortDesc || s.description?.slice(0, 100) || "")}</p>
    </div>
  `;
}

export async function populateServicesGrid(container, services) {
  if (!container) return;
  if (!services?.length) {
    container.innerHTML = '<p class="col-span-full text-center text-[var(--ib-gray)]">No services yet.</p>';
    return;
  }
  container.innerHTML = services.map((s) => renderServiceCardHtml(s)).join("");
  container.setAttribute("data-services-grid", "");
  container.classList.add("is-visible");
  await initServicesGrid();
}
