import type { Release } from "./schemas";

/* ------------------------------------------------------------------ */
/* FEATURES                                                            */
/* ------------------------------------------------------------------ */

export type Feature = {
  slug: string;
  title: string;
  summary: string;
  detail: string;
  icon: string;
  /** Screenshot from the shipped launcher, shown alongside the feature. */
  shot?: string;
  points: string[];
};

export const features: Feature[] = [
  {
    slug: "performance",
    shot: "/images/shots/13-performance.webp",
    title: "Performance profiles",
    summary:
      "Tune memory, JVM flags and render distance per instance — with a plain-English explanation of what each change does.",
    detail:
      "FireClient does not ship magic. Every profile is a documented set of JVM and client settings you can inspect, edit and reset. Apply a profile to one instance or all of them.",
    icon: "gauge",
    points: [
      "One-click profiles: Balanced, Competitive, Cinematic",
      "Per-instance RAM ceilings instead of one global value",
      "JVM argument editor with validation and safe defaults",
      "Every setting shows what it changes and what it does not",
    ],
  },
  {
    slug: "mods",
    shot: "/images/shots/05-library.webp",
    title: "Mod manager",
    summary:
      "Install, enable, disable and audit mods without touching the .minecraft folder. Dependencies and duplicates are surfaced before launch.",
    detail:
      "FireClient reads mod metadata directly from the jars in your instance, then checks loader compatibility and dependency declarations. Problems are reported as warnings before you launch, never as silent crashes.",
    icon: "package",
    points: [
      "Drag-and-drop .jar installation into the right instance",
      "Duplicate detection by mod id and version",
      "Missing dependency warnings with loader context",
      "Enable/disable without deleting files",
    ],
  },
  {
    slug: "modpacks",
    shot: "/images/shots/03-mods.webp",
    title: "Modpack profiles",
    summary:
      "Keep every modpack in its own isolated game directory, with its own version, mods, configs and saves.",
    detail:
      "Each modpack is a self-contained instance: its own game directory, loader, Java runtime, mods folder and config. Switching packs never mixes files, and exporting a pack gives you a shareable manifest.",
    icon: "layers",
    points: [
      "Create, import and export packs with manifests",
      "Isolated game directories and save data",
      "Per-pack version and loader pinning",
      "Config snapshots before you change anything",
    ],
  },
  {
    slug: "versions",
    shot: "/images/shots/02-versions.webp",
    title: "Version manager",
    summary:
      "Releases, snapshots and historical builds side by side, with loader installs and compatibility information attached.",
    detail:
      "The version manager pulls from the official Mojang version manifest, resolves libraries and assets, and verifies every file it downloads. Loader metadata is added on top so you always know what a version supports.",
    icon: "git-branch",
    points: [
      "Vanilla releases, snapshots and older builds",
      "Fabric, Forge, NeoForge and Quilt installation",
      "Per-version Java requirements shown up front",
      "Download integrity verified before launch",
    ],
  },
  {
    slug: "accounts",
    shot: "/images/shots/10-skins.webp",
    title: "Microsoft accounts",
    summary:
      "Sign in with the Microsoft account that owns Minecraft. Tokens stay in the main process, encrypted at rest.",
    detail:
      "Authentication runs the official Microsoft OAuth device flow, then exchanges the result through Xbox Live, XSTS and the Minecraft services API before confirming game ownership. Your password is never seen by FireClient, and tokens never reach the interface layer.",
    icon: "shield-check",
    points: [
      "Official Microsoft OAuth — no password is ever stored",
      "Xbox Live, XSTS and Minecraft service validation",
      "Ownership check before a profile is added",
      "Multiple accounts with encrypted token storage",
    ],
  },
  {
    slug: "downloads",
    shot: "/images/shots/04-modrinth.webp",
    title: "Download manager",
    summary:
      "Every asset, library and mod download in one queue with live speed, progress and a retry that actually resumes.",
    detail:
      "Downloads are queued, chunked and hashed. Failed transfers are retried with backoff, and anything that fails verification is discarded rather than used. You can pause and resume the queue at any time.",
    icon: "download",
    points: [
      "Live speed, progress and time remaining",
      "Pause, resume, cancel and retry per item",
      "SHA-256 verification on completion",
      "Corrupt files are re-fetched, never launched",
    ],
  },
  {
    slug: "customization",
    shot: "/images/shots/15-ingame-wardrobe.webp",
    title: "Interface customization",
    summary:
      "Dark and light themes, interface density, language and motion preferences — applied consistently across the whole launcher.",
    detail:
      "The launcher is built on a token-based design system, so theming is a first-class feature rather than a skin. Accent colors are validated for contrast against every surface they touch.",
    icon: "palette",
    points: [
      "Dark and light modes with system sync",
      "Accent color palette with contrast checks",
      "Interface density and reduced-motion support",
      "Localization-ready copy layer",
    ],
  },
  {
    slug: "updates",
    shot: "/images/shots/12-settings-updater.webp",
    title: "Verified updates",
    summary:
      "Signed builds, SHA-256 hashes and a release channel you choose — with no silent updates.",
    detail:
      "FireClient checks the release feed on launch, shows you the changelog, and only installs an update after the download hash matches the published manifest. Stable and beta channels are separate.",
    icon: "refresh-cw",
    points: [
      "Stable and beta release channels",
      "Changelog shown before installing",
      "Hash verification of every update package",
      "Updates never interrupt a running game",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* LAUNCHER PREVIEW DATA                                               */
/* ------------------------------------------------------------------ */

export const launcherNav = [
  { label: "Dashboard", icon: "layout-dashboard" },
  { label: "Play", icon: "play" },
  { label: "Versions", icon: "git-branch" },
  { label: "Modpacks", icon: "layers" },
  { label: "Mods", icon: "package" },
  { label: "Accounts", icon: "user-round" },
  { label: "Downloads", icon: "download" },
  { label: "Settings", icon: "settings" },
] as const;

/* ------------------------------------------------------------------ */
/* VERSION COMPATIBILITY                                               */
/* ------------------------------------------------------------------ */

export const versionFamilies = [
  { label: "1.21.x", status: "Supported", loaders: ["Vanilla", "Fabric", "NeoForge"] },
  { label: "1.20.x", status: "Supported", loaders: ["Vanilla", "Fabric", "Forge", "NeoForge", "Quilt"] },
  { label: "1.19.x", status: "Supported", loaders: ["Vanilla", "Fabric", "Forge", "Quilt"] },
  { label: "1.18.x", status: "Supported", loaders: ["Vanilla", "Fabric", "Forge"] },
  { label: "1.16.x", status: "Supported", loaders: ["Vanilla", "Fabric", "Forge"] },
  { label: "Snapshots", status: "Supported", loaders: ["Vanilla", "Fabric"] },
];

/* ------------------------------------------------------------------ */
/* RELEASES                                                            */
/* ------------------------------------------------------------------ */

/**
 * Release feed — sourced from the public GitHub release
 * (github.com/untitledinfo/verifed-fireclient).
 *
 * Artifact sizes and SHA-256 digests below are copied from the published
 * SHA256SUMS.txt for the tag. If you cut a new release, update this object
 * with the values from the new checksum manifest.
 */
const RELEASE_PAGE = "https://github.com/untitledinfo/verifed-fireclient/releases/tag/";
const DOWNLOAD_BASE = "https://github.com/untitledinfo/verifed-fireclient/releases/download/";

export const latestRelease: Release = {
  version: "1.0.11",
  channel: "stable",
  status: "available",
  releasedAt: new Date("2026-11-02T10:25:48.000Z").toISOString(),
  pageUrl: `${RELEASE_PAGE}v1.0.11`,
  highlights: [
    "Windows installer, portable build, macOS universal DMG and Linux packages in one release",
    "Published SHA-256 and SHA-512 checksum manifests for every artifact",
    "Automatic updater feed (latest.yml) with signed release metadata",
    "In-game FireClient menu, wardrobe and cloak system",
    "Modrinth browsing, one-click essential mods and curated modpacks",
  ],
  files: [
    {
      os: "windows",
      label: "Installer",
      name: "FireClient-Setup.exe",
      sizeBytes: 10643064,
      sha256: "041aee612f2c70586d19e81b399836483f1f7b4159f0a1399bb59492b1364e37",
      url: `${DOWNLOAD_BASE}v1.0.11/FireClient-Setup.exe`,
    },
    {
      os: "windows",
      label: "Portable",
      name: "FireClient-portable.zip",
      sizeBytes: 15830405,
      sha256: "7e8eb2cc64234cba2e0a7b84bb86cb472246f3d3f29f42abb986b2aeae76f6e7",
      url: `${DOWNLOAD_BASE}v1.0.11/FireClient-portable.zip`,
    },
    {
      os: "macos",
      label: "Universal DMG",
      name: "FireClient-macOS-universal.dmg",
      sizeBytes: 188299213,
      sha256: "ced66a34a8aa3dde49d4ec7600d336782a41d759e3c8d2af409e262ec39a5643",
      url: `${DOWNLOAD_BASE}v1.0.11/FireClient-macOS-universal.dmg`,
    },
    {
      os: "linux",
      label: "Debian / Ubuntu",
      name: "FireClient-Linux-amd64.deb",
      sizeBytes: 79635214,
      sha256: "4732b6f6d5598b7a5ea0f53f4954732f5559b7e9521986af6769e7c9c05d1f5d",
      url: `${DOWNLOAD_BASE}v1.0.11/FireClient-Linux-amd64.deb`,
    },
    {
      os: "linux",
      label: "AppImage",
      name: "FireClient-Linux-x86_64.AppImage",
      sizeBytes: 116583801,
      sha256: "0e9e72428109788a46f84d3df45249271de327c2f5c6b807a71d33e66d9863d6",
      url: `${DOWNLOAD_BASE}v1.0.11/FireClient-Linux-x86_64.AppImage`,
    },
  ],
};

const previous = [
  { version: "1.0.10", releasedAt: "2026-10-26T13:29:35.000Z" },
  { version: "1.0.9", releasedAt: "2026-10-22T04:15:19.000Z" },
  { version: "1.0.8", releasedAt: "2026-10-21T13:17:54.000Z" },
  { version: "1.0.7", releasedAt: "2026-10-20T12:44:01.000Z" },
  { version: "1.0.5", releasedAt: "2026-10-19T07:17:14.000Z" },
  { version: "1.0.4", releasedAt: "2026-10-19T06:57:54.000Z" },
  { version: "1.0.3", releasedAt: "2026-10-19T06:23:24.000Z" },
  { version: "1.0.2", releasedAt: "2026-10-18T09:15:39.000Z" },
  { version: "1.0.1", releasedAt: "2026-10-18T09:02:55.000Z" },
];

export const previousReleases: Release[] = previous.map((r) => ({
  version: r.version,
  channel: "stable" as const,
  status: "available" as const,
  releasedAt: new Date(r.releasedAt).toISOString(),
  pageUrl: `${RELEASE_PAGE}v${r.version}`,
  highlights: [],
  files: [],
}));

export const releasesUrl = "https://github.com/untitledinfo/verifed-fireclient/releases/";

/* ------------------------------------------------------------------ */
/* NEWS                                                               */
/* ------------------------------------------------------------------ */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Announcement" | "Release" | "Development" | "Performance";
  publishedAt: string;
  readingMinutes: number;
  author: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "fireclient-1-0-11-released",
    title: "FireClient v1.0.11 is live",
    excerpt:
      "Windows, macOS and Linux builds are published with SHA-256 manifests, an automatic updater feed and a verification report attached to the release.",
    category: "Release",
    publishedAt: new Date("2026-11-02T10:25:48.000Z").toISOString(),
    readingMinutes: 3,
    author: "FireClient Team",
    body: [
      {
        type: "p",
        text: "v1.0.11 is available now on GitHub Releases. It is the current stable build for Windows, macOS and Linux, and it is the version the download page on this site links to.",
      },
      { type: "h2", text: "The artifacts" },
      {
        type: "ul",
        items: [
          "Windows: FireClient-Setup.exe (10.6 MB) or the portable .zip (15.8 MB)",
          "macOS: FireClient-macOS-universal.dmg (188 MB), covering Intel and Apple silicon",
          "Linux: FireClient-Linux-amd64.deb (79.6 MB) or FireClient-Linux-x86_64.AppImage (116.6 MB)",
          "Checksums: SHA256SUMS.txt and SHA512SUMS.txt alongside the binaries",
        ],
      },
      { type: "h2", text: "What is in it" },
      {
        type: "p",
        text: "The release includes the in-game FireClient menu and wardrobe, Modrinth browsing, one-click essential mods, curated modpacks, the server browser and the performance health check. The automatic updater uses the published latest.yml feed, so the launcher can detect and install the next build itself.",
      },
      { type: "h2", text: "Verify what you download" },
      {
        type: "p",
        text: "Every artifact is checksummed at build time. The Windows installer's published SHA-256 is 041aee612f2c70586d19e81b399836483f1f7b4159f0a1399bb59492b1364e37. Compare it before you run the file:",
      },
      {
        type: "ul",
        items: [
          "Windows: certutil -hashfile FireClient-Setup.exe SHA256",
          "macOS / Linux: shasum -a 256 <file>",
        ],
      },
      {
        type: "quote",
        text: "If the hash does not match, do not run it. Download again from the release page.",
      },
      {
        type: "p",
        text: "The release also ships a security summary and a verification report, so the integrity claims can be checked rather than taken on trust.",
      },
    ],
  },
  {
    slug: "a-new-identity-for-fireclient",
    title: "A new identity for FireClient",
    excerpt:
      "Every pixel, glyph and gradient has been rebuilt from scratch. Here is the thinking behind the new FireClient brand — and why the launcher comes first.",
    category: "Announcement",
    publishedAt: new Date("2026-01-12T09:00:00.000Z").toISOString(),
    readingMinutes: 4,
    author: "FireClient Team",
    body: [
      {
        type: "p",
        text: "FireClient started as a performance experiment: a handful of JVM flags, a stripped-back interface and a stubborn belief that a Minecraft launcher should not feel like a utility window from 2013. That experiment outgrew its skin. This is the new one.",
      },
      { type: "h2", text: "Built around a single idea" },
      {
        type: "p",
        text: "The brand is built on control. Not spectacle — control. Deep black surfaces so the game is the only bright thing on screen, a single fire orange that marks the one action that matters on every page, and typography that reads like industrial signage rather than a game store banner.",
      },
      {
        type: "ul",
        items: [
          "One accent, used sparingly, always meaning the same thing.",
          "Angular geometry throughout — no rounded, bubbly gaming clichés.",
          "Motion that explains a state change, never motion that decorates.",
          "Contrast checked against WCAG AA on every surface.",
        ],
      },
      { type: "h2", text: "The emblem" },
      {
        type: "p",
        text: "The mark is a single angular F with a pointed flag, glowing red on a matte black plate. It is drawn as vector geometry, so the same shape holds from a 16px favicon to a full-width hero — no upscaled bitmap, no second variant to keep in sync.",
      },
      {
        type: "quote",
        text: "If the logo does not work at 16 pixels, it is not a logo. It is an illustration.",
      },
      { type: "h2", text: "What shipped" },
      {
        type: "p",
        text: "The site you are reading is live, and the launcher rebuilt on the same token system is published: v1.0.11 for Windows, macOS and Linux, with per-artifact SHA-256 manifests on GitHub Releases. Every download on this site points at a file that exists, and every release lists the digest you can check against.",
      },
    ],
  },
  {
    slug: "inside-the-launcher-architecture",
    title: "Inside the launcher: architecture and security",
    excerpt:
      "Context isolation, validated IPC, encrypted token storage and a main process that owns every privileged operation. A tour of how the new launcher is put together.",
    category: "Development",
    publishedAt: new Date("2026-01-08T11:30:00.000Z").toISOString(),
    readingMinutes: 6,
    author: "Engineering",
    body: [
      {
        type: "p",
        text: "A launcher sits between a user, a game installation and an authentication provider. That makes it a security boundary by accident. We designed the new FireClient around that reality instead of bolting it on afterwards.",
      },
      { type: "h2", text: "Two processes, one contract" },
      {
        type: "p",
        text: "The Electron renderer runs with node integration disabled, context isolation enabled and a strict content security policy. It cannot read the filesystem, spawn processes or touch tokens. Everything privileged is a named channel on a typed, validated IPC surface in the main process.",
      },
      {
        type: "ul",
        items: [
          "Every IPC payload is parsed with a schema before it is used.",
          "Channel names are an allowlist, not a dispatch string.",
          "The renderer receives plain view models, never raw tokens or file handles.",
          "Navigation to external URLs is blocked in-app and opened in the system browser.",
        ],
      },
      { type: "h2", text: "Authentication, end to end" },
      {
        type: "p",
        text: "Signing in runs the official Microsoft OAuth flow in the main process, exchanges the authorization code through Xbox Live and XSTS, then validates Minecraft ownership before a profile is stored. Refresh tokens are encrypted with the operating system keystore; access tokens live in memory and expire on their own schedule. Passwords are never requested and never stored.",
      },
      {
        type: "quote",
        text: "The renderer should never be able to answer the question ‘what is the user's token’ — only ‘who is signed in’.",
      },
      { type: "h2", text: "Downloads that verify themselves" },
      {
        type: "p",
        text: "Game assets, libraries and mod files are fetched into a staging directory, hashed, and only moved into the instance once the digest matches the manifest. A failed hash is a failed download — never a launch with a truncated jar. Transfers are resumable, so a dropped connection costs seconds, not the whole file.",
      },
      {
        type: "p",
        text: "This is why the release pipeline publishes a checksum manifest next to the binaries rather than trusting a download page: if the digest of the file you received does not match the published one, you do not run it. The verification report and security summary ship as release assets so the claim can be checked, not just read.",
      },
    ],
  },
  {
    slug: "what-performance-profiles-actually-change",
    title: "What performance profiles actually change",
    excerpt:
      "No magic FPS numbers. A straight explanation of the settings FireClient ships, what each one affects, and where the gains realistically come from.",
    category: "Performance",
    publishedAt: new Date("2026-01-04T08:15:00.000Z").toISOString(),
    readingMinutes: 5,
    author: "Engineering",
    body: [
      {
        type: "p",
        text: "Search for any Minecraft launcher and you will find a number with a plus sign in front of it. We are not going to give you one. Frame rate depends on your CPU, your GPU, your render distance, your mod list and the world you are standing in. What a launcher can honestly do is stop wasting resources and make the trade-offs visible.",
      },
      { type: "h2", text: "Memory is the first lever" },
      {
        type: "p",
        text: "Minecraft's garbage collector gets aggressive when the heap is tight, and long pauses show up as stutter. Too much heap is also a problem: bigger heaps mean longer collection pauses. FireClient's Balanced profile sizes the heap relative to your system memory and the mod count of the instance, and the slider shows the exact value in megabytes.",
      },
      { type: "h2", text: "JVM flags, spelled out" },
      {
        type: "ul",
        items: [
          "G1GC with tuned pause targets — reduces long collection stalls on modern JDKs.",
          "Explicit initial heap equal to maximum heap — avoids the runtime resizing the heap repeatedly.",
          "A small number of well-understood flags instead of a forty-flag cargo cult list.",
        ],
      },
      {
        type: "p",
        text: "Every flag in a profile is listed in the interface with its purpose. You can remove any of them, and the launcher will warn you if a value is invalid rather than launching a game that silently refuses to start.",
      },
      { type: "h2", text: "What we will never claim" },
      {
        type: "p",
        text: "We will not promise a percentage increase, a guaranteed frame rate, or that a profile fixes a world that is simply too heavy for your hardware. What we will do is show you the settings, explain the mechanism, and let you measure the result in your own world.",
      },
      {
        type: "quote",
        text: "A benchmark we publish is a benchmark you cannot reproduce. Measure it yourself.",
      },
    ],
  },
  {
    slug: "roadmap-to-1-0",
    title: "The road to 1.0",
    excerpt:
      "What is finished, what is in testing, and what is deliberately not in the first release — an honest checklist rather than a hype timeline.",
    category: "Release",
    publishedAt: new Date("2025-12-20T10:00:00.000Z").toISOString(),
    readingMinutes: 3,
    author: "FireClient Team",
    body: [
      {
        type: "p",
        text: "We would rather ship a small launcher that launches the game than a large one that almost does. Here is the state of the first release.",
      },
      { type: "h2", text: "Finished" },
      {
        type: "ul",
        items: [
          "New brand system, icon set and website",
          "Instance model shared by versions, mods and modpacks",
          "Version manifest resolution with library and asset downloads",
          "Microsoft OAuth, Xbox Live and XSTS exchange with ownership check",
          "Download queue with hash verification and resume",
        ],
      },
      { type: "h2", text: "In testing" },
      {
        type: "ul",
        items: [
          "Code-signed Windows installer and auto-update channel",
          "Forge and NeoForge installer automation on older Java versions",
          "Mod dependency resolution across loader metadata formats",
          "Crash log capture and one-click diagnostic bundle",
        ],
      },
      { type: "h2", text: "Not in 1.0 — yet" },
      {
        type: "ul",
        items: [
          "Server hosting or world management",
          "Account migration between launchers",
          "Mobile builds",
        ],
      },
      {
        type: "p",
        text: "The 1.0 line has since shipped on Windows, macOS and Linux with an automatic updater. The download page publishes the version, the byte size of each artifact and the SHA-256 digest, and every build links back to its GitHub release.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* FAQ                                                                */
/* ------------------------------------------------------------------ */

export type FaqCategory = "Installation" | "Account" | "Performance" | "Updates" | "Mods" | "Troubleshooting";

export const faqCategories: FaqCategory[] = [
  "Installation",
  "Account",
  "Performance",
  "Updates",
  "Mods",
  "Troubleshooting",
];

export const faqs: { category: FaqCategory; q: string; a: string }[] = [
  {
    category: "Installation",
    q: "Is there a download available right now?",
    a: "Yes. v1.0.11 is published on GitHub Releases with a Windows installer and portable build, a macOS universal DMG, and Linux .deb and AppImage packages. Every artifact has a published SHA-256 digest in SHA256SUMS.txt, and the release ships an automatic updater feed. Always verify the hash before running a build.",
  },
  {
    category: "Installation",
    q: "Which platforms are supported?",
    a: "Windows 10/11 (installer or portable .zip), macOS (universal DMG covering Intel and Apple silicon) and Linux (.deb for Debian/Ubuntu, plus an AppImage). All three use the same instance model, so worlds, modpacks and settings behave identically. Android and iOS are not supported.",
  },
  {
    category: "Installation",
    q: "Where does FireClient install things?",
    a: "The launcher installs to your user profile by default (a per-user folder, so no administrator rights are needed) and keeps every game instance in its own directory under a single FireClient data folder. You can move the data folder from Settings → Storage; the launcher will migrate existing instances.",
  },
  {
    category: "Installation",
    q: "Does FireClient need Java installed separately?",
    a: "No. FireClient manages Java runtimes itself, downloading the runtime each Minecraft version declares as required and letting you attach a custom JDK per instance in Settings. If you prefer your own JDK, point the launcher at its executable — the path is validated before launch.",
  },
  {
    category: "Installation",
    q: "Will installing FireClient touch my existing .minecraft folder?",
    a: "Only if you ask it to. FireClient creates isolated instances with their own game directories. Importing an existing installation is a separate, explicit action, and the launcher copies rather than moves files.",
  },
  {
    category: "Account",
    q: "Why does FireClient use Microsoft login?",
    a: "A Microsoft account is the only supported way to play Minecraft: Java Edition. FireClient runs the official Microsoft OAuth flow, then exchanges the result through Xbox Live, XSTS and the Minecraft services API before confirming game ownership. We never ask for your password and we do not support or permit cracked accounts.",
  },
  {
    category: "Account",
    q: "Where are my tokens stored?",
    a: "Refresh tokens are encrypted with the operating system keystore and held in the main process only. Access tokens stay in memory and are never exposed to the interface layer. Signing out deletes the stored token for that account; removing an account deletes it permanently.",
  },
  {
    category: "Account",
    q: "Can I use more than one account?",
    a: "Yes. Accounts are stored independently and you can switch the active profile without signing out. Each instance remembers the account it was last launched with, but never launches with an account that has not been explicitly selected.",
  },
  {
    category: "Account",
    q: "I get an error saying Xbox Live is unavailable. What now?",
    a: "This usually comes from an Xbox Live or Minecraft services outage rather than the launcher. Check the Xbox status page, then retry. If your account has never created an Xbox profile, sign in at xbox.com once to finish setup, then retry in FireClient.",
  },
  {
    category: "Performance",
    q: "Will FireClient increase my FPS?",
    a: "No honest launcher can promise that. FireClient gives you control over the settings that affect performance — heap size, JVM flags, render distance, resolution and fullscreen — and explains what each one changes. Whether that is faster on your machine depends on your hardware, your mods and your world. Measure it yourself rather than trusting a number from a marketing page.",
  },
  {
    category: "Performance",
    q: "How much RAM should I allocate?",
    a: "Start with 4 GB for a vanilla instance and add roughly 1 GB per 60–80 heavy mods, up to about half your system RAM. Allocating more than the game needs can make garbage collection pauses longer, not shorter. The slider shows the exact value and warns you when you approach a level that will hurt.",
  },
  {
    category: "Performance",
    q: "What do the performance profiles change?",
    a: "Each profile is a named set of JVM arguments and client settings: heap sizing, garbage collector selection, pause targets, resolution and fullscreen behaviour. Every flag is listed in the interface with its purpose, and you can edit or remove any of them.",
  },
  {
    category: "Performance",
    q: "Does the interface cost me frames while playing?",
    a: "The launcher is not rendered while the game runs; the window minimises or closes when the game takes focus, depending on your startup settings. In-game overlays are not part of the client, so there is no runtime hook in your game process.",
  },
  {
    category: "Updates",
    q: "How do updates work?",
    a: "FireClient checks the release feed for the channel you selected (Stable or Beta), shows you the changelog, downloads the package, verifies its SHA-256 hash against the published manifest, and only then installs it. Nothing is installed silently, and updates never interrupt a running game.",
  },
  {
    category: "Updates",
    q: "Can I stay on an older version?",
    a: "Yes. Turn off automatic updates or switch to the Stable channel, and the launcher will stop replacing your build. You can still check for updates manually from Settings → About.",
  },
  {
    category: "Updates",
    q: "What is the difference between Stable and Beta?",
    a: "Stable builds have passed the full test checklist and are the default. Beta builds ship earlier, include features still being validated, and may contain regressions. Choosing Beta is a deliberate action in Settings, not something that happens by accident.",
  },
  {
    category: "Mods",
    q: "Which mod loaders are supported?",
    a: "Vanilla, Fabric, Forge, NeoForge and Quilt, subject to the loader's own support for the Minecraft version you select. The version manager shows which loaders are available for each version before you install anything.",
  },
  {
    category: "Mods",
    q: "Can I use mods from CurseForge or Modrinth?",
    a: "Yes — a mod is a .jar file in the instance's mods folder, and FireClient installs files from disk or a direct download URL. Automatic dependency resolution uses the metadata inside mod jars; it does not require an account with any third-party catalogue.",
  },
  {
    category: "Mods",
    q: "Why does the launcher warn about a missing dependency?",
    a: "The mod declares a dependency in its metadata that is not present in the instance. FireClient reports the missing mod id and the loader context instead of launching into a crash screen. Installing the dependency clears the warning.",
  },
  {
    category: "Mods",
    q: "How do modpacks stay separate?",
    a: "Each modpack is an instance with its own game directory, loader, Java runtime, mods folder and config. Nothing is shared except the asset cache, which is content-addressed and safe to share. Exporting a pack produces a manifest you can hand to someone else.",
  },
  {
    category: "Troubleshooting",
    q: "The game closes immediately after launch.",
    a: "Open Downloads → Logs and read the launcher log for the last launch. The most common causes are an incompatible mod, insufficient allocated memory, or a Java version that does not match the instance. The log shows the exact JVM arguments used so you can reproduce the launch outside the launcher.",
  },
  {
    category: "Troubleshooting",
    q: "A download keeps failing.",
    a: "The download manager retries with backoff and resumes where it stopped. If an item stays failed, open it and check whether your network blocks the CDN host. Anything that fails hash verification is deleted and re-fetched rather than used.",
  },
  {
    category: "Troubleshooting",
    q: "How do I report a bug?",
    a: "Use the support page and include the diagnostic bundle from Settings → Debug (it contains logs and system information, no account tokens). If a public issue tracker is listed on the support page, that is the fastest route.",
  },
  {
    category: "Troubleshooting",
    q: "Where are the logs?",
    a: "Launcher logs live in the FireClient data folder under logs/, and game output is captured per instance. Settings → Debug opens the folder directly and can export a redacted bundle for support.",
  },
];

/* ------------------------------------------------------------------ */
/* GALLERY                                                             */
/* ------------------------------------------------------------------ */

export type Shot = {
  src: string;
  title: string;
  caption: string;
  kind: "launcher" | "ingame";
  tag: string;
};

export const gallery: Shot[] = [
  {
    src: "/images/shots/01-dashboard.webp",
    title: "Home",
    caption:
      "The dashboard: launch panel, instance telemetry, quick actions and the announcement feed.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/02-versions.webp",
    title: "Versions & loaders",
    caption:
      "Vanilla, Fabric, Forge, NeoForge and Quilt side by side, with installed instances below.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/03-mods.webp",
    title: "Mods",
    caption: "Modrinth browsing, one-click essential mods and curated modpack collections.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/04-modrinth.webp",
    title: "Modrinth browser",
    caption: "Search, filter and install mods without leaving the launcher.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/05-library.webp",
    title: "Library",
    caption: "Installed mods, resource packs and shaders with sizes and enable toggles.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/06-resource-packs.webp",
    title: "Resource packs",
    caption: "Browse and install packs, or drop a .zip straight into the instance.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/07-shaders.webp",
    title: "Shaders",
    caption: "Shader browsing with Iriss/OptiFine awareness for the selected instance.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/08-worlds.webp",
    title: "Worlds & saves",
    caption: "Per-instance worlds, backups and quick launch.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/09-servers.webp",
    title: "Servers & domains",
    caption: "Live player counts, ping and saved servers across public networks.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/10-skins.webp",
    title: "Skins & capes",
    caption: "Skin management, local capes and the launcher theme switch.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/11-usage.webp",
    title: "Usage",
    caption: "Playtime, session count and live process telemetry.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/12-settings-updater.webp",
    title: "Updates & settings",
    caption: "Verified release updater, RAM allocation and performance profile.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/13-performance.webp",
    title: "Performance check",
    caption: "Health check across Java, allocation, mods and network with one-click fixes.",
    kind: "launcher",
    tag: "Launcher",
  },
  {
    src: "/images/shots/14-ingame-menu.webp",
    title: "In-game menu",
    caption: "The FireClient overlay menu and in-game news feed.",
    kind: "ingame",
    tag: "In-game",
  },
  {
    src: "/images/shots/15-ingame-wardrobe.webp",
    title: "Wardrobe",
    caption: "Cloak selection and preview, rendered live on your character.",
    kind: "ingame",
    tag: "In-game",
  },
];

/* ------------------------------------------------------------------ */
/* SUPPORT                                                             */
/* ------------------------------------------------------------------ */

export const supportDocs = [
  {
    title: "Installation guide",
    body: "System requirements, installer walkthrough and first launch.",
    href: "/download#install",
    icon: "download",
  },
  {
    title: "Account & sign-in",
    body: "Microsoft OAuth, Xbox Live setup and multi-account handling.",
    href: "/faq#Account",
    icon: "shield-check",
  },
  {
    title: "Mods & modpacks",
    body: "Loader compatibility, dependency warnings and exporting packs.",
    href: "/features#mods",
    icon: "package",
  },
  {
    title: "Performance tuning",
    body: "Heap sizing, JVM flags and what each profile actually changes.",
    href: "/features#performance",
    icon: "gauge",
  },
  {
    title: "Logs & diagnostics",
    body: "Where logs live and what the diagnostic bundle contains.",
    href: "/faq#Troubleshooting",
    icon: "file-text",
  },
  {
    title: "Release notes",
    body: "Version history, channels and hash verification.",
    href: "/download#releases",
    icon: "git-branch",
  },
];
