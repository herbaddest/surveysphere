"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Membership = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
const TIER_ORDER: Record<Membership, number> = { Bronze: 0, Silver: 1, Gold: 2, Platinum: 3, Diamond: 4 };

interface Transaction {
  id: string;
  description: string;
  type: "earn" | "withdraw" | "bonus" | "referral";
  amount: number;
  status: "Completed" | "Pending" | "Processing";
  created_at: string;
}

const toneMap: Record<string, string> = {
  primary: "bg-primary/15 text-accent",
  accent: "bg-accent/15 text-accent",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [membership, setMembership] = useState<Membership>("Bronze");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [availableSurveys, setAvailableSurveys] = useState(0);

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

      const [{ data: profile }, { data: txRows }, { data: surveyRows }, { data: completions }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("first_name, wallet_balance, membership")
            .eq("id", user.id)
            .single(),
          supabase
            .from("transactions")
            .select("id, description, type, amount, status, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20),
          supabase.from("surveys").select("id, membership_required"),
          supabase.from("survey_completions").select("survey_id").eq("user_id", user.id),
        ]);

      if (profile) {
        setFirstName(profile.first_name ?? "");
        setWalletBalance(Number(profile.wallet_balance));
        setMembership(profile.membership as Membership);
      }
      setTransactions(txRows ?? []);

      const completedIds = new Set((completions ?? []).map((c) => c.survey_id));
      const tier = TIER_ORDER[(profile?.membership as Membership) ?? "Bronze"];
      const available = (surveyRows ?? []).filter(
        (s) => !completedIds.has(s.id) && TIER_ORDER[s.membership_required as Membership] <= tier,
      );
      setAvailableSurveys(available.length);

      setLoading(false);
    }

    load();
  }, []);

  const { todayEarnings, pendingEarnings, referralEarnings } = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    let today = 0;
    let pending = 0;
    let referral = 0;
    for (const t of transactions) {
      if (t.type === "earn" && t.created_at.slice(0, 10) === todayStr) today += t.amount;
      if (t.status === "Pending") pending += Math.abs(t.amount);
      if (t.type === "referral") referral += t.amount;
    }
    return { todayEarnings: today, pendingEarnings: pending, referralEarnings: referral };
  }, [transactions]);

  const stats = [
    { label: "Wallet balance", value: `$${walletBalance.toFixed(2)}`, icon: Wallet, tone: "primary" },
    { label: "Current membership", value: membership, icon: Crown, tone: "accent" },
    { label: "Today's earnings", value: `$${todayEarnings.toFixed(2)}`, icon: TrendingUp, tone: "success" },
    { label: "Pending earnings", value: `$${pendingEarnings.toFixed(2)}`, icon: Clock, tone: "warning" },
    { label: "Available surveys", value: String(availableSurveys), icon: ClipboardList, tone: "primary" },
    { label: "Referral earnings", value: `$${referralEarnings.toFixed(2)}`, icon: Users, tone: "accent" },
  ] as const;

  return (
    <div className="space-y-8">
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        description="Here's what's happening with your account today."
        actions={
          <Button asChild>
            <Link href="/dashboard/surveys">
              <Sparkles className="mr-1.5 h-4 w-4" /> Take a survey
            </Link>
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <>
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
                {transactions.length === 0 ? (
                  <p className="px-6 py-10 text-center text-sm text-muted-foreground">
                    No activity yet — complete a survey to get started.
                  </p>
                ) : (
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
                            {new Date(t.created_at).toLocaleDateString()} · {t.status}
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
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <QuickAction to="/dashboard/surveys" icon={ClipboardList} label="Take survey" />
                <QuickAction to="/dashboard/settings" icon={Crown} label="Upgrade membership" />
                <QuickAction to="/dashboard/withdraw" icon={ArrowDownToLine} label="Withdraw" />
                <QuickAction to="/dashboard/referrals" icon={Users} label="Invite friends" />
              </CardContent>
            </Card>
          </div>
        </>
      )}
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
