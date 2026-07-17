import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="gradient-hero relative flex min-h-screen items-center justify-center px-4 py-14">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="glass rounded-2xl p-6 shadow-elevated sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
        {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  );
}
