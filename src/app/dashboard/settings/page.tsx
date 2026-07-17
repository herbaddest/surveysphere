"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  const [dark, setDark] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Preferences, notifications, and account controls." />

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Row
            title="Dark mode"
            description="SurveySphere is optimized for dark. Light mode coming soon."
          >
            <Switch checked={dark} onCheckedChange={setDark} disabled />
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
            <Input id="pw-current" type="password" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw-new">New password</Label>
            <Input id="pw-new" type="password" />
          </div>
          <div className="sm:col-span-2">
            <Button onClick={() => toast.success("Password updated")}>Update password</Button>
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
                  onClick={() => toast.success("Account deletion requested")}
                >
                  Yes, delete
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
