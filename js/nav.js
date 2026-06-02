export function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    mobileNav.classList.toggle("hidden");
    const expanded = !mobileNav.classList.contains("hidden");
    toggle.setAttribute("aria-expanded", String(expanded));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.add("hidden");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}
