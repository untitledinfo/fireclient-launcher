# FireClient — Website

Public marketing site for **FireClient**, a premium Minecraft client and launcher
(Windows x64). Built as a real Next.js application, not a static mock-up campaign
page.

- **Brand:** FireClient — *Minecraft, Your Way.*
- **Live domain (intended):** https://fireclient.net

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 with a token-based design system |
| Motion | Framer Motion (used sparingly, respects `prefers-reduced-motion`) |
| Icons | Lucide |
| Validation | Zod (shared by client forms and API routes) |
| Content | Typed file-based content layer (`lib/content.ts`) |
| Screenshots | Real captures from the shipped launcher (`public/images/shots`) |
| Optional DB | PostgreSQL + Prisma (`prisma/schema.prisma`, reference schema) |

No UI kit, no template. Every component in `components/` is purpose-built.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; the site runs without it
npm run dev                  # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Type check:

```bash
npx tsc --noEmit
```

---

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Cinematic homepage: hero, performance control panel, feature grid, version compatibility, gallery, news, community, download CTA |
| `/features` | Per-capability detail with a sticky section rail (`#performance`, `#mods`, `#modpacks`, `#versions`, `#accounts`, `#downloads`, `#customization`, `#updates`) |
| `/download` | Release status, requirements, installation steps, changelog, SHA-256 verification, previous releases |
| `/gallery` | Launcher interface preview + world captures with a keyboard-accessible lightbox |
| `/news` | Announcements, development notes, release posts |
| `/news/[slug]` | Article pages (statically generated, `Article` JSON-LD) |
| `/about` | Story, principles, brand identity (logo usage, palette, typography), press assets, legal |
| `/faq` | Searchable, category-filtered FAQ (`FAQPage` JSON-LD) |
| `/support` | Documentation, bug-report form, community and security information |
| `/api/*` | Public JSON endpoints (see below) |

Also generated: `sitemap.xml`, `robots.txt`, `icon.svg` (favicon), 404 page.

---

## Project structure

```
app/
  layout.tsx            fonts, metadata, theme boot script, header/footer
  page.tsx              homepage composition
  globals.css           design tokens, utilities, motion primitives
  <route>/page.tsx      one folder per page
  api/                  health, releases, news, support
components/
  brand/Logo.tsx        vector emblem + wordmark (legibility-tuned sizes)
  layout/               header, footer, theme toggle, page hero
  home/                 homepage sections
  launcher/             launcher interface preview (real markup, not a bitmap)
  sections/             shared interactive blocks (FAQ, gallery, support form)
  ui/                   Button, Badge, Section, Reveal primitives
lib/
  site.ts               product + site configuration
  content.ts            features, versions, releases, posts, FAQ, gallery
  schemas.ts            Zod schemas shared with API routes
  utils.ts              formatting helpers
public/
  brand/                SVG logo package (emblem, mono, app icon)
  images/shots/         15 real launcher screenshots (WebP, 1280px)
prisma/schema.prisma    reference schema for the optional DB layer
```

---

## Content and release publishing

All editorial content lives in `lib/content.ts`. Nothing is fetched at request
time, so the site is fully static and deploys anywhere.

### Releases (live)

The site currently publishes **v1.0.11**, sourced from
`https://github.com/untitledinfo/verifed-fireclient/releases`. Each artifact's
byte size and SHA-256 digest in `lib/content.ts` is copied from that release's
published `SHA256SUMS.txt` — nothing is estimated.

When a new tag is cut, update `latestRelease` in `lib/content.ts`:

```ts
export const latestRelease: Release = {
  version: "1.0.12",
  channel: "stable",
  status: "available",
  releasedAt: "<tag publish timestamp>",
  pageUrl: `${RELEASE_PAGE}v1.0.12`,
  highlights: ["..."],
  files: [
    {
      os: "windows",
      label: "Installer",
      name: "FireClient-Setup.exe",
      sizeBytes: 10_643_064,                 // exact bytes from the asset list
      sha256: "<digest from SHA256SUMS.txt>", // never invent this
      url: `${DOWNLOAD_BASE}v1.0.12/FireClient-Setup.exe`,
    },
    // …macOS, Linux, portable
  ],
};
```

Then move the previous version into the `previous` array. Setting
`status: "unreleased"` flips the whole download page back to its honest
"no installer published" state, and `/api/releases` stops returning files.

> Rule this codebase is built around: a download button only ever points at an
> artifact that exists, with a digest that was actually published.

### Adding news posts

