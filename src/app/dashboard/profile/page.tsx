"use client";

import { Crown } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and payment details."
      />

      <Card className="border-border/60">
        <CardContent className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-lg font-semibold text-primary-foreground">
              AM
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-foreground">Alex Morgan</h2>
            <p className="text-sm text-muted-foreground">alex.morgan@example.com</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="gap-1.5 bg-primary/15 text-accent ring-1 ring-inset ring-primary/30">
                <Crown className="h-3 w-3" /> Gold member
              </Badge>
              <Badge variant="secondary" className="bg-white/[0.04] font-normal text-muted-foreground">
                United Kingdom
              </Badge>
            </div>
          </div>
          <Button variant="secondary">Change avatar</Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Personal information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field id="first" label="First name" defaultValue="Alex" />
          <Field id="last" label="Last name" defaultValue="Morgan" />
          <Field id="username" label="Username" defaultValue="alex.morgan" />
          <Field id="email" label="Email" defaultValue="alex.morgan@example.com" />
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Select defaultValue="United Kingdom">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Field id="phone" label="Phone" defaultValue="+44 20 7000 0000" />
          <div className="sm:col-span-2">
            <Button onClick={() => toast.success("Profile updated")}>Save changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Payment details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field id="paypal" label="PayPal email" defaultValue="alex.morgan@example.com" />
          <Field id="wise" label="Wise handle" defaultValue="alexmorgan" />
          <Field id="usdt" label="USDT (TRC-20) address" placeholder="TR..." />
          <Field id="iban" label="Bank IBAN" placeholder="GB00 XXXX 0000 0000" />
          <div className="sm:col-span-2">
            <Button onClick={() => toast.success("Payment details saved")}>Save payment details</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Security</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field id="current" label="Current password" type="password" />
          <Field id="new" label="New password" type="password" />
          <div className="sm:col-span-2">
            <Button onClick={() => toast.success("Password changed")}>Update password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  id,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}
