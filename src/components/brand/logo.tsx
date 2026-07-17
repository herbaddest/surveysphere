import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-soft">
        <div className="absolute inset-0.5 rounded-[7px] bg-background/40" />
        <div className="relative h-3 w-3 rounded-full bg-gradient-to-br from-accent to-primary-glow" />
      </div>
      {showText && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          SurveySphere
        </span>
      )}
    </div>
  );
}
