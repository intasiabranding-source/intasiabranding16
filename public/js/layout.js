import { apiFetch } from "./config.js";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog/", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const DEFAULT_BRAND = "Intasia Branding";
const DEFAULT_SETTINGS = {
  brandName: DEFAULT_BRAND,
  tagline: "Branding, websites, apps, and digital growth — made human.",
};

function renderHeader(brandName) {
  const links = NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join("");
  const mobileLinks = NAV_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join("");

  return `
    <header class="ib-header">
      <div class="ib-container ib-header-inner">
        <a href="/" class="ib-logo">Intasia <span>Branding</span></a>
        <nav class="ib-nav">${links}</nav>
        <div class="ib-header-actions">
          <a href="/admin/login" class="ib-btn ib-btn--outline hidden sm:inline-flex">Log in</a>
          <a href="/contact" class="ib-btn ib-btn--lime hidden sm:inline-flex">Get started</a>
          <button type="button" id="nav-toggle" class="ib-btn ib-btn--ghost lg:hidden" aria-label="Menu" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
      <div id="mobile-nav">${mobileLinks}</div>
    </header>
  `;
}

function renderFooter(settings) {
  const brand = settings.brandName || DEFAULT_BRAND;
  const year = new Date().getFullYear();
  return `
    <footer class="ib-footer">
      <div class="ib-container">
        <div class="grid gap-8 md:grid-cols-4">
          <div class="md:col-span-2">
            <p class="ib-display text-xl">${brand}</p>
            <p class="mt-3 max-w-md text-sm opacity-80">${settings.tagline || DEFAULT_SETTINGS.tagline}</p>
          </div>
          <div>
            <h4 class="font-bold text-[var(--ib-lime)]">Quick Links</h4>
            <ul class="mt-3 space-y-2 text-sm opacity-90">
              <li><a href="/services">Services</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/blog/">Blog</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-[var(--ib-lime)]">Contact</h4>
            <ul class="mt-3 space-y-2 text-sm opacity-90">
              ${settings.contactEmail ? `<li>${settings.contactEmail}</li>` : ""}
              ${settings.contactPhone ? `<li>${settings.contactPhone}</li>` : ""}
              ${settings.instagram ? `<li><a href="${settings.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a></li>` : ""}
            </ul>
          </div>
        </div>
        <p class="mt-10 border-t border-white/20 pt-6 text-center text-sm opacity-70">© ${year} ${brand}. All rights reserved.</p>
      </div>
    </footer>
  `;
}

function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (!toggle || !mobileNav) return;
  toggle.addEventListener("click", () => {
    const open = mobileNav.style.display === "block";
    mobileNav.style.display = open ? "none" : "block";
    toggle.setAttribute("aria-expanded", String(!open));
  });
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.style.display = "none";
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function applyThemeFromSettings(theme) {
  if (!theme) return;
  document.documentElement.style.setProperty(
    "--ib-lime",
    `hsl(${theme.primaryColor || "68 100% 50%"})`
  );
}

/** Paint header/footer immediately — never wait on network. */
function paintShell(settings = DEFAULT_SETTINGS) {
  document.documentElement.classList.add("ib-site", "ib-ready");
  document.body.classList.add("ib-site");

  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = renderHeader(settings.brandName);
  if (footerEl) footerEl.innerHTML = renderFooter(settings);

  initMobileNav();
}

async function fetchSettings() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1200);
  try {
    return await apiFetch("/api/public/settings", { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function hydrateSettings() {
  try {
    const settings = await fetchSettings();
    applyThemeFromSettings(settings.theme);
    const footerEl = document.getElementById("site-footer");
    if (footerEl) footerEl.innerHTML = renderFooter(settings);
    const { initAnalytics } = await import("./analytics.js");
    initAnalytics(settings.gaMeasurementId);
    if (document.title === "Digital Growth Ecosystem" || !document.title) {
      document.title = settings.brandName || DEFAULT_BRAND;
    }
  } catch {
    const { initAnalytics } = await import("./analytics.js");
    initAnalytics();
  }
}

async function runDeferredEnhancements() {
  const [{ initReveal }, { initStatsCounters }, { initFaq }, { initServicesGrid }] =
    await Promise.all([
      import("./reveal.js"),
      import("./stats.js"),
      import("./faq.js"),
      import("./services-modal.js"),
    ]);

  initReveal();
  initStatsCounters();
  initFaq();
  initServicesGrid();
}

paintShell();

requestAnimationFrame(() => {
  runDeferredEnhancements();
});

hydrateSettings();
