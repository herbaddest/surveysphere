"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";

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

export default function WithdrawPage() {
  const [method, setMethod] = useState("paypal");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");

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
                <p className="text-xs text-muted-foreground">Available: $217.45 · Minimum $10</p>
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
                toast.success("Withdrawal request submitted");
                setAmount("");
                setDetails("");
              }}
            >
              Request withdrawal
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Good to know</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Gold and Platinum members receive instant PayPal and USDT payouts.</p>
            <p>Bank transfers are aggregated weekly and typically settle in 2–5 business days.</p>
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
