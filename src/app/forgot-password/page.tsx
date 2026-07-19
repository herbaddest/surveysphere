"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a secure link to set a new password"
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            If an account exists for that email, you'll receive a reset link within a few minutes.
          </p>
          <Button variant="secondary" className="mt-6 w-full" onClick={() => setSent(false)}>
            Send another
          </Button>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const email = formData.get("email") as string;

            setLoading(true);
            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/reset-password`,
            });
            setLoading(false);

            if (error) {
              toast.error(error.message);
              return;
            }

            setSent(true);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
