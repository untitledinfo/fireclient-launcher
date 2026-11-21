import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/Badge";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/SectionHeading";
import { posts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "News",
  description:
    "FireClient release notes, development write-ups and launcher announcements — including the v1.0.11 release and how downloads are verified.",
  path: "/news",
  keywords: ["FireClient release notes", "Minecraft launcher news", "FireClient changelog"],
});

export default function NewsPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "News", path: "/news" },
        ]}
        title={
          <>
            Announcements
            <br />
            <span className="text-gradient-fire">& dev notes.</span>
          </>
        }
        description="Release information, engineering write-ups and honest status updates. No countdown timers, no invented benchmarks."
      />

      <Section className="border-b border-line">
        <Link
          href={`/news/${featured.slug}`}
          className="group grid gap-6 rounded-[6px] border border-line bg-surface p-5 transition-colors hover:border-fire/35 md:grid-cols-[0.85fr_1.15fr] md:p-7"
        >
          <div className="relative overflow-hidden rounded-[4px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/shots/01-dashboard.webp"
              alt=""
              className="h-full min-h-[14rem] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <Badge tone="fire">{featured.category}</Badge>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
                {formatDate(featured.publishedAt)} · {featured.readingMinutes} min read
              </span>
            </div>
            <h2 className="display mt-4 text-[clamp(1.9rem,4vw,3rem)] text-ink transition-colors group-hover:text-fire">
              {featured.title}
            </h2>
            <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted">
              {featured.excerpt}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-[0.8rem] font-medium uppercase tracking-[0.1em] text-ink">
              Read the post
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        <RevealGroup className="mt-6 grid gap-4 md:grid-cols-3">
          {rest.map((post) => (
            <RevealItem key={post.slug}>
              <Link
                href={`/news/${post.slug}`}
                className="group flex h-full flex-col rounded-[5px] border border-line bg-bg p-5 transition-colors hover:border-fire/35 hover:bg-surface"
              >
                <div className="flex items-center justify-between">
                  <Badge tone={post.category === "Release" ? "fire" : "default"}>
                    {post.category}
                  </Badge>
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-faint">
                    {post.readingMinutes} min
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[1.3rem] uppercase leading-[1.05] text-ink transition-colors group-hover:text-fire">
                  {post.title}
                </h3>
                <p className="mt-2.5 line-clamp-3 text-[0.84rem] leading-relaxed text-muted">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-[0.7rem] text-faint">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:text-fire" />
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>
    </>
  );
}
