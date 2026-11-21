import { ArrowUpRight, Code2, MessageCircle, Video } from "lucide-react";
import Link from "next/link";
import { AppTile } from "@/components/brand/Logo";
import { footerNav, site } from "@/lib/site";

const socialIcon = {
  discord: MessageCircle,
  github: Code2,
  youtube: Video,
  x: ArrowUpRight,
} as const;

export function Footer() {
  const socials = (Object.keys(site.links) as (keyof typeof site.links)[])
    .map((key) => ({ key, href: site.links[key] }))
    .filter((s): s is { key: keyof typeof site.links; href: string } => Boolean(s.href));

  return (
    <footer className="relative border-t border-line bg-bg2">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <AppTile className="h-9 w-9" />
              <span className="display text-[1.4rem] leading-none">
                Fire<span className="text-fire">Client</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-muted">
              A premium Minecraft client and launcher built around control: your
              versions, your mods, your settings, your way.
            </p>
            <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-faint">
              {site.tagline}
            </p>

            <div className="mt-8 flex items-center gap-2">
              {socials.length > 0 ? (
                socials.map(({ key, href }) => {
                  const Icon = socialIcon[key] ?? ArrowUpRight;
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[3px] border border-lineStrong text-muted transition-colors hover:border-fire/50 hover:text-fire"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })
              ) : (
                <span className="rounded-[3px] border border-line px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">
                  Community links publish with 1.0
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-[0.88rem] text-muted transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-7 text-[0.78rem] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="max-w-xl leading-relaxed sm:text-right">
            FireClient is an independent project and is not affiliated with,
            endorsed by, or associated with Mojang Studios or Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
}
