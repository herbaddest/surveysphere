"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Crown, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { plans, type Membership } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [switching, setSwitching] = useState<Membership | null>(null);
  const [loadingMembership, setLoadingMembership] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // Avoid hydration mismatch: theme isn't known until mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoadingMembership(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("membership")
        .eq("id", user.id)
        .single();

      if (data) setMembership(data.membership as Membership);
      setLoadingMembership(false);
    }

    load();
  }, []);

  async function handleSwitch(plan: Membership) {
    setSwitching(plan);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You need to be signed in");
      setSwitching(null);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ membership: plan })
      .eq("id", user.id);

    setSwitching(null);

    if (error) {
      toast.error(error.message);
      return;
    }

    setMembership(plan);
    toast.success(`Switched to ${plan}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Preferences, notifications, and account controls." />

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Membership</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Payments aren't wired up yet — plan changes are free during beta.
          </p>
          {loadingMembership ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map((p) => {
                const current = membership === p.name;
                return (
                  <div
                    key={p.name}
                    className={cn(
                      "flex flex-col rounded-xl border p-4",
                      current ? "border-primary/60 bg-primary/10" : "border-border/60 bg-white/[0.02]",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{p.name}</p>
                      {current && (
                        <Badge className="gap-1 bg-primary/20 text-accent">
                          <Crown className="h-3 w-3" /> Current
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.surveyLimit} · {p.multiplier} rewards
                    </p>
                    <Button
                      size="sm"
                      variant={current ? "secondary" : "default"}
                      disabled={current || switching !== null}
                      className="mt-4"
                      onClick={() => handleSwitch(p.name)}
                    >
                      {switching === p.name ? (
                        "Switching…"
                      ) : current ? (
                        <>
                          <Check className="mr-1 h-3.5 w-3.5" /> Active
                        </>
                      ) : (
                        `Switch to ${p.name}`
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Row title="Dark mode" description="Switch between light and dark theme">
            <Switch
              checked={mounted ? resolvedTheme === "dark" : true}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              disabled={!mounted}
            />
          </Row>
          <Row title="Language" description="Interface language">
            <Select defaultValue="en">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Row title="Email notifications" description="Rewards, withdrawals, and account alerts">
            <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
          </Row>
          <Row title="Push notifications" description="Real-time alerts to your device">
            <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
          </Row>
          <Row title="Marketing updates" description="Occasional platform news and offers">
            <Switch checked={marketing} onCheckedChange={setMarketing} />
          </Row>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="pw-current">Current password</Label>
            <PasswordInput id="pw-current" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw-new">New password</Label>
            <PasswordInput id="pw-new" />
          </div>
          <div className="sm:col-span-2">
            <Button onClick={() => toast.info("Password change isn't wired up yet — coming soon")}>
              Update password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/40 bg-destructive/[0.03]">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-foreground">Delete account</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Permanently remove your account and all associated data. This cannot be undone.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action is permanent. Your rewards balance and history will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleting}
                  onClick={async () => {
                    setDeleting(true);
                    const res = await fetch("/api/delete-account", { method: "POST" });
                    setDeleting(false);

                    if (!res.ok) {
                      toast.error("Couldn't delete account — try again");
                      return;
                    }

                    const supabase = createClient();
                    await supabase.auth.signOut();
                    toast.success("Account deleted");
                    router.push("/");
                    router.refresh();
                  }}
                >
                  {deleting ? "Deleting…" : "Yes, delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-white/[0.02] p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
