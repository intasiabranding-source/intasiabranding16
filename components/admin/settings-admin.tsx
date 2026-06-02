"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSiteSettings, updateSiteTheme } from "@/app/actions/admin/settings";
import type { SiteSettings, SiteTheme } from "@prisma/client";

export function SettingsAdmin({
  settings,
  theme,
}: {
  settings: SiteSettings | null;
  theme: SiteTheme | null;
}) {
  const [site, setSite] = useState({
    brandName: settings?.brandName ?? "",
    tagline: settings?.tagline ?? "",
    contactEmail: settings?.contactEmail ?? "",
    contactPhone: settings?.contactPhone ?? "",
    whatsapp: settings?.whatsapp ?? "",
    instagram: settings?.instagram ?? "",
    address: settings?.address ?? "",
    gaMeasurementId: settings?.gaMeasurementId ?? "",
    leadNotifyEmail: settings?.leadNotifyEmail ?? "",
    autoReplySubject: settings?.autoReplySubject ?? "",
    autoReplyBody: settings?.autoReplyBody ?? "",
  });

  const [themeForm, setThemeForm] = useState({
    primaryColor: theme?.primaryColor ?? "262 83% 58%",
    accentColor: theme?.accentColor ?? "280 70% 60%",
    darkModeDefault: theme?.darkModeDefault ?? true,
  });

  const handleSaveSite = async () => {
    await updateSiteSettings(site);
    alert("Settings saved");
  };

  const handleSaveTheme = async () => {
    await updateSiteTheme(themeForm);
    alert("Theme saved");
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Brand & Contact</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(site).map(([key, value]) => (
            <div key={key}>
              <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
              {key.includes("Body") ? (
                <Textarea
                  value={value}
                  onChange={(e) => setSite({ ...site, [key]: e.target.value })}
                />
              ) : (
                <Input
                  value={value}
                  onChange={(e) => setSite({ ...site, [key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <Button onClick={handleSaveSite}>Save Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Primary Color (HSL)</Label>
            <Input
              value={themeForm.primaryColor}
              onChange={(e) => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
            />
          </div>
          <div>
            <Label>Accent Color (HSL)</Label>
            <Input
              value={themeForm.accentColor}
              onChange={(e) => setThemeForm({ ...themeForm, accentColor: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={themeForm.darkModeDefault}
              onChange={(e) => setThemeForm({ ...themeForm, darkModeDefault: e.target.checked })}
            />
            Dark mode default
          </label>
          <Button onClick={handleSaveTheme}>Save Theme</Button>
        </CardContent>
      </Card>
    </div>
  );
}
