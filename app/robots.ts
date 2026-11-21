import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Explicitly welcome the three crawlers that matter for this site, and keep
 * API endpoints out of the index (they return JSON, not pages).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: ["Googlebot", "Googlebot-Image"],
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Bingbot + the IndexNow crawler
        userAgent: ["Bingbot", "msnbot", "BingPreview"],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
