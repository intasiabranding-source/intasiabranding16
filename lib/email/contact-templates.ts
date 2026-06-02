import type { ContactFormInput } from "@/lib/public-api/contact";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildLeadNotifyEmail(data: ContactFormInput) {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Company", data.company || "—"],
    ["Service", data.service || "—"],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#0a0a0a;border-bottom:1px solid #e5e7eb">${label}</td><td style="padding:8px 12px;color:#374151;border-bottom:1px solid #e5e7eb">${esc(value)}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 8px;color:#0a0a0a">New contact form message</h2>
      <p style="margin:0 0 20px;color:#6b7280;font-size:14px">Submitted via Intasia Branding website</p>
      <table style="width:100%;border-collapse:collapse;border:2px solid #0a0a0a;border-radius:8px;overflow:hidden">${tableRows}</table>
      <div style="margin-top:20px;padding:16px;background:#f9f4ee;border:2px solid #0a0a0a;border-radius:8px">
        <p style="margin:0 0 8px;font-weight:700;color:#0a0a0a">Message</p>
        <p style="margin:0;color:#374151;white-space:pre-wrap;line-height:1.6">${esc(data.message)}</p>
      </div>
      <p style="margin-top:20px;font-size:12px;color:#9ca3af">Reply directly to ${esc(data.email)}</p>
    </div>
  `;
}

export function buildContactAutoReply(name: string, brandName: string) {
  return `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 8px;color:#0a0a0a">We received your message</h2>
      <p style="margin:0 0 16px;color:#374151;line-height:1.6">Hi ${esc(name)},</p>
      <p style="margin:0 0 16px;color:#374151;line-height:1.6">Thank you for reaching out to ${esc(brandName)}. Our team will get back to you shortly — usually within a few hours.</p>
      <p style="margin:0;color:#6b7280;font-size:14px">WhatsApp: +91 93420 35536 · Instagram: @intasiabranding__</p>
    </div>
  `;
}
