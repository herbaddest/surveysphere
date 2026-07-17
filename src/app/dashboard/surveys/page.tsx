"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { surveys, type Survey } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Sort = "newest" | "highest" | "shortest" | "completed";

export default function SurveysPage() {
  const [sort, setSort] = useState<Sort>("newest");

  const list = useMemo<Survey[]>(() => {
    const arr = [...surveys];
    if (sort === "highest") arr.sort((a, b) => b.reward - a.reward);
    if (sort === "shortest") arr.sort((a, b) => a.time - b.time);
    if (sort === "completed") return [];
    return arr;
  }, [sort]);

  const difficultyStyles: Record<Survey["difficulty"], string> = {
    Easy: "bg-success/15 text-success ring-success/30",
    Medium: "bg-warning/15 text-warning ring-warning/30",
    Hard: "bg-destructive/15 text-destructive ring-destructive/30",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Surveys"
        description="Fresh studies matched to your profile. Complete thoughtfully — quality matters."
      />

      <Tabs value={sort} onValueChange={(v) => setSort(v as Sort)}>
        <TabsList className="glass">
          <TabsTrigger value="newest">Newest</TabsTrigger>
          <TabsTrigger value="highest">Highest paying</TabsTrigger>
          <TabsTrigger value="shortest">Shortest</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
            >
              <Card className="group flex h-full flex-col border-border/60 p-5 transition hover:border-primary/40 hover:shadow-glow">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="bg-white/[0.04] font-normal text-muted-foreground">
                    {s.category}
                  </Badge>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                      difficultyStyles[s.difficulty],
                    )}
                  >
                    {s.difficulty}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold leading-snug text-foreground">
                  {s.name}
                </h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {s.time} min
                  </span>
                  <span>·</span>
                  <span>{s.membership}+</span>
                </div>
                <div className="mt-6 flex items-end justify-between border-t border-border/60 pt-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                      Reward
                    </p>
                    <p className="mt-0.5 text-xl font-semibold tabular-nums text-foreground">
                      ${s.reward.toFixed(2)}
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/surveys/${s.id}`}>
                      Start <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="glass flex flex-col items-center justify-center border-border/60 py-20 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-accent ring-1 ring-inset ring-white/10">
        <ClipboardList className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground">No completed surveys yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Once you finish a survey, it will show up here for your records.
      </p>
    </Card>
  );
}
