"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/mock-data";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

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
        onSubmit={(e) => {
          e.preventDefault();
          if (!agree) {
            toast.error("Please accept the terms to continue");
            return;
          }
          setLoading(true);
          setTimeout(() => {
            toast.success("Account created. Please verify your email.");
            router.push("/verify-email");
          }, 700);
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="first">First name</Label>
            <Input id="first" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input id="username" required />
        </div>
        <div className="space-y-1.5">
          <Label>Country</Label>
          <Select>
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
          <Input id="email" type="email" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm</Label>
            <Input id="confirm" type="password" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="referral">
            Referral code <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="referral" placeholder="e.g. ANYA-2026" />
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
