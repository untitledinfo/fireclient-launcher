import type { Metadata } from "next";
import { ArrowRight, Clock, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { posts, type Block } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found", robots: { index: false, follow: false } };
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/news/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    keywords: [post.category, "FireClient", "Minecraft launcher"],
  });
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "p":
      return <p>{block.text}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return <blockquote>{block.text}</blockquote>;
  }
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const index = posts.findIndex((p) => p.slug === slug);
  const next = posts[(index + 1) % posts.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    abstract: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    wordCount: post.body.reduce((n, b) => {
      const text =
        b.type === "ul" ? b.items.join(" ") : b.type === "quote" ? b.text : b.text;
      return n + text.split(/\s+/).length;
    }, 0),
    timeRequired: `PT${post.readingMinutes}M`,
    articleSection: post.category,
    inLanguage: "en",
    author: { "@type": "Organization", name: post.author, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/brand/app-icon.svg` },
    },
    image: [`${site.url}/images/shots/01-dashboard.webp`],
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/news/${post.slug}` },
  };

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: post.title, path: `/news/${post.slug}` },
  ];

  return (
    <article>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <div className="border-b border-line bg-bg2">
        <div className="container-x py-10 md:py-14">
          <nav
            aria-label="Breadcrumb"
            className="flex wrap flex-wrap items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.16em]"
          >
            <Link href="/" className="text-faint transition-colors hover:text-fire">
              Home
            </Link>
            <span className="text-fire/60">/</span>
            <Link href="/news" className="text-faint transition-colors hover:text-fire">
              News
            </Link>
            <span className="text-fire/60">/</span>
            <span aria-current="page" className="text-muted">
              {post.category}
            </span>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge tone="fire">{post.category}</Badge>
            <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-faint">
              <Clock className="h-3 w-3" /> {post.readingMinutes} min read
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-faint">
              <User className="h-3 w-3" /> {post.author}
            </span>
          </div>
          <h1 className="display mt-5 max-w-4xl text-[clamp(2.2rem,5.4vw,4rem)] text-ink">
            {post.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-inkSoft">{post.excerpt}</p>
          <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </p>
        </div>
      </div>

      <div className="container-x py-14 md:py-20">
        <div className="prose-fc mx-auto max-w-3xl">
          {post.body.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl border-t border-line pt-8">
          <div className="flex flex-col justify-between gap-4 rounded-[5px] border border-line bg-surface p-5 sm:flex-row sm:items-center">
            <div>
              <p className="eyebrow">Next post</p>
              <p className="mt-1.5 font-display text-[1.2rem] uppercase tracking-wide text-ink">
                {next.title}
              </p>
            </div>
            <Button href={`/news/${next.slug}`} variant="secondary" size="sm">
              Read <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
