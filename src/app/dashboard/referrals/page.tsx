"use client";

import { useState } from "react";
import { Copy, Check, Users, UserPlus, Coins } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const referralUrl = "https://surveysphere.app/join/AM-2026";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals"
        description="Share your link. Earn 10% of every referred member's rewards, forever."
      />

      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Your referral link</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input readOnly value={referralUrl} className="font-mono text-sm" />
          <Button
            className="shrink-0"
            onClick={() => {
              navigator.clipboard.writeText(referralUrl);
              setCopied(true);
              toast.success("Referral link copied");
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-4 w-4" /> Copy link
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={UserPlus} label="Total invites" value="14" />
        <Stat icon={Users} label="Registered friends" value="9" />
        <Stat icon={Coins} label="Referral earnings" value="$54.20" />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-accent ring-1 ring-inset ring-white/10">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