Append to `posts` in `lib/content.ts`. Body blocks are typed:
`{ type: "p" | "h2" | "ul" | "quote" }`. Pages and the sitemap generate
automatically.

### Feature copy

`features` drives both the homepage grid and the `/features` page (including its
sticky navigation), so a new entry needs no page edits.

---

## Environment variables

See `.env.example`. Only two are needed for a full-featured deployment:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap, JSON-LD |
| `SUPPORT_WEBHOOK_URL` | Where `/api/support` forwards validated messages |

Optional: `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_DISCORD_URL`,
`NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_X_URL`, `NEXT_PUBLIC_YOUTUBE_URL`,
`SUPPORT_WEBHOOK_TOKEN`.

Links that are left unset are not rendered as dead buttons — the UI falls back to
a "publishes with 1.0" state. When `SUPPORT_WEBHOOK_URL` is missing, the support
form returns a clear `not_configured` message and offers the contact email
instead of claiming success.

---

## API

| Endpoint | Method | Notes |
| --- | --- | --- |
| `/api/health` | GET | Service status, release version/status |
| `/api/releases` | GET | Public release feed; unreleased builds are returned with an empty file list |
| `/api/news` | GET | Post index (metadata only) |
| `/api/support` | POST | Zod-validated, honeypot-protected, in-memory rate limited (8/hour/IP), forwards to the webhook |

No secrets are ever exposed to the client. The support endpoint never writes to
the filesystem and never logs message bodies.

---

## Logo

The mark is the official FireClient app icon: the angular red **F** with a
pointed flag, on a matte black plate. It was traced from the supplied 128px
source art into vector geometry so it stays sharp at every size.

| Export | File | Use |
| --- | --- | --- |
| App icon (plate + glow) | `public/brand/app-icon.svg` | site logo, favicon (`app/icon.svg`), launcher shortcut |
| Mark, full colour | `public/brand/mark.svg` | large placements, watermarks |
| Mark, monochrome | `public/brand/mark-mono.svg` | single-colour print, `currentColor` |

Components: `<AppTile />`, `<Mark tone="color" | "mono" />`, and `<Logo />`
(tile + wordmark) in `components/brand/Logo.tsx`. All three are inline SVG with
one shared gradient definition.

## Design system

Tokens live in `app/globals.css` as CSS variables, exposed to Tailwind v4 through
`@theme inline`. Dark is the default; `.light` on `<html>` switches the palette.
The toggle persists to `localStorage` and a pre-paint script prevents a flash of
the wrong theme. If the visitor has never chosen, the system preference wins.

| Token | Dark | Light |
| --- | --- | --- |
| `--bg` | `#08090D` | `#F4F5F8` |
| `--surface` | `#151821` | `#FFFFFF` |
| `--ink` | `#E7EAF0` | `#0B0D12` |
| `--muted` | `#9298A5` | `#565D6B` |
| `--fire` | `#FF2D2D` | `#D11F1F` |
| `--ember` / `--gold` | `#FF5C47` / `#FF8A6B` | `#E0402C` / `#B8452C` |

### Motion and HUD language

The interface is built like a game client, not a SaaS landing page:

- **Scroll progress** — 2px red bar pinned beneath the header (`components/ui/ScrollProgress.tsx`).
- **Hero** — slow scan sweep, ember field, breathing bloom behind the app capture, and scroll-linked parallax on the screenshot.
- **HUD surfaces** — `.hud-corners` corner brackets that grow on hover, `.scanlines`, `.stripes`, notched badges (`.notch`), numbered section rails (`01`, `02`, …).
- **Buttons** — diagonal light sweep on hover, 2px radius, uppercase tracking.
- **Scroll reveals** — 20px rise, once per element, staggered groups.
- Everything above is disabled or reduced under `prefers-reduced-motion: reduce`.

Typography: **Barlow Condensed** (display, 500–800), **Inter** (body), **JetBrains
Mono** (labels, versions, hashes). The fire gradient is re-tuned in light mode so
headlines keep AA contrast on pale surfaces.

Motion: reveal-on-scroll, tab underlines, accordion height, lightbox — all
disabled or reduced under `prefers-reduced-motion: reduce`. Ambient embers are
pure CSS and hidden entirely under reduced motion.

---

## Accessibility

- Skip link, semantic landmarks, one `h1` per page.
- All interactive elements are real `<button>`/`<a>` with visible focus rings.
- Accordion uses `aria-expanded` / `aria-controls`; lightbox is a labelled modal
  with Escape and arrow-key handling and scroll locking.
