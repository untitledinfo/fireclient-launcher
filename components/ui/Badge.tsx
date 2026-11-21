import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "fire" | "success" | "warn" | "muted";
  className?: string;
}) {
  const tones = {
    default: "border-lineStrong text-inkSoft bg-surface",
    fire: "border-fire/40 text-fire bg-fire/10",
    success: "border-emerald-500/35 text-emerald-400 bg-emerald-500/10",
    warn: "border-amber-500/35 text-amber-400 bg-amber-500/10",
    muted: "border-line text-muted bg-transparent",
  } as const;

  return (
    <span
      className={cn(
        "notch inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = "fire" }: { tone?: "fire" | "success" | "warn" | "muted" }) {
  const map = {
    fire: "bg-fire shadow-[0_0_8px_2px_var(--fire-line)]",
    success: "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.45)]",
    warn: "bg-amber-400 shadow-[0_0_8px_2px_rgba(251,191,36,0.45)]",
    muted: "bg-faint",
  } as const;
  return <span className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full", map[tone])} />;
}
