import type { Metadata } from "next";
import {
  ArrowUpRight,
  BookOpen,
  Download,
  FileText,
  Gauge,
  GitBranch,
  LifeBuoy,
  MessageCircle,
  Package,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { SupportForm } from "@/components/sections/SupportForm";
import { Badge, Dot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { supportDocs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Support",
  description:
    "FireClient support: installation and account documentation, launcher troubleshooting, bug reports with diagnostic logs, and direct contact.",
  path: "/support",
  keywords: ["FireClient support", "Minecraft launcher help", "FireClient bug report"],
});

const icons = {
  download: Download,
  "shield-check": ShieldCheck,
  package: Package,
  gauge: Gauge,
  "file-text": FileText,
  "git-branch": GitBranch,
} as const;

export default function SupportPage() {
  const discord = site.links.discord;
  const github = site.links.github;

  return (
    <>
      <PageHero
        eyebrow="Support"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Support", path: "/support" },
        ]}
        title={
          <>
            Help, from
            <br />
            <span className="text-gradient-fire">real people.</span>
          </>
        }
        description="Start with the documentation. If that does not solve it, send a report with your logs — we read every one."
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge tone="success">
            <Dot tone="success" /> Support available
          </Badge>
          <Badge tone="default">
            <LifeBuoy className="h-3 w-3" /> Email & web form
          </Badge>
        </div>
      </PageHero>

      <Section id="docs" className="border-b border-line">
        <SectionHeading
          eyebrow="Documentation"
          title={
            <>
              Start here
              <br />
              <span className="text-gradient-fire">first.</span>
            </>
          }
          description="Six guides that cover almost every question we receive."
        />

        <RevealGroup className="mt-10 grid gap-px overflow-hidden rounded-[5px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {supportDocs.map((doc) => {
            const Icon = icons[doc.icon as keyof typeof icons] ?? BookOpen;
            return (
              <RevealItem key={doc.title}>
                <Link
                  href={doc.href}
                  className="group flex h-full flex-col bg-bg p-5 transition-colors hover:bg-surface"
                >
                  <Icon className="h-4 w-4 text-fire" />
                  <h3 className="mt-4 font-display text-[1.15rem] uppercase tracking-wide text-ink transition-colors group-hover:text-fire">
                    {doc.title}
                  </h3>
                  <p className="mt-1.5 text-[0.83rem] leading-relaxed text-muted">{doc.body}</p>
                  <ArrowUpRight className="mt-4 h-3.5 w-3.5 text-faint transition-all group-hover:-translate-y-0.5 group-hover:text-fire" />
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Section>

      <Section id="report" className="border-b border-line">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Bug report"
              title={
                <>
                  Report an
                  <br />
                  <span className="text-gradient-fire">issue.</span>
                </>
              }
              description="Describe what happened and what you expected. If you can, attach the diagnostic bundle from Settings → Debug — it contains logs and system information, never account tokens."
            />

            <div className="mt-8 space-y-4 rounded-[5px] border border-line bg-surface p-5">
              <p className="eyebrow">Include if possible</p>
              <ul className="space-y-2.5">
                {[
                  "Launcher version and Minecraft version",
                  "Loader and mod list for the instance",
                  "Launcher log from the affected launch",
                  "Steps that reproduce the problem",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[0.84rem] text-inkSoft">
                    <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-fire" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 space-y-2">
              <a
                href={`mailto:${site.contactEmail}`}
                className="flex items-center justify-between rounded-[4px] border border-line bg-surface px-4 py-3 text-[0.85rem] text-inkSoft transition-colors hover:border-fire/40 hover:text-fire"
              >
                <span className="flex items-center gap-2">
                  <LifeBuoy className="h-4 w-4 text-fire" /> {site.contactEmail}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-[4px] border border-line bg-surface px-4 py-3 text-[0.85rem] text-inkSoft transition-colors hover:border-fire/40 hover:text-fire"
                >
                  <span className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-fire" /> Public issue tracker
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <Reveal>
            <SupportForm />
          </Reveal>
        </div>
      </Section>

      <Section id="community">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[5px] border border-line bg-surface p-6">
            <MessageCircle className="h-5 w-5 text-fire" />
            <h3 className="mt-4 font-display text-[1.4rem] uppercase tracking-wide text-ink">
              Community
            </h3>
            {discord ? (
              <>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">
                  Join the Discord for release announcements and help from other players.
                </p>
                <Button
                  href={discord}
                  className="mt-4"
                  size="md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Discord
                </Button>
              </>
            ) : (
              <>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">
                  The Discord invite is shared inside the launcher and on the release
                  page. Support requests sent from this form reach us directly.
                </p>
                <Badge tone="muted" className="mt-4">
                  Invite shared in-app
                </Badge>
              </>
            )}
          </div>

          <div className="rounded-[5px] border border-line bg-surface p-6">
            <ShieldCheck className="h-5 w-5 text-fire" />
            <h3 className="mt-4 font-display text-[1.4rem] uppercase tracking-wide text-ink">
              Security & privacy
            </h3>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">
              FireClient never asks for your Microsoft password, never stores one, and
              keeps account tokens encrypted in the main process. If anyone claiming to
              be FireClient asks for your credentials, it is not us.
            </p>
            <Link
              href="/news/inside-the-launcher-architecture"
              className="mt-4 inline-flex items-center gap-1.5 text-[0.82rem] font-medium uppercase tracking-[0.1em] text-fire hover:underline"
            >
              How the launcher handles auth <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
