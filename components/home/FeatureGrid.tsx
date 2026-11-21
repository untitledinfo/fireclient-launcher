import {
  ArrowUpRight,
  Download,
  Gauge,
  GitBranch,
  Layers,
  Package,
  Palette,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { features } from "@/lib/content";

const icons = {
  gauge: Gauge,
  package: Package,
  layers: Layers,
  "git-branch": GitBranch,
  "shield-check": ShieldCheck,
  download: Download,
  palette: Palette,
  "refresh-cw": RefreshCw,
} as const;

export function FeatureGrid({ limit }: { limit?: number }) {
  const list = limit ? features.slice(0, limit) : features;

  return (
    <Section className="border-b border-line">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Built in"
          index="02"
          title={
            <>
              Everything in one
              <br />
              <span className="text-gradient-fire">launcher.</span>
            </>
          }
          description="Versions, loaders, mods, accounts, downloads and settings share one instance model — so a modpack is a complete, isolated environment rather than a folder you hope stays clean."
        />
        <Link
          href="/features"
          className="group inline-flex shrink-0 items-center gap-2 border-b border-lineStrong pb-1 text-[0.8rem] font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:border-fire hover:text-fire"
        >
          All features
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </div>

      <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[5px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {list.map((feature, index) => {
          const Icon = icons[feature.icon as keyof typeof icons] ?? Gauge;
          return (
            <RevealItem key={feature.slug}>
              <Link
                href={`/features#${feature.slug}`}
                className="hud-corners group relative flex h-full flex-col bg-bg p-6 transition-colors hover:bg-surface md:p-7"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fire/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center border border-line bg-surface text-fire transition-colors group-hover:border-fire/40 group-hover:bg-fire/10">
                    <Icon className="h-[1.05rem] w-[1.05rem]" />
                  </span>
                  <span className="font-mono text-[0.6rem] tracking-[0.14em] text-faint/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 flex items-center gap-1.5 font-display text-[1.32rem] uppercase leading-none tracking-[0.015em] text-ink">
                  {feature.title}
                  <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 text-fire opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </h3>
                <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted">
                  {feature.summary}
                </p>
              </Link>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
