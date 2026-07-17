"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  return (
    <AuthShell
      title="Verify your email"
      subtitle="We sent a 6-digit code to the email you registered with"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-accent ring-1 ring-inset ring-white/10">
          <MailCheck className="h-6 w-6" />
        </div>
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(v) => setCode(v)}
          containerClassName="justify-center"
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <Button
          className="w-full"
          disabled={code.length !== 6}
          onClick={() => {
            toast.success("Email verified");
            router.push("/dashboard");
          }}
        >
          Verify email
        </Button>
        <button className="text-xs text-muted-foreground hover:text-foreground">
          Resend code
        </button>
      </div>
    </AuthShell>
  );
}
