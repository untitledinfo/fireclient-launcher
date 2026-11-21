import type { ReactNode } from "react";
import { Mark } from "@/components/brand/Logo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  crumbs,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Breadcrumb trail including Home, e.g. [{ name: "Home", path: "/" }, …]. */
  crumbs?: { name: string; path: string }[];
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-line",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_85%_0%,rgba(255,45,45,0.13),transparent_60%)]" />
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 scanlines opacity-40" />
        <Mark
          glow={false}
          className="absolute -bottom-16 right-6 h-[19rem] w-[19rem] rotate-[-6deg] opacity-[0.03] light:opacity-[0.04]"
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fire/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
      </div>
      <div className="container-x py-14 md:py-20">
        {crumbs && (
          <>
            <JsonLd data={breadcrumbSchema(crumbs)} />
            <nav
              aria-label="Breadcrumb"
              className="mb-7 flex flex-wrap items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.16em]"
            >
              {crumbs.map((crumb, i) => (
                <span key={crumb.path} className="flex items-center gap-2">
                  {i > 0 && <span className="text-fire/60">/</span>}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-muted">
                      {crumb.name}
                    </span>
                  ) : (
                    <a href={crumb.path} className="text-faint transition-colors hover:text-fire">
                      {crumb.name}
                    </a>
                  )}
                </span>
              ))}
            </nav>
          </>
        )}
        <Reveal>
          <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
            <div
              className={cn(
                "flex items-center gap-3",
                align === "center" && "justify-center",
              )}
            >
              <span className="h-px w-6 bg-fire" />
              <span className="eyebrow">{eyebrow}</span>
            </div>
            <h1 className="display mt-5 text-[clamp(2.6rem,6.6vw,5rem)] text-ink">{title}</h1>
            {description && (
              <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-inkSoft md:text-[1.05rem]">
                {description}
              </p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
