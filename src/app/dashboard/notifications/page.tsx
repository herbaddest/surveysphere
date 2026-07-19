"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface AppNotification {
  id: string;
  title: string;
  body: string;
  created_at: string;
  read: boolean;
}

function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AppNotification[]>([]);
  const unread = items.filter((n) => !n.read).length;

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

      const { data } = await supabase
        .from("notifications")
        .select("id, title, body, created_at, read")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setItems(data ?? []);
      setLoading(false);
    }

    load();
  }, []);

  async function markAllRead() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Optimistic update
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
  }

  async function markOneRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    const supabase = createClient();
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  }

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
        title="Notifications"
        description="Rewards, referrals, and platform updates."
        actions={
          <Button variant="secondary" size="sm" disabled={unread === 0} onClick={markAllRead}>
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
                onClick={() => !n.read && markOneRead(n.id)}
                className={cn(
                  "flex cursor-pointer gap-4 px-6 py-4 transition hover:bg-white/[0.02]",
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
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {timeAgo(n.created_at)}
                    </span>
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
