const REVEAL_OPTS = {
  threshold: 0.05,
  rootMargin: "0px 0px -4% 0px",
};

function isInInitialViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

export function initReveal() {
  const els = document.querySelectorAll(".reveal, .ib-reveal");
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        entry.target.classList.remove("will-animate");
        observer.unobserve(entry.target);
      }
    });
  }, REVEAL_OPTS);

  els.forEach((el) => {
    if (el.classList.contains("is-visible")) return;

    if (isInInitialViewport(el)) {
      el.classList.add("is-visible");
      return;
    }

    el.classList.add("will-animate");
    observer.observe(el);
  });
}
