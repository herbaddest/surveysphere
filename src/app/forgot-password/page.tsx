"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

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
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast.success("Reset link sent");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
