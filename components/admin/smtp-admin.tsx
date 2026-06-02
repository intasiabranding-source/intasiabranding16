"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  saveSmtpProfile,
  testSmtpEmail,
  testOtpSmtpEmail,
  updateSiteSettings,
} from "@/app/actions/admin/settings";
import type { SmtpProfile, EmailLog, SiteSettings } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export function SmtpAdmin({
  profiles,
  logs,
  settings,
  smtpReady,
}: {
  profiles: SmtpProfile[];
  logs: EmailLog[];
  settings: SiteSettings | null;
  smtpReady: boolean;
}) {
  const [form, setForm] = useState({
    name: "Primary SMTP",
    host: "",
    port: "587",
    username: "",
    password: "",
    encryption: "TLS",
    fromEmail: "",
    fromName: "",
    isActive: true,
  });
  const [testTo, setTestTo] = useState("");
  const [otpTemplates, setOtpTemplates] = useState({
    otpLoginSubject: settings?.otpLoginSubject ?? "",
    otpLoginBody: settings?.otpLoginBody ?? "",
    otpRecoverySubject: settings?.otpRecoverySubject ?? "",
    otpRecoveryBody: settings?.otpRecoveryBody ?? "",
    useSmtpForAuth: settings?.useSmtpForAuth ?? true,
  });

  const handleSave = async () => {
    await saveSmtpProfile({
      name: form.name,
      host: form.host,
      port: parseInt(form.port, 10),
      username: form.username,
      password: form.password,
      encryption: form.encryption,
      fromEmail: form.fromEmail,
      fromName: form.fromName,
      isActive: form.isActive,
    });
    alert("SMTP profile saved and set as active.");
    window.location.reload();
  };

  const handleSaveOtpTemplates = async () => {
    await updateSiteSettings(otpTemplates);
    alert("OTP email templates saved.");
  };

  const handleTest = async () => {
    const result = await testSmtpEmail(testTo);
    alert(result.success ? "Test email sent via SMTP!" : result.error);
  };

  const handleTestOtp = async () => {
    const result = await testOtpSmtpEmail(testTo);
    alert(
      result.success
        ? "Sample login verification code sent via SMTP!"
        : result.error
    );
  };

  return (
    <div className="mt-8 space-y-8">
      <Card className={smtpReady ? "border-green-500/50" : "border-amber-500/50"}>
        <CardContent className="pt-6">
          <p className="text-sm">
            {smtpReady ? (
              <span className="text-green-600 font-medium">
                SMTP is configured. Admin login, recovery, contact forms, and lead emails use this server.
              </span>
            ) : (
              <span className="text-amber-600 font-medium">
                SMTP not configured. Admin login verification codes will fail until you save an active profile below or set SMTP_* in .env.
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SMTP Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Used for admin OTP login, recovery, contact form, and notifications.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {(["name", "host", "port", "username", "password", "fromEmail", "fromName"] as const).map(
              (field) => (
                <div key={field}>
                  <Label className="capitalize">{field}</Label>
                  <Input
                    type={field === "password" ? "password" : field === "port" ? "number" : "text"}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder={
                      field === "host"
                        ? "smtp.gmail.com"
                        : field === "port"
                          ? "587"
                          : undefined
                    }
                  />
                </div>
              )
            )}
            <div>
              <Label>Encryption</Label>
              <select
                className="w-full rounded-lg border bg-background px-3 py-2"
                value={form.encryption}
                onChange={(e) => setForm({ ...form, encryption: e.target.value })}
              >
                <option value="TLS">TLS (port 587)</option>
                <option value="SSL">SSL (port 465)</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Set as active SMTP profile
            </label>
            <Button onClick={handleSave}>Save SMTP Profile</Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test SMTP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
                placeholder="your@email.com"
              />
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleTest} variant="outline">
                  Send test email
                </Button>
                <Button onClick={handleTestOtp}>
                  Send test login code
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                &quot;Test login code&quot; uses the same SMTP path as admin sign-in.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active profiles</CardTitle>
            </CardHeader>
            <CardContent>
              {profiles.length === 0 ? (
                <p className="text-sm text-muted-foreground">No profiles yet.</p>
              ) : (
                profiles.map((p) => (
                  <div key={p.id} className="text-sm border-b py-2">
                    <p className="font-medium">
                      {p.name} {p.isActive && "— Active"}
                    </p>
                    <p className="text-muted-foreground">
                      {p.fromName} &lt;{p.fromEmail}&gt;
                    </p>
                    <p className="text-muted-foreground">
                      {p.host}:{p.port} ({p.encryption})
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin login verification emails (OTP)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize subjects and HTML. Use {"{{code}}"} and {"{{brand}}"} in custom HTML bodies.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <Label>Login subject</Label>
            <Input
              value={otpTemplates.otpLoginSubject}
              onChange={(e) =>
                setOtpTemplates({ ...otpTemplates, otpLoginSubject: e.target.value })
              }
              placeholder="Your admin login verification code"
            />
            <Label>Login HTML (optional)</Label>
            <Textarea
              value={otpTemplates.otpLoginBody}
              onChange={(e) =>
                setOtpTemplates({ ...otpTemplates, otpLoginBody: e.target.value })
              }
              rows={5}
              placeholder="<p>Your code: {{code}}</p>"
            />
          </div>
          <div className="space-y-3">
            <Label>Recovery subject</Label>
            <Input
              value={otpTemplates.otpRecoverySubject}
              onChange={(e) =>
                setOtpTemplates({
                  ...otpTemplates,
                  otpRecoverySubject: e.target.value,
                })
              }
              placeholder="Account recovery verification code"
            />
            <Label>Recovery HTML (optional)</Label>
            <Textarea
              value={otpTemplates.otpRecoveryBody}
              onChange={(e) =>
                setOtpTemplates({ ...otpTemplates, otpRecoveryBody: e.target.value })
              }
              rows={5}
            />
          </div>
          <div className="lg:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={otpTemplates.useSmtpForAuth}
                onChange={(e) =>
                  setOtpTemplates({
                    ...otpTemplates,
                    useSmtpForAuth: e.target.checked,
                  })
                }
              />
              Require SMTP for admin verification codes (recommended)
            </label>
            <p className="mt-2 text-xs text-muted-foreground">
              When unchecked, OTP falls back to Resend API if SMTP fails.
            </p>
            <Button className="mt-4" variant="secondary" onClick={handleSaveOtpTemplates}>
              Save OTP templates
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email logs</CardTitle>
        </CardHeader>
        <CardContent className="max-h-64 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="text-xs border-b py-2">
              <span
                className={
                  log.status === "SENT" ? "text-green-500" : "text-red-500"
                }
              >
                {log.status}
              </span>{" "}
              [{log.provider}] {log.to} — {log.subject}
              <br />
              <span className="text-muted-foreground">
                {formatDate(log.createdAt)}
              </span>
              {log.error && (
                <p className="text-red-400 mt-1">{log.error}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
