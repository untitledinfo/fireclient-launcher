import { latestRelease } from "./content";
import { site } from "./site";
import { absolute } from "./seo";

/**
 * schema.org builders. Only facts that are actually true of the product are
 * emitted — no invented ratings, review counts or prices.
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  logo: {
    "@type": "ImageObject",
    url: absolute("/brand/app-icon.svg"),
    width: 512,
    height: 512,
  },
  description: site.description,
  sameAs: [
    "https://github.com/untitledinfo/verifed-fireclient",
    "https://github.com/untitledinfo/verifed-fireclient/releases",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.contactEmail,
      url: absolute("/support"),
      availableLanguage: ["English"],
    },
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  description: site.description,
  publisher: { "@id": `${site.url}/#organization` },
  inLanguage: "en",
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${site.url}/#software`,
  name: site.name,
  alternateName: "FireClient Launcher",
  applicationCategory: "GameApplication",
  applicationSubCategory: "Minecraft launcher",
  operatingSystem: "Windows 10, Windows 11, macOS, Linux",
  softwareVersion: latestRelease.version,
  downloadUrl: latestRelease.pageUrl,
  installUrl: absolute("/download"),
  softwareHelp: absolute("/support"),
  screenshot: absolute("/images/shots/01-dashboard.webp"),
  description:
    "FireClient is a Minecraft launcher with isolated game instances, Fabric, Forge, NeoForge and Quilt support, a mod and modpack manager, Microsoft account sign-in, and per-instance Java and JVM configuration. Windows, macOS and Linux builds are published with SHA-256 checksums.",
  publisher: { "@id": `${site.url}/#organization` },
  featureList: [
    "Isolated instances per version, modpack and loader",
    "Fabric, Forge, NeoForge, Quilt and Vanilla support",
    "Mod manager with dependency and duplicate detection",
    "Microsoft OAuth sign-in with encrypted token storage",
    "Per-instance Java, heap and JVM argument configuration",
    "Verified downloads with resumable transfers",
    "Automatic updater with checksum verification",
  ],
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
