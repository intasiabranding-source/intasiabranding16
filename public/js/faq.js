export function initFaq() {
  document.querySelectorAll(".faq-item button, .ib-faq-item button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item, .ib-faq-item");
      const wasOpen = item.classList.contains("is-open");
      item.parentElement?.querySelectorAll(".faq-item, .ib-faq-item").forEach((el) => el.classList.remove("is-open"));
      if (!wasOpen) item.classList.add("is-open");
    });
  });
}
