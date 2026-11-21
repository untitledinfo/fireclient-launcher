import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { posts } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function NewsStrip() {
  const latest = posts.slice(0, 3);

  return (
    <Section className="border-b border-line">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Newsroom"
          index="05"
          title={
            <>
              Announcements
              <br />
              <span className="text-gradient-fire">& dev notes.</span>
            </>
          }
          description="Release information, engineering write-ups and the occasional honest post about what is not ready yet."
        />
        <Link
          href="/news"
          className="group inline-flex shrink-0 items-center gap-2 border-b border-lineStrong pb-1 text-[0.8rem] font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:border-fire hover:text-fire"
        >
          All posts
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <RevealGroup className="mt-12 grid gap-4 md:grid-cols-3">
        {latest.map((post) => (
          <RevealItem key={post.slug}>
            <Link
              href={`/news/${post.slug}`}
              className="hud-corners group flex h-full flex-col border border-line bg-surface p-5 transition-colors hover:border-fire/35 md:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge tone={post.category === "Release" ? "fire" : "default"}>{post.category}</Badge>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-faint">
                  {post.readingMinutes} min
                </span>
              </div>
              <h3 className="mt-5 font-display text-[1.4rem] uppercase leading-[1.02] tracking-[0.01em] text-ink transition-colors group-hover:text-fire">
                {post.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-[0.86rem] leading-relaxed text-muted">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-[0.72rem] text-faint">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span className="inline-flex items-center gap-1.5 text-ink transition-colors group-hover:text-fire">
                  Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
