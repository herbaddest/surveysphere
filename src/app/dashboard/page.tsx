"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Crown,
  TrendingUp,
  Clock,
  ClipboardList,
  Users,
  ArrowRight,
  ArrowDownToLine,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { transactions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Wallet balance", value: "$217.45", icon: Wallet, tone: "primary" },
  { label: "Current membership", value: "Gold", icon: Crown, tone: "accent" },
  { label: "Today's earnings", value: "$18.75", icon: TrendingUp, tone: "success" },
  { label: "Pending earnings", value: "$32.10", icon: Clock, tone: "warning" },
  { label: "Available surveys", value: "24", icon: ClipboardList, tone: "primary" },
  { label: "Referral earnings", value: "$54.20", icon: Users, tone: "accent" },
] as const;

const toneMap: Record<string, string> = {
  primary: "bg-primary/15 text-accent",
  accent: "bg-accent/15 text-accent",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back, Alex"
        description="Here's what's happening with your account today."
        actions={
          <Button asChild>
            <Link href="/dashboard/surveys">
              <Sparkles className="mr-1.5 h-4 w-4" /> Take a survey
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
          >
            <Card className="border-border/60">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-inset ring-white/10",
                    toneMap[s.tone],
                  )}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-0.5 truncate text-2xl font-semibold tracking-tight text-foreground">
                    {s.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="border-border/60 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/wallet">
                View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border/60">
              {transactions.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-muted-foreground">
                    {t.type === "withdraw" ? (
                      <ArrowDownToLine className="h-4 w-4" />
                    ) : t.type === "referral" ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      <ClipboardList className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {t.description}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.date} · {t.status}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "shrink-0 text-sm font-semibold tabular-nums",
                      t.amount >= 0 ? "text-success" : "text-foreground",
                    )}
                  >
                    {t.amount >= 0 ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <QuickAction to="/dashboard/surveys" icon={ClipboardList} label="Take survey" />
            <QuickAction to="/memberships" icon={Crown} label="Upgrade membership" />
            <QuickAction to="/dashboard/withdraw" icon={ArrowDownToLine} label="Withdraw" />
            <QuickAction to="/dashboard/referrals" icon={Users} label="Invite friends" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={to}
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-white/[0.02] px-4 py-3 transition hover:border-primary/40 hover:bg-white/[0.05]"
    >
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-accent ring-1 ring-inset ring-white/10">
        <Icon className="h-4 w-4" />
      </div>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}
