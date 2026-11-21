import type { Metadata } from "next";
import { site } from "./site";

/** Absolute URL helper — canonicals and OG URLs must never be relative. */
export function absolute(path = "/"): string {
  return new URL(path, site.url).toString();
}

export const defaultKeywords = [
  "FireClient",
  "FireClient launcher",
  "Minecraft launcher",
  "Minecraft client",
  "Minecraft launcher download",
  "Fabric launcher",
  "Forge launcher",
  "NeoForge launcher",
  "Quilt launcher",
  "Minecraft mod manager",
  "Minecraft modpacks",
  "Minecraft version manager",
  "Minecraft launcher for Windows",
  "Minecraft launcher for macOS",
  "Minecraft launcher for Linux",
];

/**
 * Page-level metadata with a canonical URL, Open Graph and Twitter cards.
 * Every indexable page must go through this so no page ships without a
 * canonical (a duplicate-content signal Google and Bing both act on).
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage = "/og.png",
  type = "website",
  publishedTime,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** Home page: bypass the "%s — FireClient" template. */
  absoluteTitle?: boolean;
}): Metadata {
  const url = absolute(path);
  const image = {
    url: absolute(ogImage),
    width: 1200,
    height: 630,
    alt: `${site.name} — ${site.tagline}`,
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: [...new Set([...keywords, ...defaultKeywords])],
    alternates: {
      canonical: url,
      types: { "application/rss+xml": absolute("/rss.xml") },
    },
    openGraph: {
      type,
      url,
      siteName: site.name,
      locale: "en_US",
      title: absoluteTitle ? title : `${title} — ${site.name}`,
      description,
      images: [image],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle ? title : `${title} — ${site.name}`,
      description,
      images: [image.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
