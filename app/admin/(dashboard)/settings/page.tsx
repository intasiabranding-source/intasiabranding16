import { getSettings } from "@/app/actions/admin/settings";
import { SettingsAdmin } from "@/components/admin/settings-admin";

export default async function AdminSettingsPage() {
  const { settings, theme } = await getSettings();
  return (
    <div>
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <p className="text-muted-foreground">Brand, contact, theme, and GA4 configuration.</p>
      <SettingsAdmin settings={settings} theme={theme} />
    </div>
  );
}
