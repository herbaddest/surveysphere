"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Wallet,
  Globe2,
  Sparkles,
  BadgeCheck,
  ArrowRight,
  Users,
  ClipboardList,
  Coins,
  Check,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { plans } from "@/lib/mock-data";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <PlansPreview />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="gradient-hero relative overflow-hidden pt-36 pb-24">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Verified surveys, real rewards
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          Earn Rewards by Completing{" "}
          <span className="text-gradient">Trusted Online Surveys</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
        >
          Join thousands of members worldwide and earn rewards by sharing your opinions
          through verified surveys.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" asChild>
            <Link href="/register">
              Get started <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href="/memberships">Explore memberships</Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-16 grid grid-cols-3 gap-3 sm:gap-6"
        >
          {[
            { v: "50,000+", l: "Members" },
            { v: "$2M+", l: "Rewards paid" },
            { v: "150+", l: "Countries" },
          ].map((s) => (
            <div
              key={s.l}
              className="glass rounded-2xl px-3 py-5 text-center shadow-soft"
            >
              <p className="text-xl font-semibold text-foreground sm:text-3xl">{s.v}</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TrustBar() {
  const labels = ["Nielsen-verified", "GDPR compliant", "PCI DSS", "SOC 2", "ISO 27001"];
  return (
    <section className="border-y border-border/60 bg-surface/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-6 text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {labels.map((l) => (
          <span key={l} className="inline-flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}

const features = [
  {
    icon: BadgeCheck,
    title: "Verified surveys only",
    desc: "Every study is vetted for legitimacy, fair pay, and quality methodology.",
  },
  {
    icon: Wallet,
    title: "Reliable payouts",
    desc: "Withdraw to PayPal, Wise, bank transfer, or USDT. No hidden fees.",
  },
  {
    icon: Globe2,
    title: "Global reach",
    desc: "Available in 150+ countries with locally relevant panels.",
  },
  {
    icon: Sparkles,
    title: "Smart matching",
    desc: "See surveys tailored to your profile — no wasted time on rejections.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy first",
    desc: "Your data stays yours. Anonymized responses. Never sold.",
  },
  {
    icon: Users,
    title: "Referral program",
    desc: "Earn a share of every friend's rewards. Compounding, transparent.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div {...fade} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            Why SurveySphere
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for members who value their time
          </h2>
          <p className="mt-4 text-muted-foreground">
            A quiet, focused platform. No spam. No dark patterns. Just paid opinions.
          </p>
        </motion.div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fade}
              transition={{ ...fade.transition, delay: i * 0.05 }}
              className="glass group rounded-2xl p-6 shadow-soft transition hover:shadow-glow"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-accent ring-1 ring-inset ring-white/10">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { icon: Users, title: "Create your profile", desc: "Sign up and tell us about yourself so we can match you to relevant studies." },
  { icon: ClipboardList, title: "Complete surveys", desc: "Answer thoughtfully. Most surveys take between 5 and 20 minutes." },
  { icon: Coins, title: "Get rewarded", desc: "Earn cash rewards. Withdraw in USD via your preferred method." },
];

function HowItWorks() {
  return (
    <section id="how" className="border-t border-border/60 bg-surface/30 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div {...fade} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Three steps. That's it.
          </h2>
        </motion.div>
        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              {...fade}
              transition={{ ...fade.transition, delay: i * 0.08 }}
              className="glass relative rounded-2xl p-6 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlansPreview() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div {...fade} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            Memberships
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Choose a plan that scales with you
          </h2>
          <p className="mt-4 text-muted-foreground">
            Upgrade any time. Higher tiers unlock priority surveys and reward multipliers.
          </p>
        </motion.div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              {...fade}
              transition={{ ...fade.transition, delay: i * 0.05 }}
              className={`relative rounded-2xl p-6 shadow-soft ${
                p.featured
                  ? "bg-gradient-to-b from-primary/20 to-surface ring-1 ring-primary/40"
                  : "glass"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-semibold tracking-widest text-primary-foreground uppercase">
                  Most popular
                </span>
              )}
              <p className="text-sm font-semibold text-foreground">{p.name}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight text-foreground">
                  ${p.price}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {p.benefits.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.featured ? "default" : "secondary"}
                className="mt-6 w-full"
              >
                <Link href="/memberships">Choose {p.name}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const quotes = [
  {
    name: "Elena Marchetti",
    role: "Member since 2024",
    text: "SurveySphere is the first survey platform that feels like a real product. Payouts arrive on time, and the surveys respect my time.",
  },
  {
    name: "Kenji Watanabe",
    role: "Gold member",
    text: "The reward multiplier on Gold pays for itself in a week. Clean interface, no gimmicks.",
  },
  {
    name: "Priya Iyer",
    role: "Platinum member",
    text: "The exclusive brand studies are genuinely interesting. It's the only side income I actually look forward to.",
  },
];

function Testimonials() {
  return (
    <section className="border-t border-border/60 bg-surface/30 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div {...fade} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            Members
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Trusted by members in 150+ countries
          </h2>
        </motion.div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.name}
              {...fade}
              transition={{ ...fade.transition, delay: i * 0.05 }}
              className="glass flex h-full flex-col rounded-2xl p-6 shadow-soft"
            >
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                "{q.text}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
                  {q.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{q.name}</p>
                  <p className="text-xs text-muted-foreground">{q.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "How much can I earn?", a: "Earnings depend on your membership and survey activity. Members typically earn between $40 and $400 per month. Platinum members with a 2.5x multiplier earn considerably more." },
  { q: "How do I get paid?", a: "You can withdraw in USD via PayPal, Wise, bank transfer, or USDT. Bronze and Silver process weekly; Gold and Platinum unlock instant withdrawals." },
  { q: "Are surveys really verified?", a: "Yes. Every study on SurveySphere goes through a compliance review. We reject panels that use deceptive screening or unfair rejection practices." },
  { q: "Can I cancel my membership?", a: "Anytime. Downgrades take effect at the end of your billing cycle. Your rewards balance is always yours to withdraw." },
  { q: "Is my data safe?", a: "Responses are anonymized before delivery to research clients. We are GDPR compliant and never sell your personal information." },
];

function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div {...fade} className="text-center">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Common questions
          </h2>
        </motion.div>
        <motion.div {...fade} className="glass mt-10 rounded-2xl p-2 shadow-soft">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`i-${i}`}
                className="border-white/5 px-4 last:border-b-0"
              >
                <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="pb-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          {...fade}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/25 via-surface to-accent/10 p-10 shadow-elevated ring-1 ring-white/10 sm:p-14"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Your opinions have value. Start earning tonight.
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Free to join. No credit card required.
              </p>
            </div>
            <div className="flex gap-3">
              <Button size="lg" asChild>
                <Link href="/register">
                  Create account <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
