import { apiFetch, escapeHtml } from "./config.js";

const DEFAULT_CONTACT = {
  contactEmail: "intasiabranding@gmail.com",
  contactPhone: "9342035536",
  whatsapp: "https://wa.me/919342035536",
  instagram: "https://www.instagram.com/intasiabranding__/",
  instagramHandle: "@intasiabranding__",
};

function channelHtml(s) {
  const email = s.contactEmail || DEFAULT_CONTACT.contactEmail;
  const phone = s.contactPhone || DEFAULT_CONTACT.contactPhone;
  const wa = s.whatsapp || DEFAULT_CONTACT.whatsapp;
  const ig = s.instagram || DEFAULT_CONTACT.instagram;
  const igLabel = s.instagramHandle || DEFAULT_CONTACT.instagramHandle;
  const tel = phone.replace(/\D/g, "").length === 10 ? `+91${phone.replace(/\D/g, "")}` : phone;

  return `
    <li>
      <a class="ib-contact-channel" href="mailto:${escapeHtml(email)}">
        <span class="ib-contact-channel-icon">✉</span>
        <span><strong>Email</strong><br/>${escapeHtml(email)}</span>
      </a>
    </li>
    <li>
      <a class="ib-contact-channel" href="tel:${escapeHtml(tel)}">
        <span class="ib-contact-channel-icon">📞</span>
        <span><strong>Phone</strong><br/>${escapeHtml(phone)}</span>
      </a>
    </li>
    <li>
      <a class="ib-contact-channel" href="${escapeHtml(wa)}" target="_blank" rel="noopener noreferrer">
        <span class="ib-contact-channel-icon">💬</span>
        <span><strong>WhatsApp</strong><br/>${escapeHtml(phone)}</span>
      </a>
    </li>
    <li>
      <a class="ib-contact-channel" href="${escapeHtml(ig)}" target="_blank" rel="noopener noreferrer">
        <span class="ib-contact-channel-icon">📷</span>
        <span><strong>Instagram</strong><br/>${escapeHtml(igLabel)}</span>
      </a>
    </li>
  `;
}

async function loadContactDetails() {
  const list = document.getElementById("contact-details");
  const map = document.getElementById("contact-map");
  if (!list) return;

  list.innerHTML = channelHtml(DEFAULT_CONTACT);

  try {
    const s = await apiFetch("/api/public/settings");
    list.innerHTML = channelHtml({ ...DEFAULT_CONTACT, ...s });

    if (map && s.mapEmbedUrl) {
      map.classList.remove("hidden");
      map.innerHTML = s.mapEmbedUrl;
    }
  } catch {
    /* defaults already shown */
  }
}

loadContactDetails();
