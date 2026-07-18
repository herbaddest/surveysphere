"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type Membership = "Bronze" | "Silver" | "Gold" | "Platinum";
const TIER_ORDER: Record<Membership, number> = { Bronze: 0, Silver: 1, Gold: 2, Platinum: 3 };

interface Survey {
  id: string;
  name: string;
  reward: number;
  time_minutes: number;
  category: string;
  membership_required: Membership;
}

interface Question {
  id: string;
  text: string;
  options: string[];
}

export default function SurveyExperience() {
  const { surveyId } = useParams<{ surveyId: string }>();

  const [survey, setSurvey] = useState<Survey | null | undefined>(undefined);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [membership, setMembership] = useState<Membership>("Bronze");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const [{ data: surveyRow }, { data: questionRows }, { data: completion }, profileResult] =
        await Promise.all([
          supabase
            .from("surveys")
            .select("id, name, reward, time_minutes, category, membership_required")
            .eq("id", surveyId)
            .maybeSingle(),
          supabase
            .from("survey_questions")
            .select("id, text, options")
            .eq("survey_id", surveyId)
            .order("position", { ascending: true }),
          user
            ? supabase
                .from("survey_completions")
                .select("id")
                .eq("survey_id", surveyId)
                .eq("user_id", user.id)
                .maybeSingle()
            : Promise.resolve({ data: null }),
          user
            ? supabase.from("profiles").select("membership").eq("id", user.id).single()
            : Promise.resolve({ data: null }),
        ]);

      setSurvey(surveyRow ?? null);
      setQuestions(questionRows ?? []);
      setAlreadyDone(Boolean(completion));
      if (profileResult.data) setMembership(profileResult.data.membership as Membership);
    }

    load();
  }, [surveyId]);

  if (survey === undefined) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!survey) {
    return (
      <Card className="p-10 text-center">
        <p className="text-sm text-muted-foreground">Survey not found.</p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/surveys">Back to surveys</Link>
        </Button>
      </Card>
    );
  }

  const locked = TIER_ORDER[survey.membership_required] > TIER_ORDER[membership];

  if (locked) {
    return (
      <Card className="flex flex-col items-center p-10 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-warning/15 text-warning ring-1 ring-inset ring-warning/30">
          <Lock className="h-6 w-6" />
        </div>
        <h3 className="mt-5 text-base font-semibold text-foreground">
          {survey.membership_required}+ membership required
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          This survey is only available to {survey.membership_required} members and above. Upgrade
          your plan to unlock it.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/surveys">Back to surveys</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/settings">Upgrade plan</Link>
          </Button>
        </div>
      </Card>
    );
  }

  if (alreadyDone && !done) {
    return (
      <Card className="p-10 text-center">
        <p className="text-sm text-muted-foreground">You've already completed this survey.</p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/surveys">Back to surveys</Link>
        </Button>
      </Card>
    );
  }

  const total = questions.length;
  const q = questions[step];
  const progress = total ? ((step + (done ? 1 : 0)) / total) * 100 : 0;
  const canNext = Boolean(q && answers[q.id]);

  async function handleSubmit() {
    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !survey) {
      toast.error("You need to be signed in to submit a survey");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("survey_completions").insert({
      user_id: user.id,
      survey_id: survey.id,
      reward: survey.reward,
    });

    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setDone(true);
    toast.success(`Reward of $${survey.reward.toFixed(2)} credited`);
  }

  if (done) {
    return (
      <div className="space-y-6">
        <PageHeader title="Survey complete" />
        <Card className="glass border-border/60 p-10 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow"
          >
            <Check className="h-8 w-8" />
          </motion.div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
            Thank you for your responses
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your reward has been credited to your wallet.
          </p>
          <div className="mx-auto mt-8 max-w-xs rounded-2xl bg-white/[0.03] p-6 ring-1 ring-inset ring-white/10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Reward earned</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
              ${survey.reward.toFixed(2)}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-accent">
              <Sparkles className="h-3 w-3" /> Credited instantly
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <Button variant="secondary" asChild>
              <Link href="/dashboard/wallet">View wallet</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/surveys">Take another</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={survey.name}
        description={`${survey.category} · ${survey.time_minutes} min · Reward $${survey.reward.toFixed(2)}`}
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/surveys">
              <ArrowLeft className="mr-1 h-4 w-4" /> Exit
            </Link>
          </Button>
        }
      />

      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Question {step + 1} of {total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {q && (
        <Card className="glass border-border/60 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                {q.text}
              </h2>
              <RadioGroup
                value={answers[q.id] ?? ""}
                onValueChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                className="mt-6 grid gap-3"
              >
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt;
                  return (
                    <Label
                      key={opt}
                      htmlFor={`${q.id}-${opt}`}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${
                        selected
                          ? "border-primary/60 bg-primary/10"
                          : "border-border/60 bg-white/[0.02] hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem id={`${q.id}-${opt}`} value={opt} />
                      <span className="text-foreground">{opt}</span>
                    </Label>
                  );
                })}
              </RadioGroup>
            </motion.div>
          </AnimatePresence>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        {step < total - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Next <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={!canNext || submitting} onClick={handleSubmit}>
            {submitting ? "Submitting…" : "Submit survey"} <Check className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

