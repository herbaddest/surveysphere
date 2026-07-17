"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { surveys, surveyQuestions } from "@/lib/mock-data";
import { toast } from "sonner";

export default function SurveyExperience() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const router = useRouter();
  const survey = useMemo(() => surveys.find((s) => s.id === surveyId), [surveyId]);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

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

  const total = surveyQuestions.length;
  const q = surveyQuestions[step];
  const progress = ((step + (done ? 1 : 0)) / total) * 100;
  const canNext = Boolean(answers[q?.id ?? ""]);

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
              <Sparkles className="h-3 w-3" /> Includes Gold multiplier
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
        description={`${survey.category} · ${survey.time} min · Reward $${survey.reward.toFixed(2)}`}
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
          <Button
            disabled={!canNext}
            onClick={() => {
              setDone(true);
              toast.success(`Reward of $${survey.reward.toFixed(2)} credited`);
              void router;
            }}
          >
            Submit survey <Check className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
