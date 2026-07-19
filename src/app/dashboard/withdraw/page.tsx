"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const methods = [
  { id: "paypal", name: "PayPal", detail: "Instant · 0 fees" },
  { id: "wise", name: "Wise", detail: "1–2 days · Low fees" },
  { id: "bank", name: "Bank transfer", detail: "2–5 days · SWIFT" },
  { id: "usdt", name: "USDT (TRC-20)", detail: "Minutes · Network fee" },
];

const history = [
  { id: "w1", date: "2026-07-12", method: "PayPal", amount: 45.0, status: "Processing" as const },
  { id: "w2", date: "2026-06-28", method: "Wise", amount: 120.0, status: "Completed" as const },
  { id: "w3", date: "2026-06-10", method: "USDT", amount: 80.0, status: "Completed" as const },
];

// Mirrors public.tier_withdrawal_gate() in the DB — lifetime completions required to unlock withdrawals
const WITHDRAWAL_GATE: Record<string, number> = {
  Bronze: 20,
  Silver: 10,
  Gold: 5,
  Platinum: 0,
  Diamond: 0,
};

export default function WithdrawPage() {
  const [method, setMethod] = useState("paypal");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [membership, setMembership] = useState("Bronze");
  const [completedCount, setCompletedCount] = useState(0);

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

      const [{ data: profile }, { count }] = await Promise.all([
        supabase.from("profiles").select("wallet_balance, membership").eq("id", user.id).single(),
        supabase
          .from("survey_completions")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      setWalletBalance(profile?.wallet_balance ?? 0);
      setMembership(profile?.membership ?? "Bronze");
      setCompletedCount(count ?? 0);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const gate = WITHDRAWAL_GATE[membership] ?? 999999;
  const remaining = Math.max(0, gate - completedCount);
  const locked = remaining > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Withdraw"
        description="Payouts in USD. All withdrawals are reviewed for account security."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Request a withdrawal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {locked ? (
              <div className="rounded-xl border border-warning/30 bg-warning/10 p-6 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-warning/15 text-warning ring-1 ring-inset ring-warning/30">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  Withdrawals locked on {membership}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Complete {remaining} more survey{remaining === 1 ? "" : "s"} to unlock
                  withdrawals, or upgrade your plan for instant access.
                </p>
                <div className="mx-auto mt-4 max-w-xs">
                  <Progress value={(completedCount / gate) * 100} className="h-1.5" />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {completedCount} / {gate} surveys completed
                  </p>
                </div>
                <Button className="mt-5" variant="secondary" size="sm" asChild>
                  <a href="/dashboard/settings">Upgrade plan</a>
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Method</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {methods.map((m) => {
                      const selected = method === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMethod(m.id)}
                          className={cn(
                            "rounded-xl border p-4 text-left transition",
                            selected
                              ? "border-primary/60 bg-primary/10"
                              : "border-border/60 bg-white/[0.02] hover:border-primary/30",
                          )}
                        >
                          <p className="text-sm font-medium text-foreground">{m.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{m.detail}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input
                      id="amount"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available: ${walletBalance.toFixed(2)} · Minimum $10
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="details">Account details</Label>
                    <Input
                      id="details"
                      placeholder={
                        method === "usdt" ? "Wallet address" : "Email or account number"
                      }
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    if (!amount || Number(amount) < 10) {
                      toast.error("Minimum withdrawal is $10");
                      return;
                    }
                    if (Number(amount) > walletBalance) {
                      toast.error("Amount exceeds available balance");
                      return;
                    }
                    toast.success("Withdrawal request submitted");
                    setAmount("");
                    setDetails("");
                  }}
                >
                  Request withdrawal
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Good to know</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Platinum and Diamond members receive instant PayPal and USDT payouts with no completion requirement.</p>
            <p>Lower tiers must complete a minimum number of surveys before withdrawals unlock.</p>
            <p>Contact support if a payout has not arrived within its stated window.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Withdrawal history</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id} className="border-border/60">
                  <TableCell className="text-muted-foreground">{h.date}</TableCell>
                  <TableCell className="text-foreground">{h.method}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "font-normal",
                        h.status === "Completed" && "bg-success/15 text-success ring-1 ring-inset ring-success/30",
                        h.status === "Processing" && "bg-primary/15 text-accent ring-1 ring-inset ring-primary/30",
                      )}
                    >
                      {h.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-foreground">
                    ${h.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
