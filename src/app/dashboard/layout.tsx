import type { Metadata } from "next";
import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dashboard — SurveySphere",
  description: "Manage your surveys, wallet, and rewards on SurveySphere.",
  robots: "noindex",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="glass sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 px-4">
            <SidebarTrigger />
            <div className="relative hidden max-w-sm flex-1 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search surveys, transactions…"
                className="h-9 border-white/5 bg-white/[0.03] pl-9"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/dashboard/notifications" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    3
                  </span>
                </Link>
              </Button>
              <Badge variant="secondary" className="hidden bg-primary/15 text-accent ring-1 ring-inset ring-primary/30 md:inline-flex">
                Gold member
              </Badge>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
