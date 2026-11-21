import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Cpu,
  Download,
  FileCheck2,
  HardDrive,
  Monitor,
  ShieldCheck,
  Terminal,
  TriangleAlert,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Shot } from "@/components/launcher/Shot";
import { Badge, Dot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { latestRelease, previousReleases, releasesUrl } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { product } from "@/lib/site";
import { formatBytes, formatDate, shortHash } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Download v1.0.11",
  description:
    "Download FireClient v1.0.11 for Windows, macOS and Linux. Windows installer and portable build, macOS universal DMG, Linux .deb and AppImage, each with a published SHA-256 checksum.",
  path: "/download",
  keywords: [
    "FireClient download",
    "Minecraft launcher download Windows",
    "Minecraft launcher macOS",
    "Minecraft launcher Linux AppImage",
  ],
});

const osMeta = {
  windows: { label: "Windows", icon: Monitor },
  macos: { label: "macOS", icon: Monitor },
  linux: { label: "Linux", icon: Monitor },
} as const;

const order = ["windows", "macos", "linux"] as const;

export default function DownloadPage() {
  const ready = latestRelease.status === "available";
  const win = latestRelease.files.find((f) => f.os === "windows" && f.label === "Installer");
  const grouped = order
    .map((os) => ({ os, files: latestRelease.files.filter((f) => f.os === os) }))
    .filter((g) => g.files.length > 0);

  return (
    <>
      <PageHero
        eyebrow="Download"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Download", path: "/download" },
        ]}
        title={
          <>
            Download
            <br />
            <span className="text-gradient-fire">FireClient.</span>
          </>
        }
        description="Windows, macOS and Linux builds, published with SHA-256 and SHA-512 checksum manifests. One launcher, every version of Minecraft, all of your modpacks in isolated instances."
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge tone={ready ? "success" : "warn"}>
            <Dot tone={ready ? "success" : "warn"} />
            {ready ? "Available now" : "Not published"}
          </Badge>
          <Badge tone="fire">v{latestRelease.version}</Badge>
          <Badge>Windows · macOS · Linux</Badge>
        </div>
      </PageHero>

      {/* primary download */}
      <Section className="border-b border-line !py-14 md:!py-20">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <div className="h-full rounded-[5px] border border-line bg-surface p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Latest stable</p>
                  <h2 className="display mt-2 text-[2.4rem] text-ink">v{latestRelease.version}</h2>
                  <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">
                    Released {formatDate(latestRelease.releasedAt)}
                  </p>
                </div>
                <Badge tone="success">
                  <CheckCircle2 className="h-3 w-3" /> Verified release
                </Badge>
              </div>

              {ready && win ? (
                <>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button href={win.url} size="lg" className="group" target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      Download for Windows
                      <span className="ml-1 font-mono text-[0.7rem] opacity-70">
                        {formatBytes(win.sizeBytes)}
                      </span>
                    </Button>
                    <Button href={latestRelease.pageUrl ?? releasesUrl} size="lg" variant="secondary" target="_blank" rel="noopener noreferrer">
                      All releases <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[3px] border border-line">
                    <div className="grid grid-cols-[1fr_auto] gap-2 bg-surface2 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-faint">
                      <span>Windows installer</span>
                      <span>SHA-256</span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-2.5 font-mono text-[0.72rem] text-inkSoft">
                      <span className="truncate">{win.name}</span>
                      <span className="truncate text-muted" title={win.sha256}>
                        {shortHash(win.sha256)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-6 rounded-[4px] border border-amber-500/25 bg-amber-500/[0.06] p-4">
                  <div className="flex items-start gap-3">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <p className="text-[0.86rem] leading-relaxed text-muted">
                      No installer is published for this version yet. Release status is
                      tracked in the repository below.
                    </p>
                  </div>
                </div>
              )}

              <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-5 sm:grid-cols-4">
                {[
                  { k: "Channel", v: latestRelease.channel },
                  { k: "Platforms", v: `${grouped.length} OS` },
                  { k: "Artifacts", v: `${latestRelease.files.length} files` },
                  { k: "Checksums", v: "SHA-256 / 512" },
                ].map((item) => (
                  <div key={item.k}>
                    <dt className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-faint">
                      {item.k}
                    </dt>
                    <dd className="mt-1 text-[0.85rem] capitalize text-ink">{item.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 rounded-[4px] border border-line bg-bg2 p-4">
                <p className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
                  <ShieldCheck className="h-4 w-4 text-fire" />
                  Verify before you run
                </p>
                <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted">
                  Every artifact is checksummed. Compare your download against the
                  published{" "}
                  <a
                    href={latestRelease.pageUrl ?? releasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fire hover:underline"
                  >
                    SHA256SUMS.txt
                  </a>{" "}
                  before launching.
                </p>
              </div>

              <Shot
                src="/images/shots/02-versions.webp"
                alt="FireClient version manager showing Vanilla, Fabric, Forge, NeoForge and Quilt"
                className="mt-6 rounded-[4px]"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col gap-3">
              <div className="rounded-[5px] border border-line bg-surface">
                <div className="border-b border-line px-5 py-3.5">
                  <p className="eyebrow">All artifacts · v{latestRelease.version}</p>
                </div>
                <div className="divide-y divide-line">
                  {grouped.map((group) => (
                    <div key={group.os} className="px-5 py-3.5">
                      <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-faint">
                        {osMeta[group.os].label}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {group.files.map((file) => (
                          <li key={file.name}>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between gap-3 rounded-[3px] border border-line px-2.5 py-2 transition-colors hover:border-fire/45 hover:bg-bg"
                            >
                              <span className="min-w-0">
                                <span className="block truncate text-[0.82rem] text-ink">
                                  {file.label}
                                </span>
                                <span className="block truncate font-mono text-[0.6rem] text-faint">
                                  {file.name}
                                </span>
                              </span>
                              <span className="shrink-0 text-right">
                                <span className="block font-mono text-[0.68rem] text-muted">
                                  {formatBytes(file.sizeBytes)}
                                </span>
                                <Download className="ml-auto mt-0.5 h-3 w-3 text-faint transition-colors group-hover:text-fire" />
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="border-t border-line px-5 py-3">
                  <a
                    href={releasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fire hover:underline"
                  >
                    View on GitHub Releases <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <Shot
                src="/images/shots/12-settings-updater.webp"
                alt="FireClient settings and verified updater"
                className="rounded-[5px]"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* what's new */}
      <Section className="border-b border-line">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Release notes"
              title={
                <>
                  What is in
                  <br />
                  <span className="text-gradient-fire">v{latestRelease.version}.</span>
                </>
              }
              description="Shipped on GitHub with per-artifact checksums, a verification report and an automatic updater feed."
            />
            <ul className="mt-7 space-y-3">
              {latestRelease.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-fire" />
                  <span className="text-[0.9rem] leading-relaxed text-inkSoft">{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-2">
              <Button href={latestRelease.pageUrl ?? releasesUrl} variant="secondary" target="_blank" rel="noopener noreferrer">
                Release page <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
              <Button href={releasesUrl} variant="outline" target="_blank" rel="noopener noreferrer">
                Changelog history
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Reveal>
              <div className="rounded-[5px] border border-line bg-surface p-5">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-fire" />
                  <h3 className="font-display text-[1.15rem] uppercase tracking-wide text-ink">
                    Verify a download
                  </h3>
                </div>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
                  Compare the hash of the file you downloaded with the published value.
                  A mismatch means the file is corrupt or tampered with.
                </p>
                <pre className="mt-3 overflow-x-auto rounded-[3px] border border-line bg-bg p-3 font-mono text-[0.72rem] leading-relaxed text-inkSoft">
{`# Windows
certutil -hashfile FireClient-Setup.exe SHA256

# macOS / Linux
shasum -a 256 FireClient-macOS-universal.dmg`}
                </pre>
                <p className="mt-3 font-mono text-[0.7rem] break-all text-faint">
                  expected: {win?.sha256 ?? "—"}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="rounded-[5px] border border-line bg-surface p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-[1.15rem] uppercase tracking-wide text-ink">
                    Previous releases
                  </h3>
                  <a
                    href={releasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-fire hover:underline"
                  >
                    All
                  </a>
                </div>
                <ul className="mt-3 max-h-64 divide-y divide-line overflow-y-auto pr-1">
                  {previousReleases.map((r) => (
                    <li key={r.version}>
                      <a
                        href={r.pageUrl ?? releasesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 py-2 text-[0.8rem] transition-colors hover:text-fire"
                      >
                        <span className="font-mono text-inkSoft">v{r.version}</span>
                        <span className="text-[0.72rem] text-faint">{formatDate(r.releasedAt)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* requirements */}
      <Section className="border-b border-line">
        <SectionHeading
          eyebrow="System requirements"
          title={
            <>
              What it needs
              <br />
              <span className="text-gradient-fire">to run well.</span>
            </>
          }
          description="Figures below cover the desktop application and a single vanilla instance. Modpacks need more memory. macOS and Linux builds use the same instance model."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            { title: "Minimum", items: product.requirements.minimum, tone: "muted" as const },
            { title: "Recommended", items: product.requirements.recommended, tone: "fire" as const },
          ].map((col) => (
            <Reveal key={col.title}>
              <div className="h-full rounded-[5px] border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                  <h3 className="font-display text-[1.15rem] uppercase tracking-wide text-ink">
                    {col.title}
                  </h3>
                  <Badge tone={col.tone}>{col.title === "Minimum" ? "Baseline" : "Target"}</Badge>
                </div>
                <dl className="divide-y divide-line">
                  {col.items.map((item) => (
                    <div key={item.label} className="grid grid-cols-[7rem_1fr] gap-3 px-5 py-3">
                      <dt className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">
                        {item.label}
                      </dt>
                      <dd className="text-[0.86rem] leading-relaxed text-inkSoft">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-5 rounded-[4px] border border-line bg-bg2 px-5 py-4 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
          <span className="flex items-center gap-2">
            <Monitor className="h-3.5 w-3.5 text-fire" /> Windows 10 / 11
          </span>
          <span className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-fire" /> x64 · arm64 (macOS universal)
          </span>
          <span className="flex items-center gap-2">
            <HardDrive className="h-3.5 w-3.5 text-fire" /> Per-user install
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-fire" /> No admin rights
          </span>
        </div>
      </Section>

      {/* install */}
      <Section id="install" className="border-b border-line">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Installation"
            title={
              <>
                Four steps.
                <br />
                <span className="text-gradient-fire">Nothing hidden.</span>
              </>
            }
            description="No bundled software, no browser toolbars, no background services you did not ask for. Use the portable build if you would rather not install at all."
          />
          <RevealGroup className="space-y-3">
            {[
              {
                t: "Download the right artifact",
                d: "Windows: FireClient-Setup.exe or the portable .zip. macOS: the universal .dmg. Linux: .deb or AppImage.",
              },
              {
                t: "Verify the checksum",
                d: "Compare your file against SHA256SUMS.txt from the same release. Do not run a build that does not match.",
              },
              {
                t: "Sign in with Microsoft",
                d: "The official OAuth window opens in your system browser. FireClient never sees or stores your password.",
              },
              {
                t: "Create your first instance",
                d: "Pick a Minecraft version and loader, allocate memory, and launch. Loader installs and asset downloads are handled for you.",
              },
            ].map((step, i) => (
              <RevealItem key={step.t}>
                <div className="flex gap-4 rounded-[4px] border border-line bg-surface p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[2px] border border-fire/35 bg-fire/10 font-mono text-[0.7rem] text-fire">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[0.92rem] font-medium text-ink">{step.t}</p>
                    <p className="mt-1 text-[0.84rem] leading-relaxed text-muted">{step.d}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <Section className="!py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[5px] border border-line bg-surface p-7 md:flex-row md:items-center">
          <div>
            <h2 className="display text-[1.9rem] text-ink">Need help installing?</h2>
            <p className="mt-1.5 max-w-md text-[0.88rem] text-muted">
              Read the FAQ, or send a report with your launcher log and system details.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button href="/faq" variant="secondary">
              Read the FAQ
            </Button>
            <Button href="/support" variant="outline">
              Support <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <p className="mt-6 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
          <Terminal className="h-3 w-3" /> Artifacts distributed via GitHub Releases
        </p>
      </Section>
    </>
  );
}
