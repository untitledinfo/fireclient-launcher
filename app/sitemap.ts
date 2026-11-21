import type { MetadataRoute } from "next";
import { latestRelease, posts } from "@/lib/content";
import { site } from "@/lib/site";

/** Fixed content pages with real priority weights (not everything is 1.0). */
const pages: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/download", priority: 0.95, changeFrequency: "daily" },
  { path: "/features", priority: 0.9, changeFrequency: "weekly" },
  { path: "/gallery", priority: 0.8, changeFrequency: "weekly" },
  { path: "/news", priority: 0.8, changeFrequency: "daily" },
  { path: "/faq", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/support", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const releaseDate = new Date(latestRelease.releasedAt);
  const newestPost = new Date(posts[0]?.publishedAt ?? releaseDate);

  return [
    ...pages.map((page) => ({
      url: `${site.url}${page.path}`,
      lastModified:
        page.path === "/download" || page.path === "/news" ? newestPost : releaseDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/news/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
