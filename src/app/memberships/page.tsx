"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/mock-data";

export default function MembershipsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="gradient-hero pt-36 pb-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            Memberships
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Pick the tier that fits how you earn
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            All plans include verified surveys, USD payouts, and access from 150+ countries.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`relative flex flex-col rounded-2xl p-6 shadow-soft ${
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
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-foreground">
                      ${p.price}
                    </span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                </div>
                <dl className="mt-6 space-y-3 border-y border-white/5 py-5 text-sm">
                  <Row label="Survey limit" value={p.surveyLimit} />
                  <Row label="Reward multiplier" value={p.multiplier} />
                  <Row label="Priority access" value={p.priority} />
                </dl>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={p.featured ? "default" : "secondary"}
                  className="mt-8 w-full"
                >
                  <Link href="/register">
                    Choose {p.name} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
