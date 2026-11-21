import { BookOpen, Bug, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

export function Community() {
  const discord = site.links.discord;

  return (
    <Section className="border-b border-line">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="Community"
            index="06"
            title={
              <>
                Built with
                <br />
                <span className="text-gradient-fire">the people who play.</span>
              </>
            }
            description="Bug reports, mod conflicts and settings questions from real installations shape what ships. When the community hub opens, this is where you will find it."
          />

          <Reveal delay={0.08}>
            <div className="mt-8 rounded-[5px] border border-line bg-surface p-5">
              {discord ? (
                <>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-fire" />
                    <h3 className="font-display text-lg uppercase tracking-wide">Discord</h3>
                  </div>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">
                    Release announcements, support channels and mod-pack discussion.
                  </p>
                  <Button href={discord} variant="primary" size="md" className="mt-4" target="_blank" rel="noopener noreferrer">
                    Join the server
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-fire" />
                    <h3 className="font-display text-lg uppercase tracking-wide">
                      Community hub
                    </h3>
                  </div>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">
                    Release announcements, build history and checksums live on
                    GitHub Releases, and the Discord invite is shared inside the
                    launcher. Support requests go through the support page.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button href="/support" variant="secondary" size="sm">
                      Contact support
                    </Button>
                    <Button href="/news" variant="ghost" size="sm">
                      Follow development
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: BookOpen,
              title: "Documentation",
              body: "Installation, account setup, loaders and performance tuning explained step by step.",
              href: "/support#docs",
            },
            {
              icon: Bug,
              title: "Bug reporting",
              body: "Send a diagnostic bundle with logs and system information — no account tokens included.",
              href: "/support#report",
            },
            {
              icon: Users,
              title: "Brand & press",
              body: "Download the FireClient logo package and read the identity guidelines.",
              href: "/about#brand",
            },
            {
              icon: MessageCircle,
              title: "Direct contact",
              body: site.contactEmail,
              href: `mailto:${site.contactEmail}`,
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex h-full flex-col rounded-[5px] border border-line bg-bg p-5 transition-colors hover:border-fire/35 hover:bg-surface"
            >
              <item.icon className="h-4 w-4 text-fire" />
              <h3 className="mt-4 font-display text-[1.1rem] uppercase tracking-wide text-ink">
                {item.title}
              </h3>
              <p className="mt-2 break-words text-[0.82rem] leading-relaxed text-muted">
                {item.body}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
