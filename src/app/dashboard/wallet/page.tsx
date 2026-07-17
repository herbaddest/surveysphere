"use client";

import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, Wallet, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { transactions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet"
        description="Track your balance, pending rewards, and lifetime earnings."
        actions={
          <Button asChild>
            <Link href="/dashboard/withdraw">
              <ArrowDownToLine className="mr-1.5 h-4 w-4" /> Withdraw
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <BalanceCard label="Current balance" value="$217.45" icon={Wallet} highlight />
        <BalanceCard label="Pending balance" value="$32.10" icon={ArrowUpRight} />
        <BalanceCard label="Lifetime earnings" value="$1,284.60" icon={TrendingUp} />
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Recent transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id} className="border-border/60">
                  <TableCell className="text-muted-foreground">{t.date}</TableCell>
                  <TableCell className="font-medium text-foreground">{t.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "font-normal",
                        t.status === "Completed" && "bg-success/15 text-success ring-1 ring-inset ring-success/30",
                        t.status === "Pending" && "bg-warning/15 text-warning ring-1 ring-inset ring-warning/30",
                        t.status === "Processing" && "bg-primary/15 text-accent ring-1 ring-inset ring-primary/30",
                      )}
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-semibold tabular-nums",
                      t.amount >= 0 ? "text-success" : "text-foreground",
                    )}
                  >
                    {t.amount >= 0 ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
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

function BalanceCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  return (
    <Card
      className={cn(
        "border-border/60",
        highlight && "bg-gradient-to-br from-primary/20 to-surface ring-1 ring-primary/30",
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] text-accent">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
