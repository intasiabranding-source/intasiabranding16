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
        `<tr><td style="padding:8px 12px;font-weight:700;border-bottom:1px solid #eee;width:120px">${esc(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${esc(value)}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 8px;color:#0a0a0a">New contact form message</h2>
      <p style="color:#6b7280;margin:0 0 20px">Sent from your Intasia Branding website</p>
      <table style="width:100%;border-collapse:collapse;border:2px solid #0a0a0a;border-radius:8px;overflow:hidden">${tableRows}</table>
      <div style="margin-top:20px;padding:16px;background:#f9f4ee;border:2px solid #0a0a0a;border-radius:8px">
        <p style="margin:0 0 8px;font-weight:700">Message</p>
        <p style="margin:0;white-space:pre-wrap;line-height:1.6">${esc(data.message)}</p>
      </div>
      <p style="margin-top:20px;font-size:12px;color:#9ca3af">Reply directly to ${esc(data.email)}</p>
    </div>
  `;
}

export function buildAutoReplyEmail(name: string, brandName: string) {
  return `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px;border:3px solid #0a0a0a;border-radius:12px;background:#f9f4ee">
      <h2 style="margin:0 0 12px;color:#0a0a0a">Thanks, ${esc(name)}!</h2>
      <p style="color:#374151;line-height:1.6;margin:0 0 16px">We received your message and will get back to you shortly — usually within a few hours.</p>
      <p style="color:#374151;line-height:1.6;margin:0">— Team ${esc(brandName)}</p>
    </div>
  `;
}
