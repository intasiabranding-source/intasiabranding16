import { escapeHtml } from "../config.js";

export function renderTrustBar(content = {}) {
  const items = content.items || ["Vekara", "Calkwalk", "BT Builder", "24/7 Premium Support"];
  const section = document.createElement("section");
  section.className = "ib-trust-logos ib-reveal";
  section.innerHTML = `
    <div class="ib-container">
      <div class="ib-trust-row">
        ${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </div>
  `;
  return section;
}
