"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [country, setCountry] = useState("");
  const prefilledReferral = searchParams.get("ref") ?? "";

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to join. Start earning in minutes."
      footer={
        <>
          Already a member?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!agree) {
            toast.error("Please accept the terms to continue");
            return;
          }

          const formData = new FormData(e.currentTarget);
          const password = formData.get("password") as string;
          const confirm = formData.get("confirm") as string;
          if (password !== confirm) {
            toast.error("Passwords don't match");
            return;
          }

          const email = formData.get("email") as string;
          const first = formData.get("first") as string;
          const last = formData.get("last") as string;
          const username = formData.get("username") as string;
          const referral = formData.get("referral") as string;

          setLoading(true);
          const supabase = createClient();
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
              data: {
                first_name: first,
                last_name: last,
                username,
                country,
                referral_code: referral || null,
              },
            },
          });
          setLoading(false);

          if (error) {
            toast.error(error.message);
            return;
          }

          // If email confirmations are OFF, signUp() returns an active session
          // immediately — go straight to the dashboard instead of a verify-email
          // screen that will never resolve. If confirmations are ON, there's no
          // session yet, so send them to verify their inbox as before.
          if (data.session) {
            toast.success("Account created");
            router.push("/dashboard");
            router.refresh();
          } else {
            toast.success("Account created. Please verify your email.");
            router.push("/verify-email");
          }
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="first">First name</Label>
            <Input id="first" name="first" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" name="last" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" required />
        </div>
        <div className="space-y-1.5">
          <Label>Country</Label>
          <Select value={country} onValueChange={setCountry} required>
            <SelectTrigger>
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" name="password" minLength={6} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm</Label>
            <PasswordInput id="confirm" name="confirm" minLength={6} required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="referral">
            Referral code <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="referral"
            name="referral"
            placeholder="e.g. ANYA-2026"
            defaultValue={prefilledReferral}
          />
        </div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox
            id="terms"
            checked={agree}
            onCheckedChange={(v) => setAgree(Boolean(v))}
            className="mt-0.5"
          />
          <span>
            I agree to the{" "}
            <a className="text-accent hover:underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="text-accent hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}