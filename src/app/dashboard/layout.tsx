import type { Metadata } from "next";
import { Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopbarStatus } from "@/components/dashboard/topbar-status";
import { Input } from "@/components/ui/input";

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
              <TopbarStatus />
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
