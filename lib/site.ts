/**
 * Central site + product configuration.
 * Values that differ between environments come from env vars (see .env.example).
 */

export const site = {
  name: "FireClient",
  tagline: "Minecraft, Your Way.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fireclient.net",
  description:
    "FireClient is a premium Minecraft client and launcher built for performance, deep customization and total control over your game.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "support@fireclient.net",
  /** Optional external links. When unset the UI degrades to a truthful "not published yet" state. */
  links: {
    discord: process.env.NEXT_PUBLIC_DISCORD_URL ?? null,
    github:
      process.env.NEXT_PUBLIC_GITHUB_URL ??
      "https://github.com/untitledinfo/verifed-fireclient/releases/",
    x: process.env.NEXT_PUBLIC_X_URL ?? null,
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? null,
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Performance", href: "/features#performance" },
  { label: "Gallery", href: "/gallery" },
  { label: "News", href: "/news" },
  { label: "FAQ", href: "/faq" },
] as const;

export const footerNav = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Download", href: "/download" },
      { label: "Gallery", href: "/gallery" },
      { label: "Release notes", href: "/download#releases" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "News", href: "/news" },
      { label: "Brand", href: "/about#brand" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Installation guide", href: "/download#install" },
      { label: "Troubleshooting", href: "/support#docs" },
      { label: "System status", href: "/api/health" },
    ],
  },
] as const;

/** Canonical platform facts — single source of truth used across the site. */
export const product = {
  platforms: ["Windows 10 / 11", "macOS", "Linux"],
  architecture: "x64",
  requirements: {
    minimum: [
      { label: "OS", value: "Windows 10 64-bit (build 1909+)" },
      { label: "CPU", value: "Dual-core 2.0 GHz" },
      { label: "Memory", value: "4 GB system RAM (2 GB for the game)" },
      { label: "GPU", value: "DirectX 11 capable, OpenGL 4.5 drivers" },
      { label: "Storage", value: "1.5 GB for the launcher and runtime" },
    ],
    recommended: [
      { label: "OS", value: "Windows 11 64-bit" },
      { label: "CPU", value: "Quad-core 3.0 GHz or better" },
      { label: "Memory", value: "16 GB system RAM (6–8 GB for the game)" },
      { label: "GPU", value: "Discrete GPU with 4 GB VRAM" },
      { label: "Storage", value: "20 GB free for multiple instances" },
    ],
  },
  loaders: ["Vanilla", "Fabric", "Forge", "NeoForge", "Quilt"],
  releasesUrl: "https://github.com/untitledinfo/verifed-fireclient/releases/",
} as const;
