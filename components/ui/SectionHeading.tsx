import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  align = "left",
  className,
  children,
}: {
  eyebrow?: string;
  /** HUD-style section number, e.g. "02". */
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <div className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
          {index && <span className="font-mono text-[0.65rem] tracking-[0.16em] text-fire">{index}</span>}
          <span className="h-px w-6 bg-fire" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}
      <h2 className="display text-[clamp(2rem,4.4vw,3.5rem)] text-ink">{title}</h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-[1.0rem] leading-relaxed text-muted",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
  bleed = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  bleed?: boolean;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 md:py-28", className)}>
      {bleed ? children : <div className="container-x">{children}</div>}
    </section>
  );
}