- Form fields have labels, `aria-invalid`, and inline error text; the form has a
  polite live region.
- Colour contrast checked for both themes; decorative layers are `aria-hidden`.
- No horizontal overflow at 390 / 768 / 1280 / 1440 px (verified in a headless
  browser during development).

---

## Security notes

- Security headers (nosniff, referrer policy, frame options, permissions policy)
  are set in `next.config.ts`.
- `poweredByHeader` is disabled.
- The support form validates on both client and server against the same Zod
  schema, ignores honeypot hits, and rate limits per IP.
- The site holds no user accounts and no third-party credentials. The launcher
  (separate application) is where authentication lives — see the news article on
  the launcher architecture for how tokens are handled there.

---

---

## Search indexing (Google & Bing)

Everything needed to be indexed correctly is generated at build time — no
third-party SEO plugin, no runtime calls.

### What ships

| Surface | Implementation |
| --- | --- |
| Canonical URL on every page | `pageMetadata()` in `lib/seo.ts` (absolute, per route) |
| Titles & descriptions | Per page, keyword-specific, no duplicates |
| Robots | `app/robots.ts` — explicit `Googlebot`, `Googlebot-Image`, `Bingbot`, `msnbot`, `BingPreview` groups; `/api/` blocked; `Host` + sitemap |
| Sitemap | `app/sitemap.ts` — 8 pages + all articles, real `lastmod`, weighted priorities (home 1.0 → support 0.6) |
| RSS 2.0 | `app/rss.xml/route.ts`, advertised via `<link rel="alternate">` |
| Structured data | `lib/schema-org.ts` + `components/seo/JsonLd.tsx` |
| Social / SERP images | `public/og.png` (1200×630) with Open Graph + Twitter `summary_large_image` |
| Web app manifest | `app/manifest.ts` (name, theme colour, icon) |
| Verification hooks | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` |
| IndexNow | `scripts/indexnow.mjs` + `prebuild` key file |

### Structured data by page

| Page | schema.org types |
| --- | --- |
| All pages | `Organization`, `WebSite` (site-wide graph in the root layout) |
| `/` | `SoftwareApplication` — version, OS list, download URL, feature list |
| `/features`, `/download`, `/gallery`, `/news`, `/about`, `/faq`, `/support` | `BreadcrumbList` + page-specific |
| `/faq` | `FAQPage` (23 Q&A, eligible for FAQ rich results) |
| `/news/[slug]` | `BlogPosting` (headline, word count, reading time, author, publisher, image) + `BreadcrumbList` |

No `aggregateRating`, review counts or prices are emitted — inventing them would
be both dishonest and a rich-results violation.

### Google setup (10 minutes)

1. **Search Console** → *Add property* → URL prefix `https://fireclient.net`.
2. Choose **HTML tag**, copy only the `content="…"` value.
3. Set it as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in your host, redeploy.
4. Back in Search Console, click **Verify**.
5. **Sitemaps** → submit `sitemap.xml`.
6. **URL Inspection** → paste `https://fireclient.net/download` → *Request indexing*.
7. Validate the rich results at <https://search.google.com/test/rich-results>.

Google retired the sitemap ping endpoint in 2023 — submitting in Search Console
(plus the RSS feed) is the supported path.

### Bing setup (10 minutes)

1. **Bing Webmaster Tools** → *Add site* → `https://fireclient.net`.
2. Pick **Meta tag**, copy the `msvalidate.01` value.
3. Set it as `NEXT_PUBLIC_BING_SITE_VERIFICATION`, redeploy, then verify.
4. **Sitemaps** → submit `https://fireclient.net/sitemap.xml`.
5. **URL Submission → IndexNow** → generate a key, set `INDEXNOW_KEY`, redeploy.

`npm run build` writes `public/<key>.txt` (IndexNow requires the key to be
fetchable at the site root). After deploying, push every sitemap URL:

```bash
NEXT_PUBLIC_SITE_URL=https://fireclient.net npm run seo:indexnow
# [indexnow] submitted 12 URLs — HTTP 200 OK
```

Run that after each release or news post; IndexNow tells Bing, Yandex and Naver
immediately instead of waiting for a crawl.

### Verification checklist

```bash
curl -s https://fireclient.net/robots.txt      # crawler groups + sitemap
curl -s https://fireclient.net/sitemap.xml     # 12 URLs with lastmod
curl -s https://fireclient.net/rss.xml         # feed
curl -s https://fireclient.net/manifest.webmanifest
# per-page canonical + og tags:
curl -s https://fireclient.net/features | grep -o '<link rel="canonical"[^>]*>'
```

