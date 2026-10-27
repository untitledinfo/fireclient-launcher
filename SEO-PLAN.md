# FireClient SEO plan (evidence-based, no ranking promises)

Nobody can guarantee a #1 position on Google. What follows is the legitimate work that moves a site up, in order of impact.

## What the research found (27 Oct 2026)
- **The bare name is contested.** Searching "FireClient Minecraft launcher" returns mostly an unrelated Fabric SMP utility mod named FireClient (a Modrinth project with 240K+ downloads, mirrored on many sites), an old "Fire Client 3.0", "OnFire Client" and others. fireclient.net did not appear in those result sets. (The search tool used is not Google's live ranking; check Search Console for real data.)
- **Close competitors use near-identical wording** ("lightweight launcher and client for Minecraft Java Edition ... Windows 10 and 11 ... installs Fabric").
- So: do not fight for the bare word "FireClient". Win the **longer, specific searches** and make the brand unambiguous.

## Done in this release
- FAQ entry that separates this FireClient from the Modrinth SMP mod (**owner: confirm the "not affiliated" wording is true**).
- `disambiguatingDescription` and the release repo added to the home page entity data (JSON-LD).
- Home meta description now says "for Windows".
- New sourced page `/blog/fireclient-vs-lunar-client/` (only verifiable facts; says when Lunar is the better pick; no speed claims).
- Honest wording everywhere (no "100% safe"), which protects trust and avoids the quality/spam signals.
- Layout stability fixes (CLS) and a faster-to-use download panel.
- **Guides index** at `/guides/`: all 28 articles and 5 tools grouped by topic with jump links, in the sitemap, linked from the footer and the home page. New posts appear automatically under "More guides" (add a post's slug to a cluster in `GUIDE_CLUSTERS` in `lib/render.mjs` to place it).
- **Automatic IndexNow** (`.github/workflows/indexnow.yml`): after each push, waits until the live sitemap matches, then notifies Bing and other IndexNow engines about changed URLs. Needs no secrets. Google is separate: submit the sitemap in Search Console.

## Keyword map (one page per intent, to avoid cannibalisation)
| Search intent | Page that owns it |
|---|---|
| fireclient minecraft launcher / download windows | `/download/` (home supports) |
| is fireclient safe | `/blog/is-fireclient-safe/` |
| install fireclient | `/blog/install-fireclient-windows/` |
| fireclient vs lunar client / lunar client alternative | `/blog/fireclient-vs-lunar-client/` |
| free minecraft launcher windows | `/blog/free-minecraft-launcher-windows-what-to-look-for/` |
| minecraft 1.21.1 fabric client / mods | `/blog/install-fabric-mods-modrinth-minecraft-1-21-1/`, `/blog/fabric-vs-forge-vs-neoforge-vs-quilt/` |
| java 21 minecraft 1.21.1 | `/blog/install-java-21-for-minecraft-1-21-1/` |
| fabric crash 1.21.1 / launcher not opening | `/blog/fix-minecraft-crash-fabric-1-21-1/`, `/blog/minecraft-launcher-not-opening-windows/` |
| minecraft hud (fps, cps, keystrokes) | `/blog/fireclient-hud-setup-guide/` |
| best pvp settings 1.21.1 | `/blog/best-minecraft-pvp-settings-1-21-1/` |
Rule: a new article must target a query no page above owns. Do not publish near-duplicates.

## Not done (needs facts only you have)
- A Feather Client comparison: I could not reach Feather's official site and sources conflict. Add it only from official pages.
- Real screenshots/tests per guide (original photos and tested steps are the strongest quality signal).
- `<meta name="keywords">`: deliberately not added. Google ignores it and Bing treats it as a spam hint.

## 30 / 60 / 90 days
**30:** deploy; submit sitemap in Search Console; request indexing for `/`, `/download/`, `/faq/`, the Lunar page; run IndexNow; record baseline (impressions, clicks, CTR, average position per query). Add a Modrinth/Reddit/Discord "what is FireClient" post that links to `/` (genuine, not spam).
**60:** from Search Console find queries at positions 8-30 and improve those exact pages (answer the query higher up, add a screenshot, add internal links). Publish one tested guide per week for the clusters above. Get a few real mentions: your GitHub README, Discord, YouTube description, Modrinth/CurseForge profile, creators who actually use it.
**90:** review conversion (organic visit -> download click -> checksum viewed). Keep what works; merge or redirect pages that compete with each other.

## Link-building that is safe
Earned links only: README and profile links, creator coverage, helpful answers in communities where you disclose you are the author, directory listings that are real (AlternativeTo, Modrinth profile). No paid links, bot traffic, link farms or fake reviews: these get sites penalised.
