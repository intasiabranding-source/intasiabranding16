import { resolveSmtpConfig } from "../src/lib/email/smtp-config";
import { sendViaSmtp } from "../src/lib/email/send";

async function main() {
  console.log("--- .env SMTP check ---");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_FROM_EMAIL:", process.env.SMTP_FROM_EMAIL);
  console.log("SMTP_PASS set:", Boolean(process.env.SMTP_PASS));
  console.log("ENCRYPTION_KEY length:", process.env.ENCRYPTION_KEY?.length ?? 0);
  console.log("DATABASE_URL looks placeholder:", /ep-xxxx|USER:PASSWORD/.test(process.env.DATABASE_URL ?? ""));

  try {
    const config = await resolveSmtpConfig();
    if (!config) {
      console.error("\nFAIL: No SMTP config resolved (check DB profile or .env SMTP_*)");
      process.exit(1);
    }
    console.log("\nResolved SMTP:", {
      host: config.host,
      port: config.port,
      username: config.username,
      fromEmail: config.fromEmail,
      source: config.source,
    });

    const to = process.env.ADMIN_PRIMARY_EMAIL;
    if (!to) {
      console.log("\nSkip send test: no ADMIN_PRIMARY_EMAIL");
      return;
    }
    console.log("\nSending test email to", to, "...");
    const result = await sendViaSmtp({
      to,
      subject: "SMTP test from digital-growth-ecosystem",
      html: "<p>If you see this, SMTP works.</p>",
    });
    console.log("Send result:", result);
    process.exit(result.success ? 0 : 1);
  } catch (e) {
    console.error("\nError:", e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

main();
