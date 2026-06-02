/**
 * Tests SMTP using only .env (no database). Run: npx tsx scripts/test-smtp-direct.ts
 */
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const path = resolve(process.cwd(), ".env");
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

loadEnv();

const host = process.env.SMTP_HOST!;
const user = process.env.SMTP_USER ?? process.env.SMTP_USERNAME!;
const pass = process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD!;
const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
const to = process.env.ADMIN_PRIMARY_EMAIL!;

async function main() {
  console.log("Host:", host);
  console.log("User:", user);
  console.log("Port:", port);
  console.log("To:", to);

  if (host.includes("example.com")) {
    console.error("\nFAIL: SMTP_HOST is still smtp.example.com — use smtp.gmail.com for Gmail");
    process.exit(1);
  }
  if (user.includes("gamil")) {
    console.error("\nFAIL: SMTP_USER has typo 'gamil' — must be gmail.com");
    process.exit(1);
  }

  const secure = port === 465;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(port === 587 && { requireTLS: true }),
    tls: {
      minVersion: "TLSv1.2",
      // Windows/dev: some networks MITM TLS; app uses strict TLS in production
      rejectUnauthorized: process.env.SMTP_TLS_INSECURE !== "true",
    },
  });

  try {
    await transporter.verify();
    console.log("\nOK: SMTP server accepted login");
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject: "Direct SMTP test",
      html: "<p>SMTP works from scripts/test-smtp-direct.ts</p>",
    });
    console.log("OK: Message sent", info.messageId);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("\nFAIL:", msg);
    if (msg.includes("Invalid login") || msg.includes("535") || msg.includes("534")) {
      console.error("\nGmail fix: Use an App Password, not your normal password.");
      console.error("https://myaccount.google.com/apppasswords");
    }
    process.exit(1);
  }
}

main();
