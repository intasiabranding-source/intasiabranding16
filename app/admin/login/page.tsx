"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requestOtp } from "@/app/actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [recovery, setRecovery] = useState(false);

  const handleRequestOtp = async () => {
    setLoading(true);
    setError("");
    setInfo("");
    const result = await requestOtp(email, recovery ? "RECOVERY" : "LOGIN");
    setLoading(false);
    if (result.success) {
      setInfo(
        result.message ??
          "Verification code sent to your email via SMTP."
      );
      setStep("otp");
    } else {
      setError(result.error ?? "Failed to send verification code");
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    const result = await signIn("otp", {
      email,
      code,
      purpose: recovery ? "RECOVERY" : "LOGIN",
      redirect: false,
    });
    setLoading(false);
    if (result?.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid or expired code");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl">Super Admin</CardTitle>
          <p className="text-sm text-muted-foreground">
            {recovery
              ? "Recovery code sent via your SMTP server"
              : "Email verification via SMTP — no public registration"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "email" ? (
            <>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="admin@example.com"
                />
              </div>
              <Button onClick={handleRequestOtp} disabled={loading || !email} className="w-full">
                {loading ? "Sending..." : "Send verification code"}
              </Button>
              <button
                type="button"
                className="w-full text-center text-sm text-muted-foreground hover:text-primary"
                onClick={() => setRecovery(!recovery)}
              >
                {recovery ? "Back to login" : "Recover with backup email"}
              </button>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="code">6-digit OTP</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="mt-1 text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
                <p className="mt-1 text-xs text-muted-foreground">Expires in 5 minutes. Max 5 attempts.</p>
              </div>
              <Button onClick={handleVerify} disabled={loading || code.length !== 6} className="w-full">
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
              <Button variant="ghost" onClick={() => setStep("email")} className="w-full">
                Back
              </Button>
            </>
          )}
          {info && <p className="text-center text-sm text-green-600">{info}</p>}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
