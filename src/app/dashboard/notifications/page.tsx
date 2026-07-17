"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notifications as seed } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Rewards, referrals, and platform updates."
        actions={
          <Button
            variant="secondary"
            size="sm"
            disabled={unread === 0}
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
          >
            <Check className="mr-1.5 h-4 w-4" /> Mark all as read
          </Button>
        }
      />

      <Card className="border-border/60">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <p className="text-sm font-medium text-foreground">Inbox</p>
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
              {unread}
            </span>
            unread
          </span>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.04] text-muted-foreground">
              <Bell className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">You're all caught up.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {items.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "flex gap-4 px-6 py-4 transition hover:bg-white/[0.02]",
                  !n.read && "bg-primary/[0.04]",
                )}
              >
                <div
                  className={cn(
                    "mt-1 h-2 w-2 shrink-0 rounded-full",
                    n.read ? "bg-white/10" : "bg-accent",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-foreground">{n.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
