import { getSmtpProfiles, getEmailLogs, getSettings } from "@/app/actions/admin/settings";
import { SmtpAdmin } from "@/components/admin/smtp-admin";
import { isSmtpConfigured } from "@/lib/email/smtp-config";

export default async function AdminSmtpPage() {
  const [profiles, logs, { settings }, smtpReady] = await Promise.all([
    getSmtpProfiles(),
    getEmailLogs(),
    getSettings(),
    isSmtpConfigured(),
  ]);
  return (
    <div>
      <h1 className="text-2xl font-bold">Email & SMTP</h1>
      <p className="text-muted-foreground">
        Admin login verification, contact forms, and notifications are sent through SMTP.
      </p>
      <SmtpAdmin profiles={profiles} logs={logs} settings={settings} smtpReady={smtpReady} />
    </div>
  );
}
