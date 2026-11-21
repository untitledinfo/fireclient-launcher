import { Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { versionFamilies } from "@/lib/content";

export function Compatibility() {
  return (
    <Section className="border-b border-line">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Version manager"
            index="03"
            title={
              <>
                Every version.
                <br />
                <span className="text-gradient-fire">One library.</span>
              </>
            }
            description="Vanilla releases, snapshots and historical builds sit alongside loader installations. FireClient resolves the official manifest, installs the libraries and assets, and tells you which loaders each version actually supports."
          />
          <div className="mt-8 space-y-3">
            {[
              "Loader installations are separate instances — never overwritten",
              "Java requirement shown before you install, not after it fails",
              "Every downloaded file verified against its manifest hash",
            ].map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-fire" />
                <p className="text-[0.88rem] leading-relaxed text-inkSoft">{line}</p>
              </div>
            ))}
          </div>
          <Link
            href="/features#versions"
            className="mt-8 inline-flex items-center gap-1.5 text-[0.8rem] font-medium uppercase tracking-[0.1em] text-fire hover:underline"
          >
            How the version manager works <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Reveal>
          <div className="overflow-hidden rounded-[6px] border border-line bg-surface shadow-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                Supported families
              </span>
              <Badge tone="success">
                <span className="h-1 w-1 rounded-full bg-emerald-400" /> Manifest live
              </Badge>
            </div>
            <div className="divide-y divide-line">
              {versionFamilies.map((v) => (
                <div
                  key={v.label}
                  className="group flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface2"
                >
                  <span className="w-20 font-mono text-[0.85rem] text-ink">{v.label}</span>
                  <div className="flex flex-1 flex-wrap gap-1.5">
                    {v.loaders.map((loader) => (
                      <span
                        key={loader}
                        className="rounded-[2px] border border-line bg-bg px-1.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-muted"
                      >
                        {loader}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-emerald-400/90">
                    <Check className="h-3 w-3" /> {v.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-line bg-bg2 px-5 py-3 text-[0.75rem] text-faint">
              Loader availability is determined per Minecraft version by the
              loader itself and displayed before installation.
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
