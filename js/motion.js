export function initMarquees() {
  document.querySelectorAll("[data-marquee]").forEach((el) => {
    if (el.dataset.marqueeInit) return;
    const text = el.dataset.marquee || el.textContent?.trim() || "";
    const repeat = 8;
    const items = Array(repeat)
      .fill(`<span class="ib-marquee-item">${text}</span>`)
      .join("");
    el.innerHTML = `<div class="ib-marquee-track">${items}${items}</div>`;
    el.dataset.marqueeInit = "1";
  });
}

function isInInitialViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.95;
}

export function initStaggerParents() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.classList.remove("will-animate");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -4% 0px" }
  );

  document.querySelectorAll(".ib-stagger-parent").forEach((el) => {
    if (el.classList.contains("is-visible")) return;
    if (isInInitialViewport(el)) {
      el.classList.add("is-visible");
      return;
    }
    el.classList.add("will-animate");
    observer.observe(el);
  });
}

export function initWarpGrid() {
  const grid = document.querySelector(".ib-warp-grid");
  if (!grid) return;
  grid.addEventListener("mousemove", (e) => {
    const rect = grid.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    grid.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  grid.addEventListener("mouseleave", () => {
    grid.style.transform = "";
  });
}

export function initMotion() {
  initMarquees();
  initStaggerParents();
  initWarpGrid();
}

initMotion();
