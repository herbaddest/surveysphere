"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  country: string | null;
  membership: string;
  avatar_url: string | null;
}

interface PaymentDetails {
  paypal: string;
  wise: string;
  usdt: string;
  iban: string;
}

const emptyPaymentDetails: PaymentDetails = { paypal: "", wise: "", usdt: "", iban: "" };

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({
    first_name: "",
    last_name: "",
    username: "",
    country: "",
    membership: "Bronze",
    avatar_url: null,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(emptyPaymentDetails);
  const [savingPayment, setSavingPayment] = useState(false);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setEmail(user.email ?? "");
      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, username, country, membership, payment_details, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setPaymentDetails({ ...emptyPaymentDetails, ...(data.payment_details ?? {}) });
      }
      setLoading(false);
    }

    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You need to be signed in");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        username: profile.username,
        country: profile.country,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Profile updated");
  }

  async function handlePasswordChange() {
    if (!currentPassword || !newPassword) {
      toast.error("Fill in both password fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      setChangingPassword(false);
      toast.error("Current password is incorrect");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setChangingPassword(false);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    toast.success("Password updated");
  }

  async function handleSavePaymentDetails() {
    setSavingPayment(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You need to be signed in");
      setSavingPayment(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ payment_details: paymentDetails })
      .eq("id", user.id);

    setSavingPayment(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Payment details saved");
  }

  async function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file || !userId) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WEBP image");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploadingAvatar(true);
    const supabase = createClient();

    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (uploadError) {
      setUploadingAvatar(false);
      toast.error(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    // cache-bust so the new image shows immediately even with the same filename
    const bustedUrl = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: bustedUrl })
      .eq("id", userId);

    setUploadingAvatar(false);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    setProfile((p) => ({ ...p, avatar_url: bustedUrl }));
    toast.success("Avatar updated");
  }

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() || "?";

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
        title="Profile"
        description="Manage your personal information and payment details."
      />

      <Card className="border-border/60">
        <CardContent className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20">
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="Avatar" />}
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-lg font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-foreground">
              {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-sm text-muted-foreground">{email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="gap-1.5 bg-primary/15 text-accent ring-1 ring-inset ring-primary/30">
                <Crown className="h-3 w-3" /> {profile.membership} member
              </Badge>
              {profile.country && (
                <Badge variant="secondary" className="bg-white/[0.04] font-normal text-muted-foreground">
                  {profile.country}
                </Badge>
              )}
              <Button variant="link" size="sm" asChild className="h-auto p-0 text-xs">
                <Link href="/dashboard/settings">Manage plan</Link>
              </Button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarFileChange}
          />
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
          >
            {uploadingAvatar ? "Uploading…" : "Change avatar"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Personal information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="first">First name</Label>
            <Input
              id="first"
              value={profile.first_name ?? ""}
              onChange={(e) => setProfile((p) => ({ ...p, first_name: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last">Last name</Label>
            <Input
              id="last"
              value={profile.last_name ?? ""}
              onChange={(e) => setProfile((p) => ({ ...p, last_name: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username ?? ""}
              onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Select
              value={profile.country ?? ""}
              onValueChange={(v) => setProfile((p) => ({ ...p, country: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
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
          <div className="sm:col-span-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Payment details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="paypal">PayPal email</Label>
            <Input
              id="paypal"
              placeholder="you@example.com"
              value={paymentDetails.paypal}
              onChange={(e) =>
                setPaymentDetails((p) => ({ ...p, paypal: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wise">Wise handle</Label>
            <Input
              id="wise"
              placeholder="yourhandle"
              value={paymentDetails.wise}
              onChange={(e) => setPaymentDetails((p) => ({ ...p, wise: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="usdt">USDT (TRC-20) address</Label>
            <Input
              id="usdt"
              placeholder="TR..."
              value={paymentDetails.usdt}
              onChange={(e) => setPaymentDetails((p) => ({ ...p, usdt: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="iban">Bank IBAN</Label>
            <Input
              id="iban"
              placeholder="GB00 XXXX 0000 0000"
              value={paymentDetails.iban}
              onChange={(e) => setPaymentDetails((p) => ({ ...p, iban: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <Button onClick={handleSavePaymentDetails} disabled={savingPayment}>
              {savingPayment ? "Saving…" : "Save payment details"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Security</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="current">Current password</Label>
            <Input
              id="current"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new">New password</Label>
            <Input
              id="new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Button onClick={handlePasswordChange} disabled={changingPassword}>
              {changingPassword ? "Updating…" : "Update password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