## Deploying to Vercel (and fixing a 404)

The build produces 25 static pages plus 4 API routes. If a deployment succeeds
but the URL returns a 404, the request is almost certainly not reaching the app.

### Which 404 are you seeing?

| What you see | Meaning |
| --- | --- |
| **"Lost in the overworld." / Error 404** with the FireClient header and footer | Our app answered. That route genuinely does not exist. |
| Plain **"This page doesn't exist / 404: NOT_FOUND"** with an ID like `bom1::wtn4v-…` | Vercel's platform 404. The app was never invoked. |

The second case is a project/domain configuration problem, not a code problem.
Run the diagnostic first:

```bash
npm run deploy:check -- https://fireclient-launcher.vercel.app
```

It prints the status of `/`, `/download`, `/features`, `/api/health` and
`/sitemap.xml` with the `x-vercel-id`, and tells you which of the cases below
you are in.

### Fix, in order of likelihood

1. **Production branch mismatch.** Project → *Settings → Git → Production
   Branch* must be `main`. If it is set to `master` (or anything else), every
   `main` deploy becomes a *Preview*, and the production domain has nothing to
   serve → platform 404 on `/`.
   Fix: set it to `main`, then *Deployments → … → Promote to Production* on the
   latest build.

2. **Domain attached to another project.** Project → *Settings → Domains*.
   `fireclient.net` (and `www`) must be listed on **this** project — not on the
   old launcher project. Remove it from the other project first, then add it
   here and re-point DNS if prompted.

3. **Root Directory.** Project → *Settings → General → Root Directory*. It must
   be the folder containing this `package.json` (`next.config.ts`, `app/`). If
   the site lives in a subfolder of `fireclient-launcher`, set the Root
   Directory to that subfolder; leaving it blank while the repo root has no
   Next app produces an empty deployment.

4. **Framework preset / output directory.** *Settings → Build & Development
   Settings*: Framework Preset = **Next.js**, Build Command = `npm run build`,
   Output Directory = **empty (default)**, Install Command = `npm ci`.
   A leftover `out` or `public` in *Output Directory* makes Vercel serve a
   directory that does not contain the app → 404 on every route.
   `vercel.json` in this repo pins the framework and the commands, but the
   dashboard value wins if it is set.

5. **Deployment Protection.** *Settings → Deployment Protection* → Vercel
   Authentication must be **off** for the production domain, otherwise you get
   a login wall or a 404 for anonymous requests.

6. **Wrong URL.** Preview deployments use a different hostname
   (`project-git-branch-team.vercel.app`). Confirm with `vercel inspect` or the
   deployment page; a mistyped hash hostname returns the platform 404.

### Verify the fix

```bash
curl -sI https://fireclient.net/            # expect 200, content-type text/html
curl -s  https://fireclient.net/api/health  # {"status":"ok", ...}
curl -s  https://fireclient.net/robots.txt  # crawler groups + sitemap
```

If `/api/health` returns 200 the app is live and any remaining 404 is a route
path, not a deployment problem.

## Deployment

Any Node host or serverless platform works:

```bash
npm install
npm run build
npm start          # or deploy to Vercel / Netlify / a container
```

Static-first: every marketing page is prerendered at build time. Set
`NEXT_PUBLIC_SITE_URL` in the host environment.

### Moving content to PostgreSQL (optional)

`prisma/schema.prisma` defines `Release`, `ReleaseFile`, `Post` and
`SupportRequest`. To use it:

1. Set `DATABASE_URL`, run `npx prisma migrate dev`.
2. Replace the exported arrays in `lib/content.ts` with Prisma queries (the page
   components only consume the exported types, so no JSX changes are required).
3. Add an authenticated admin area for editing — see below.

---

## What this delivery covers (and what is next)

**Included and working:** the official vector logo, every public page, 15 real
launcher screenshots across the hero/gallery/features/download pages, light/dark
themes plus swappable crimson and fire accents, live v1.0.11 release data with
published checksums, working forms with server validation, JSON-LD,
sitemap/robots, and security headers.

**Not in this delivery** (deliberately, so nothing is faked):

- Source changes to the Electron launcher application itself.
- An authenticated `/admin` area for editing news/releases/support requests.
- Database wiring (schema is provided as the intended shape).

Those are the next milestones; nothing in the UI pretends they exist.
