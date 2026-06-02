export function initStatsCounters() {
  const counters = document.querySelectorAll("[data-count-to]:not([data-count-done])");
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.countTo || "0");
    if (!Number.isFinite(target)) return;

    const suffix = el.dataset.suffix || "";
    const duration = 750;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(target * progress);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = `${target}${suffix}`;
    };
    requestAnimationFrame(step);
    el.dataset.countDone = "1";
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  counters.forEach((el) => observer.observe(el));
}
