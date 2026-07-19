"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Users, Coins, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [referredCount, setReferredCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const [{ data: profile }, { data: countResult }, { data: refTxns }] = await Promise.all([
        supabase.from("profiles").select("referral_code").eq("id", user.id).single(),
        supabase.rpc("get_referred_count", { p_user_id: user.id }),
        supabase
          .from("transactions")
          .select("amount")
          .eq("user_id", user.id)
          .eq("type", "referral"),
      ]);

      setReferralCode(profile?.referral_code ?? "");
      setReferredCount(countResult ?? 0);
      setReferralEarnings((refTxns ?? []).reduce((sum, t) => sum + t.amount, 0));
      setLoading(false);
    }

    load();
  }, []);

  const referralUrl = referralCode
    ? `${typeof window !== "undefined" ? window.location.origin : "https://surveysphere.app"}/register?ref=${referralCode}`
    : "";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals"
        description="Share your link. Earn a $5.00 bonus when a friend completes their first survey."
      />

      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Your referral link</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input readOnly value={referralUrl} className="font-mono text-sm" />
          <Button
            className="shrink-0"
            disabled={!referralUrl}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat icon={Users} label="Referred friends" value={String(referredCount)} />
        <Stat icon={Coins} label="Referral earnings" value={`$${referralEarnings.toFixed(2)}`} />
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