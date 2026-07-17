"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how" },
  { label: "Memberships", href: "/memberships" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-2.5 shadow-soft">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
          <button
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-foreground hover:bg-white/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass mt-2 rounded-2xl p-3 shadow-soft md:hidden"
            >
              <div className="flex flex-col">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Get started</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
