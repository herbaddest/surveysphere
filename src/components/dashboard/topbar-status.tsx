"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

export function TopbarStatus() {
  const [unread, setUnread] = useState(0);
  const [membership, setMembership] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let userId: string | null = null;
    let cancelled = false;

    async function refreshUnreadCount(uid: string) {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", uid)
        .eq("read", false);
      if (!cancelled) setUnread(count ?? 0);
    }

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      userId = user.id;

      const { data: profile } = await supabase
        .from("profiles")
        .select("membership")
        .eq("id", user.id)
        .single();
      if (!cancelled) setMembership(profile?.membership ?? null);

      await refreshUnreadCount(user.id);
      if (cancelled) return;

      // Avoid double-subscribing to the same channel (React Strict Mode
      // invokes effects twice in dev)
      const channelName = `notifications-badge-${user.id}`;
      const existing = supabase.getChannels().find((c) => c.topic === `realtime:${channelName}`);
      if (existing) {
        supabase.removeChannel(existing);
      }

      supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            if (userId) refreshUnreadCount(userId);
          },
        )
        .subscribe();
    }

    init();

    return () => {
      cancelled = true;
      if (userId) {
        const channelName = `notifications-badge-${userId}`;
        const existing = supabase
          .getChannels()
          .find((c) => c.topic === `realtime:${channelName}`);
        if (existing) supabase.removeChannel(existing);
      }
    };
  }, []);

  return (
    <>
      <Button asChild variant="ghost" size="icon" className="relative">
        <Link href="/dashboard/notifications" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
      </Button>
      {membership && (
        <Badge
          variant="secondary"
          className="hidden bg-primary/15 text-accent ring-1 ring-inset ring-primary/30 md:inline-flex"
        >
          {membership} member
        </Badge>
      )}
    </>
  );
}