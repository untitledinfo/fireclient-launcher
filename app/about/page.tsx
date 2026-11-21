import type { Metadata } from "next";
import { ArrowUpRight, Download, Flame, Layers, Lock, Ruler } from "lucide-react";
import { AppTile, Mark } from "@/components/brand/Logo";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";
import { product, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "The FireClient story and brand: an independent Minecraft launcher built around isolated instances, verifiable downloads and a single red identity. Logo, palette and press assets included.",
  path: "/about",
  keywords: ["about FireClient", "FireClient brand", "FireClient logo"],
  ogImage: "/brand/app-icon.svg",
});

const palette = [
  { name: "Deep Black", hex: "#08090D", token: "bg" },
  { name: "Dark Background", hex: "#0D0F14", token: "bg-2" },
  { name: "Surface", hex: "#151821", token: "surface" },
  { name: "Fire Red", hex: "#FF2D2D", token: "fire" },
  { name: "Ember", hex: "#FF5C47", token: "ember" },
  { name: "Highlight", hex: "#FF8A6B", token: "gold" },
  { name: "Silver White", hex: "#E7EAF0", token: "ink" },
  { name: "Muted Text", hex: "#9298A5", token: "muted" },
];

const principles = [
  {
    icon: Lock,
    title: "Isolation by default",
    body: "Every instance is self-contained. Nothing you install into one modpack can damage another, and importing an existing game folder copies rather than moves.",
  },
  {
    icon: Flame,
    title: "Honesty over hype",
    body: "No invented frame rates, no fake release dates, no download links for builds that do not exist. If something is not ready, this site says so.",
  },
  {
    icon: Layers,
    title: "Depth without clutter",
    body: "Advanced controls are there when you need them and invisible when you do not. Every setting is documented in the interface that exposes it.",
  },
  {
    icon: Ruler,
    title: "Craft in the details",
    body: "Typography, spacing, contrast and motion are treated as engineering concerns, not decoration. The product should feel made, not assembled.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
        title={
          <>
            Built for people
            <br />
            <span className="text-gradient-fire">who play modded.</span>
          </>
        }
        description="FireClient is an independent Minecraft client and launcher. It exists because managing versions, loaders, mods and accounts should not be the hardest part of playing the game."
      />

      <Section className="border-b border-line">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="The story"
              title={
                <>
                  It started with
                  <br />
                  <span className="text-gradient-fire">a folder of jars.</span>
                </>
              }
            />
            <div className="mt-6 space-y-4 text-[0.98rem] leading-relaxed text-inkSoft">
              <p>
                Every modded player eventually builds the same thing: a set of game
                folders that only work if you remember which loader, which Java version
                and which mod list belongs to which world. It works — right up until it
                does not, and then you are reading a crash log at midnight.
              </p>
              <p>
                FireClient started as a fix for that problem. Not a new game client with
                a different rendering engine, and not another wrapper around the official
                launcher. A launcher that treats an instance as a real unit: its own
                version, loader, runtime, mods, configs and saves, all managed together
                and verified before launch.
              </p>
              <p>
                v1.0.11 ships on Windows, macOS and Linux with published checksum
                manifests and an automatic updater. It launches the game reliably,
                installs versions and loaders, authenticates through Microsoft properly,
                and gets out of the way.
              </p>
            </div>
          </div>

          <Reveal>
            <div className="overflow-hidden rounded-[6px] border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/shots/02-versions.webp"
                alt="FireClient version manager with Vanilla, Fabric, Forge, NeoForge and Quilt"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="border-b border-line bg-bg2">
        <SectionHeading
          eyebrow="Principles"
          title={
            <>
              Four rules we
              <br />
              <span className="text-gradient-fire">do not break.</span>
            </>
          }
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-[5px] border border-line bg-line sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="bg-bg p-6 md:p-7">
              <p.icon className="h-5 w-5 text-fire" />
              <h3 className="mt-4 font-display text-[1.3rem] uppercase leading-none tracking-wide text-ink">
                {p.title}
              </h3>
              <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* BRAND */}
      <Section id="brand" className="border-b border-line">
        <SectionHeading
          eyebrow="Brand identity"
          title={
            <>
              The FireClient
              <br />
              <span className="text-gradient-fire">identity.</span>
            </>
          }
          description="One mark: an angular red F on a matte black plate, drawn as vector geometry. One accent colour. A condensed display face for headlines, monospace for anything you might need to copy."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="overflow-hidden rounded-[5px] border border-line">
              <div className="grid divide-y divide-line">
                <div className="flex flex-wrap items-center justify-between gap-6 bg-bg p-8">
                  <div className="flex items-center gap-4">
                    <AppTile className="h-16 w-16" />
                    <div>
                      <p className="display text-3xl leading-none text-ink">
                        Fire<span className="text-fire">Client</span>
                      </p>
                      <p className="mt-1.5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-faint">
                        App icon · primary
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mark className="h-10 w-10" glow={false} />
                    <Mark className="h-10 w-10" glow={false} tone="mono" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 bg-[#E7EAF0] p-8">
                  <AppTile className="h-14 w-14" />
                  <div>
                    <p className="display text-2xl leading-none text-[#08090D]">
                      Fire<span className="text-[#C81E22]">Client</span>
                    </p>
                    <p className="mt-1.5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[#565D6B]">
                      On light surfaces
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 bg-bg p-8">
                  {[48, 32, 24, 16].map((size) => (
                    <div key={size} className="flex flex-col items-center gap-2">
                      <AppTile style={{ width: size, height: size }} glow={false} />
                      <span className="font-mono text-[0.55rem] text-faint">{size}px</span>
                    </div>
                  ))}
                  <p className="ml-auto max-w-[12rem] text-[0.75rem] leading-relaxed text-faint">
                    Vector artwork, tuned for favicon sizes.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="space-y-4">
              <div className="rounded-[5px] border border-line bg-surface p-5">
                <p className="eyebrow">Typography</p>
                <p className="display mt-3 text-[2.6rem] leading-[0.9] text-ink">
                  Barlow
                  <br />
                  Condensed
                </p>
                <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
                  Display · 800
                </p>
                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-[0.95rem] text-inkSoft">
                    Inter carries body copy and interface text at 400–600.
                  </p>
                  <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
                    Body · JetBrains Mono for data
                  </p>
                </div>
              </div>
              <div className="rounded-[5px] border border-line bg-surface p-5">
                <p className="eyebrow">Asset package</p>
                <div className="mt-3 space-y-2">
                  {[
                    { label: "App icon (SVG)", href: "/brand/app-icon.svg" },
                    { label: "Mark, full colour (SVG)", href: "/brand/mark.svg" },
                    { label: "Mark, monochrome (SVG)", href: "/brand/mark-mono.svg" },
                  ].map((asset) => (
                    <a
                      key={asset.href}
                      href={asset.href}
                      download
                      className="flex items-center justify-between rounded-[3px] border border-line px-3 py-2 text-[0.82rem] text-inkSoft transition-colors hover:border-fire/40 hover:text-fire"
                    >
                      {asset.label}
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
                <p className="mt-3 text-[0.72rem] leading-relaxed text-faint">
                  Vector artwork. Do not recolour the mark, rotate it, add effects to it,
                  or place it on a busy background without a solid plate behind it.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* palette */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {palette.map((c) => (
            <div key={c.hex} className="overflow-hidden rounded-[3px] border border-line">
              <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
              <div className="bg-surface px-2.5 py-2">
                <p className="text-[0.72rem] text-ink">{c.name}</p>
                <p className="font-mono text-[0.6rem] text-faint">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>

      </Section>

      <Section className="border-b border-line">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Product"
              title={
                <>
                  The facts,
                  <br />
                  <span className="text-gradient-fire">plainly.</span>
                </>
              }
            />
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {[
                { k: "Product", v: "FireClient launcher & client" },
                { k: "Platforms", v: "Windows 10/11 · macOS universal · Linux" },
                { k: "Loaders", v: product.loaders.join(", ") },
                { k: "Accounts", v: "Microsoft (official OAuth)" },
                { k: "Release status", v: "v1.0.11 stable (2 Nov 2026)" },
                { k: "Distribution", v: "GitHub Releases · SHA-256 manifests" },
              ].map((row) => (
                <div key={row.k} className="grid grid-cols-[8rem_1fr] gap-4 py-3">
                  <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
                    {row.k}
                  </dt>
                  <dd className="text-[0.88rem] text-inkSoft">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Reveal>
            <div className="rounded-[5px] border border-line bg-surface p-6">
              <Badge tone="muted">Legal</Badge>
              <h3 className="mt-4 font-display text-[1.4rem] uppercase tracking-wide text-ink">
                Independence
              </h3>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">
                FireClient is an independent project. It is not affiliated with, endorsed
                by, or associated with Mojang Studios or Microsoft. Minecraft is a
                trademark of Mojang Synergies AB. FireClient requires a legitimately
                purchased Minecraft: Java Edition account and does not support or permit
                account bypasses of any kind.
              </p>
              <div className="mt-5 border-t border-line pt-5">
                <p className="eyebrow">Contact</p>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-[0.88rem] text-fire hover:underline"
                >
                  {site.contactEmail} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button href="/download" size="lg">
            Check release status
          </Button>
          <Button href="/support" size="lg" variant="secondary">
            Talk to support
          </Button>
        </div>
      </Section>
    </>
  );
}
