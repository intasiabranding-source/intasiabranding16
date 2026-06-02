import { apiFetch } from "./config.js";

function ensureSuccessModal() {
  if (document.getElementById("contact-success-modal")) return;

  const modal = document.createElement("div");
  modal.id = "contact-success-modal";
  modal.className = "ib-modal";
  modal.innerHTML = `
    <div class="ib-modal-panel ib-contact-success-panel" role="dialog" aria-labelledby="contact-success-title" aria-modal="true">
      <div class="ib-contact-success-icon" aria-hidden="true">✓</div>
      <h2 id="contact-success-title" class="ib-display text-2xl text-center">Message sent!</h2>
      <p id="contact-success-text" class="mt-3 text-center text-[var(--ib-gray)] leading-relaxed"></p>
      <button type="button" id="contact-success-close" class="ib-btn ib-btn--lime w-full justify-center mt-6">Got it</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) hideSuccessModal();
  });
  document.getElementById("contact-success-close")?.addEventListener("click", hideSuccessModal);
}

function showSuccessModal(message) {
  ensureSuccessModal();
  const modal = document.getElementById("contact-success-modal");
  const text = document.getElementById("contact-success-text");
  if (text) text.textContent = message;
  modal?.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function hideSuccessModal() {
  const modal = document.getElementById("contact-success-modal");
  modal?.classList.remove("is-open");
  document.body.style.overflow = "";
}

function showStatus(el, type, msg) {
  if (!el) return;
  el.className = `text-sm text-center font-medium ${
    type === "error" ? "text-red-600" : type === "success" ? "text-green-700" : "text-[var(--ib-gray)]"
  }`;
  el.textContent = msg;
}

export function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const statusEl = document.getElementById("contact-status");
  ensureSuccessModal();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideSuccessModal();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = {
      name: fd.get("name")?.toString().trim(),
      email: fd.get("email")?.toString().trim(),
      phone: fd.get("phone")?.toString().trim() || undefined,
      company: fd.get("company")?.toString().trim() || undefined,
      service: fd.get("service")?.toString().trim() || undefined,
      message: fd.get("message")?.toString().trim(),
    };

    if (!data.name || data.name.length < 2) {
      showStatus(statusEl, "error", "Please enter your name (at least 2 characters).");
      return;
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showStatus(statusEl, "error", "Please enter a valid email address.");
      return;
    }
    if (!data.message || data.message.length < 10) {
      showStatus(statusEl, "error", "Please write a message (at least 10 characters).");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const btnLabel = btn.querySelector(".ib-btn-label") || btn;
    const originalLabel = btnLabel.textContent;
    btn.disabled = true;
    btnLabel.textContent = "Sending…";
    showStatus(statusEl, "loading", "Sending your message…");

    try {
      const result = await apiFetch("/api/public/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });
      form.reset();
      showStatus(statusEl, "success", "");
      showSuccessModal(
        result.message ||
          "Your email was sent successfully! We'll reply to you soon at the address you provided."
      );
    } catch (err) {
      showStatus(statusEl, "error", err.message || "Something went wrong. Please try again.");
    } finally {
      btn.disabled = false;
      btnLabel.textContent = originalLabel;
    }
  });
}

if (document.getElementById("contact-form")) {
  initContactForm();
}
