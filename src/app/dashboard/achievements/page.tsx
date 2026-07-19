"use client";

import { useEffect, useState } from "react";
import { Trophy, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
}

export default function AchievementsPage() {
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

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

      const [{ count: completionsCount }, { data: completions }, { data: earnTxns }, { data: referredCount }] =
        await Promise.all([
          supabase
            .from("survey_completions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("survey_completions")
            .select("survey_id, surveys(category)")
            .eq("user_id", user.id),
          supabase
            .from("transactions")
            .select("amount")
            .eq("user_id", user.id)
            .eq("type", "earn"),
          supabase.rpc("get_referred_count", { p_user_id: user.id }),
        ]);

      const totalCompleted = completionsCount ?? 0;

      const distinctCategories = new Set(
        (completions ?? [])
          .map((c: { surveys: { category: string } | { category: string }[] | null }) => {
            const s = Array.isArray(c.surveys) ? c.surveys[0] : c.surveys;
            return s?.category;
          })
          .filter(Boolean),
      ).size;

      const totalEarned = (earnTxns ?? []).reduce((sum, t) => sum + t.amount, 0);

      setAchievements([
        {
          id: "a1",
          name: "First Step",
          description: "Complete your first survey",
          progress: Math.min(totalCompleted, 1),
          target: 1,
        },
        {
          id: "a2",
          name: "Consistent Voice",
          description: "Complete 25 surveys",
          progress: totalCompleted,
          target: 25,
        },
        {
          id: "a3",
          name: "Century Club",
          description: "Complete 100 surveys",
          progress: totalCompleted,
          target: 100,
        },
        {
          id: "a4",
          name: "Ambassador",
          description: "Invite 10 friends",
          progress: referredCount ?? 0,
          target: 10,
        },
        {
          id: "a5",
          name: "High Earner",
          description: "Earn $500 in rewards",
          progress: Math.round(totalEarned),
          target: 500,
        },
        {
          id: "a6",
          name: "Globetrotter",
          description: "Complete surveys from 5 categories",
          progress: distinctCategories,
          target: 5,
        },
      ]);

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements"
        description="Track milestones and unlock bonus rewards as you contribute more."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => {
          const pct = Math.min(100, Math.round((a.progress / a.target) * 100));
          const complete = pct >= 100;
          return (
            <Card
              key={a.id}
              className={cn(
                "border-border/60 p-6 transition hover:border-primary/40",
                complete && "bg-gradient-to-br from-primary/15 to-surface ring-1 ring-primary/30",
              )}
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl ring-1 ring-inset ring-white/10",
                    complete
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                      : "bg-white/[0.04] text-accent",
                  )}
                >
                  <Trophy className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                    complete
                      ? "bg-success/15 text-success ring-success/30"
                      : "bg-white/[0.04] text-muted-foreground ring-white/10",
                  )}
                >
                  {complete ? "Unlocked" : `${pct}%`}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{a.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
              <div className="mt-5">
                <Progress value={pct} className="h-1.5" />
                <p className="mt-2 text-xs tabular-nums text-muted-foreground">
                  {Math.min(a.progress, a.target)} / {a.target}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}