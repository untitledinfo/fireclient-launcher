import type { Metadata } from "next";
import {
  ArrowRight,
  Download,
  Gauge,
  GitBranch,
  Layers,
  Package,
  Palette,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Shot } from "@/components/launcher/Shot";
import { PageHero } from "@/components/layout/PageHero";
import { FeatureNav } from "@/components/sections/FeatureNav";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { features } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Features",
  description:
    "Performance profiles with editable JVM flags, a mod manager with dependency checks, isolated modpack instances, Fabric/Forge/NeoForge version handling, Microsoft sign-in and hash-verified downloads.",
  path: "/features",
  keywords: [
    "Minecraft mod manager",
    "Minecraft JVM arguments",
    "Forge NeoForge launcher",
    "isolated Minecraft instances",
  ],
});

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

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ]}
        title={
          <>
            One launcher.
            <br />
            <span className="text-gradient-fire">No compromises.</span>
          </>
        }
        description="FireClient is an instance-first launcher: every version, loader, modpack and setting lives in its own isolated environment, managed by one consistent interface."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/download" size="lg">
            Download FireClient
          </Button>
          <Button href="/gallery" size="lg" variant="secondary">
            See the interface
          </Button>
        </div>
      </PageHero>

      <div className="container-x py-16 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[15rem_1fr] lg:gap-20">
          <FeatureNav />

          <div className="min-w-0">
            {features.map((feature, i) => {
              const Icon = icons[feature.icon as keyof typeof icons] ?? Gauge;
              return (
                <section
                  key={feature.slug}
                  id={feature.slug}
                  className="scroll-mt-28 border-t border-line py-11 first:border-t-0 first:pt-0 md:py-14"
                >
                  <Reveal>
                    <div className="flex items-start gap-4">
                      <span className="mt-1 font-mono text-[0.7rem] text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-[3px] border border-line bg-surface text-fire">
                            <Icon className="h-4 w-4" />
                          </span>
                          <h2 className="display text-[clamp(1.75rem,3.4vw,2.5rem)] text-ink">
                            {feature.title}
                          </h2>
                        </div>
                        <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-inkSoft">
                          {feature.detail}
                        </p>

                        <div className="mt-7 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2">
                          {feature.points.map((point) => (
                            <div
                              key={point}
                              className="flex items-start gap-2.5 bg-bg px-4 py-3.5"
                            >
                              <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-fire" />
                              <span className="text-[0.85rem] leading-relaxed text-muted">
                                {point}
                              </span>
                            </div>
                          ))}
                        </div>

                        {feature.shot && (
                          <figure className="mt-6 max-w-2xl">
                            <Shot
                              src={feature.shot}
                              alt={`${feature.title} screen in the FireClient launcher`}
                            />
                            <figcaption className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-faint">
                              FireClient v1.0.11 — {feature.title}
                            </figcaption>
                          </figure>
                        )}
                      </div>
                    </div>
                  </Reveal>
                </section>
              );
            })}
          </div>
        </div>
      </div>

      <Section className="border-t border-line bg-bg2">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <SectionHeading
            eyebrow="Under the hood"
            title={
              <>
                Secure by
                <br />
                <span className="text-gradient-fire">construction.</span>
              </>
            }
            description="The interface never touches your files, your tokens or your Java runtime directly. Everything privileged happens in a validated main process, and every download is hashed before it is used."
          />
          <RevealGroup className="grid gap-3 sm:grid-cols-2">
            {[
              { t: "Context isolation", d: "Renderer has no Node access." },
              { t: "Validated IPC", d: "Every payload parsed against a schema." },
              { t: "Encrypted tokens", d: "OS keystore, main process only." },
              { t: "Hash verified", d: "SHA-256 on every download." },
            ].map((item) => (
              <RevealItem key={item.t}>
                <div className="h-full rounded-[4px] border border-line bg-bg p-4">
                  <p className="font-display text-[1.05rem] uppercase tracking-wide text-ink">
                    {item.t}
                  </p>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted">{item.d}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Button href="/download" size="lg">
            Check release status <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/faq" size="lg" variant="outline">
            Read the FAQ
          </Button>
        </div>
      </Section>
    </>
  );
}
