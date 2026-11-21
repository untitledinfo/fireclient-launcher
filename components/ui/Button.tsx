import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative isolate overflow-hidden inline-flex select-none items-center justify-center gap-2 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary:
    "text-[#12060a] bg-gradient-to-b from-gold via-ember to-fire shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_10px_30px_-12px_rgba(255,106,0,0.65)] hover:shadow-[0_1px_0_rgba(255,255,255,0.45)_inset,0_16px_40px_-12px_rgba(255,106,0,0.8)] hover:brightness-[1.06] active:brightness-95",
  secondary:
    "bg-surface text-ink border border-lineStrong hover:border-fire/45 hover:bg-surface2",
  outline:
    "border border-lineStrong text-ink hover:border-fire/50 hover:text-fire bg-transparent",
  ghost: "text-inkSoft hover:text-ink hover:bg-surface2",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8rem] tracking-wide",
  md: "h-11 px-5 text-[0.82rem] tracking-[0.06em] uppercase",
  lg: "h-[3.35rem] px-8 text-[0.9rem] tracking-[0.08em] uppercase",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  full?: boolean;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  full,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], full && "w-full", "rounded-[3px]", className)}
      {...rest}
    >
      {variant === "primary" && <Shine />}
      {children}
    </Link>
  );
}

/** Diagonal light sweep that runs once on hover. */
function Shine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
    />
  );
}

export function ButtonEl({
  variant = "primary",
  size = "md",
  className,
  children,
  full,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], full && "w-full", "rounded-[3px]", className)}
      {...rest}
    >
      {variant === "primary" && <Shine />}
      {children}
    </button>
  );
}
