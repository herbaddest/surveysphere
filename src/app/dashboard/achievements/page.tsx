"use client";

import { Trophy } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { achievements } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
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
