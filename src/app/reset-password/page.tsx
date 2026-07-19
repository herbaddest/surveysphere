"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session));
    });
  }, []);

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a new password for your account"
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {!ready ? (
        <p className="text-center text-sm text-muted-foreground">
          This reset link is invalid or has expired.{" "}
          <Link href="/forgot-password" className="text-accent hover:underline">
            Request a new one
          </Link>
          .
        </p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const password = formData.get("password") as string;
            const confirm = formData.get("confirm") as string;

            if (password !== confirm) {
              toast.error("Passwords don't match");
              return;
            }
            if (password.length < 6) {
              toast.error("Password must be at least 6 characters");
              return;
            }

            setLoading(true);
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({ password });
            setLoading(false);

            if (error) {
              toast.error(error.message);
              return;
            }

            toast.success("Password updated");
            router.push("/dashboard");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <PasswordInput id="password" name="password" minLength={6} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <PasswordInput id="confirm" name="confirm" minLength={6} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating…" : "Update password"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
