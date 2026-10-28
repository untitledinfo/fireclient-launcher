/* FireClient content renderer. Shared by tools/build.mjs (Node) and admin/admin.js (browser).
   Turns content/posts.json into static, SEO-ready pages, sitemap.xml, feed.xml and content/latest.json. */
import { LOCALES } from "./locales.mjs";
export const SITE = {
  url: "https://www.fireclient.net", name: "FireClient", tagline: "Minecraft, Your Way.",
  author: "FirePDX", ogImage: "/assets/og-image.png", homeLastmod: "2026-10-24", staticLastmod: "2026-10-18", changedLastmod: "2026-10-25",
  discord: "https://discord.gg/r23YNWWfrx", github: "https://github.com/untitledinfo/fireclient-launcher",
  releases: "https://github.com/untitledinfo/verifed-fireclient/releases", installer: "https://github.com/untitledinfo/verifed-fireclient/releases/latest/download/FireClient-Setup.exe", report: "https://github.com/untitledinfo/verifed-fireclient/releases/latest/download/verification-report.json"
};
export const TYPES = {
  blog: { dir: "blog", label: "Blog", ld: "BlogPosting", title: "FireClient Blog — Guides for the Minecraft launcher and client",
    desc: "Guides and tips for FireClient, the free Minecraft Java launcher and Fabric client: HUD setup, installing, mods and more.", lede: "Guides and tips for the launcher and the in-game client.",
    startH: "Start here", intro: "New to FireClient? These four guides take you from download to a working in-game setup. Every guide is written by the FireClient team and says what is built today and what is only planned.",
    start: [["/blog/install-fireclient-windows/", "Install FireClient on Windows in five steps"], ["/blog/fireclient-hud-setup-guide/", "How to set up the FireClient HUD in Minecraft 1.21.1"], ["/blog/is-fireclient-safe/", "Is FireClient safe? How to check your download"], ["/blog/back-up-fireclient-hud-layout/", "Back up and reuse your FireClient HUD layout"]] },
  news: { dir: "news", label: "News", ld: "NewsArticle", title: "FireClient News — Releases and announcements",
    desc: "Release notes and announcements for FireClient, the free Minecraft Java launcher and Fabric client for Windows.", lede: "Releases and announcements.",
    startH: "Release timeline", intro: "News covers FireClient releases, known issues and plans, written by the FireClient team. Each post says what changed, what is known to be broken and what is only planned, so you can tell shipped features from future ones. Follow along with the RSS feed or in the Discord.",
    start: [["/news/fireclient-1-0-beta-available/", "FireClient 1.0 is available as a free Windows beta"], ["/news/fireclient-early-access-november-2026-roadmap/", "Early access is live, full version planned for November 2026"], ["/news/fireclient-1-1-device-scaling-crash-fix-update/", "FireClient 1.1: Device Scaling, Pro Crash Reporter and Official License"], ["/early-access/", "Early access page: what works today and known limits"]] }
};

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const slugify = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/, "");
// Pages whose content really changed on SITE.changedLastmod (release panel, claims clean-up, stale version removal).
// Hand-maintained on purpose: a lastmod only helps search engines while it is true. Update it when a page's content changes.
const CHANGED = new Set(["/", "/download/", "/early-access/", "/tools/verify-download/", "/license.html"]);
const lm = path => (CHANGED.has(path) || /^\/[a-z]{2}(-[A-Za-z]+)?\/$/.test(path) ? SITE.changedLastmod : SITE.homeLastmod);
const url = p => /^https?:/i.test(p) ? p : "/" + String(p || "").replace(/^\/+/, "");
const abs = p => /^https?:/i.test(p) ? p : SITE.url + url(p);
const safeUrl = u => /^(https?:\/\/|\/|#|mailto:)/i.test(u.trim()) ? u.trim() : "#";
const fmt = d => d ? new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }) : "";
const rfc822 = d => new Date(d + "T12:00:00Z").toUTCString();
export const plain = b => String(b || "").replace(/```[\s\S]*?```/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[`#>*_~|-]/g, " ").replace(/\s+/g, " ").trim();
export const words = b => { const t = plain(b); return t ? t.split(" ").length : 0; };
const readMins = b => Math.max(1, Math.round(words(b) / 220));
export const postUrl = p => `/${TYPES[p.type].dir}/${p.slug}/`;
const descOf = p => (p.metaDescription || p.excerpt || plain(p.body).slice(0, 155)).trim();
export const titleOf = p => { const t = (p.metaTitle || p.title).trim(); return /fireclient/i.test(t) ? t : `${t} — FireClient`; };

/* ---------- Markdown (HTML is escaped first, so posts cannot inject markup) ---------- */
function inline(t) {
  t = esc(t); const codes = [];
  t = t.replace(/`([^`]+)`/g, (_, c) => (codes.push(c), `\u0000${codes.length - 1}\u0000`));
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => `<img src="${safeUrl(u)}" alt="${a}"${dimAttr(safeUrl(u))} loading="lazy" decoding="async">`);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, a, u) => { u = safeUrl(u); return /^https?:/i.test(u) && !u.startsWith(SITE.url) ? `<a href="${u}" target="_blank" rel="noopener noreferrer">${a}</a>` : `<a href="${u}">${a}</a>`; });
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
}
export function md(src) {
  const L = String(src || "").replace(/\r\n?/g, "\n").split("\n"), out = [], toc = [], used = {}, para = []; let i = 0;
  const flush = () => { if (!para.length) return; const j = para.join(" ");
    out.push(/^!\[[^\]]*\]\([^)\s]+\)$/.test(j) ? `<figure>${inline(j)}<figcaption>${esc(j.match(/^!\[([^\]]*)\]/)[1])}</figcaption></figure>` : `<p>${inline(j)}</p>`); para.length = 0; };
  while (i < L.length) {
    const l = L[i]; let m;
    if (/^```/.test(l)) { flush(); const b = []; i++; while (i < L.length && !/^```/.test(L[i])) b.push(L[i++]); i++; out.push(`<pre><code>${esc(b.join("\n"))}</code></pre>`); continue; }
    if ((m = l.match(/^(#{1,4})\s+(.+?)\s*#*$/))) { flush(); const lv = Math.max(2, m[1].length); let id = slugify(m[2]) || "section";
      used[id] = (used[id] || 0) + 1; if (used[id] > 1) id += "-" + used[id]; if (lv === 2) toc.push({ id, text: m[2] });
      out.push(`<h${lv} id="${id}">${inline(m[2])}<a class="h-anchor" href="#${id}" aria-label="Link to this section">#</a></h${lv}>`); i++; continue; }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(l)) { flush(); out.push("<hr>"); i++; continue; }
    if (/^>\s?/.test(l)) { flush(); const b = []; while (i < L.length && /^>\s?/.test(L[i])) b.push(L[i++].replace(/^>\s?/, "")); out.push(`<blockquote>${md(b.join("\n")).html}</blockquote>`); continue; }
    const ul = /^\s*[-*+]\s+/, ol = /^\s*\d+[.)]\s+/;
    if (ul.test(l) || ol.test(l)) { flush(); const re = ol.test(l) ? ol : ul, tag = re === ol ? "ol" : "ul", it = []; while (i < L.length && re.test(L[i])) it.push(L[i++].replace(re, "")); out.push(`<${tag}>${it.map(x => `<li>${inline(x)}</li>`).join("")}</${tag}>`); continue; }
    if (!l.trim()) { flush(); i++; continue; }
    para.push(l.trim()); i++;
  }
  flush(); return { html: out.join("\n"), toc };
}

/* ---------- Page shell ---------- */
const nav = a => `<header class="site-header is-scrolled" id="site-header">
    <a class="brand" href="/" aria-label="FireClient home"><img src="/assets/logo.svg" alt="" width="28" height="28"><span class="brand-word">FIRE<span>CLIENT</span></span><span class="brand-tag">BETA</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation menu"><span></span><span></span><span></span></button>
    <nav id="site-nav" class="site-nav" aria-label="Main navigation">
      <a href="/#in-game">In game</a><a href="/#features">Features</a>
      <a href="/blog/"${a === "blog" ? ' aria-current="true"' : ""}>Blog</a><a href="/news/"${a === "news" ? ' aria-current="true"' : ""}>News</a>
      <a href="/early-access/"${a === "ea" ? ' aria-current="true"' : ""}>Early access</a><a href="/#faq">FAQ</a>
      <a class="btn btn-primary btn-sm" href="/download/">Get FireClient</a>
    </nav>
  </header>`;
const footer = `<footer class="site-footer">
    <div class="wrap footer-main">
      <a class="brand" href="/"><img src="/assets/logo.svg" alt="" width="24" height="24"><span class="brand-word">FIRE<span>CLIENT</span></span></a>
      <p class="footer-tag">${SITE.tagline}</p>
      <nav class="footer-nav" aria-label="Footer navigation"><a href="/#features">Features</a><a href="/download/">Download</a><a href="/early-access/">Early access</a><a href="/faq/">FAQ</a><a href="/tools/">Tools</a><a href="/press/">Press kit</a><a href="/#changelog">Changelog</a><a href="/guides/">Guides</a><a href="/screenshots/">Screenshots</a><a href="/blog/">Blog</a><a href="/news/">News</a><a href="/feed.xml">RSS</a><a href="/#faq">FAQ</a><a href="${SITE.discord}" target="_blank" rel="noopener noreferrer">Discord</a><a href="${SITE.github}" target="_blank" rel="noopener noreferrer">GitHub</a><a href="/terms-and-privacy.html">Terms &amp; Privacy</a><a href="/license.html">License &amp; Safety</a><a href="/removal-requests/">Removal requests</a></nav>
    </div>
    <div class="wrap footer-bottom"><span>© 2026 FireClient. Created by FirePDX and Sajjad Ahmed.</span><span>Not affiliated with Mojang or Microsoft.</span></div>
  </footer>`;
const navL = L => { const u = L.ui; return `<header class="site-header is-scrolled" id="site-header">
    <a class="brand" href="/" aria-label="FireClient"><img src="/assets/logo.svg" alt="" width="28" height="28"><span class="brand-word">FIRE<span>CLIENT</span></span><span class="brand-tag">BETA</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="${esc(u.menu_open)}"><span></span><span></span><span></span></button>
    <nav id="site-nav" class="site-nav" aria-label="${esc(u.nav_download)}">
      <a href="/${L.code}/" aria-current="true">${esc(u.nav_download)}</a><a href="/blog/" lang="en">${esc(u.nav_blog)}</a><a href="/faq/" lang="en">${esc(u.nav_faq)}</a>
      <a class="btn btn-primary btn-sm" href="/${L.code}/#ea-download">${esc(u.nav_get)}</a>
    </nav>
  </header>`; };
const footerL = L => { const u = L.ui; return `<footer class="site-footer">
    <div class="wrap footer-main">
      <a class="brand" href="/"><img src="/assets/logo.svg" alt="" width="24" height="24"><span class="brand-word">FIRE<span>CLIENT</span></span></a>
      <p class="footer-tag">${SITE.tagline}</p>
      <nav class="footer-nav" aria-label="${esc(u.nav_download)}"><a href="/${L.code}/">${esc(u.nav_download)}</a><a href="/faq/" lang="en">${esc(u.nav_faq)}</a><a href="/blog/" lang="en">${esc(u.nav_blog)}</a></nav>
    </div>
    <div class="wrap footer-bottom"><span>© 2026 FireClient. Created by FirePDX and Sajjad Ahmed.</span><span>${esc(u.foot_notaff)}</span></div>
  </footer>`; };

// Google Analytics (gtag.js). Added right after <head> on every generated page.
const GTAG = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-4NFHVETSH6"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  // Consent Mode: in the EEA, UK and Switzerland, analytics storage stays off until the visitor accepts (see consent.js).
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'], wait_for_update: 500 });
  try { var c = localStorage.getItem('fc:analytics'); if (c) gtag('consent', 'update', { analytics_storage: c === 'yes' ? 'granted' : 'denied' }); } catch (e) {}
  gtag('js', new Date());

  gtag('config', 'G-4NFHVETSH6');
</script>`;

function shell({ title, desc, path, image, og = "website", ld = [], body, active, extra = "", lang = "en", locale = "en_US", dir = "ltr", L: LL }) {
  const canon = SITE.url + path, img = abs(image || SITE.ogImage);
  return `<!doctype html>
<html lang="${lang}"${dir === "rtl" ? ' dir="rtl"' : ""}>
<head>
  ${GTAG}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#09070a">
  <meta name="color-scheme" content="dark">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="author" content="${SITE.author}">
  <link rel="canonical" href="${canon}">
  <meta property="og:type" content="${og}"><meta property="og:url" content="${canon}"><meta property="og:site_name" content="FireClient"><meta property="og:locale" content="${locale}">
  <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:image" content="${img}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${img}">${extra}
  <link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon-48.png"><link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png"><link rel="icon" type="image/png" sizes="512x512" href="/assets/icon.png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="FireClient blog and news" href="/feed.xml">
  <link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/blog.css">
  <meta name="google-site-verification" content="cebfbd11166408c1">
  <meta name="google-site-verification" content="fc8a4b3d729e120f">
  <meta name="msvalidate.01" content="6BFB53E06A4864361932B8C254859F76">
  <script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": ld }).replace(/</g, "\\u003c")}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${LL ? navL(LL) : nav(active)}
  <main id="main" class="pg-main">
${body}
  </main>
  ${(LL ? footerL(LL) : footer).replace('<div class="wrap footer-bottom">', `<div class="wrap lang-wrap">${langPicker(lang, LL && LL.ui.lang_label)}</div><div class="wrap footer-bottom">`)}
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <script src="/blog.js" defer></script>
  <script src="/ea.js" defer></script>
  <script src="/lang.js" defer></script>
  <script src="/consent.js" defer></script>
  <script src="/share.js" defer></script>
  <script src="/features.js" defer></script>
  <script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
`;
}
const crumbs = items => ({ "@type": "BreadcrumbList", itemListElement: items.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE.url + u })) });
const publisher = { "@type": "Organization", name: "FireClient", url: SITE.url + "/", logo: { "@type": "ImageObject", url: SITE.url + "/assets/icon.png", width: 512, height: 512 } };

const webp = c => String(c || "").replace(/-960\.jpg$/, "-960.webp");
const pic = (src, img) => /-960\.jpg$/.test(src) ? `<picture><source srcset="${webp(src)}" type="image/webp"><img ${img}></picture>` : `<img ${img}>`;
const IMG_DIMS = { "launcher-home-960": [960, 464], "launcher-mods-960": [960, 464], "ingame-menu-960": [960, 565], "ingame-hud-960": [960, 564], "ingame-gameplay-960": [960, 564], "launcher-versions-960": [960, 464], "launcher-modrinth-960": [960, 464], "launcher-library-960": [960, 464], "launcher-resource-packs-960": [960, 464], "launcher-shaders-960": [960, 464], "launcher-worlds-960": [960, 464], "launcher-accounts-960": [960, 464], "launcher-skins-960": [960, 464], "launcher-usage-960": [960, 464] };
const dimAttr = src => { const m = /\/assets\/([a-z-]+-960)\.(?:jpg|webp)$/.exec(String(src)); return m && IMG_DIMS[m[1]] ? ` width="${IMG_DIMS[m[1]][0]}" height="${IMG_DIMS[m[1]][1]}"` : ""; };
const small = c => String(c || "").replace(/^(\/assets\/(?:ingame-hud|ingame-menu|launcher-home|launcher-mods))\.jpg$/, "$1-960.jpg");
const card = (p, big) => `<a class="pcard${big ? " pcard-big" : ""}" href="${postUrl(p)}" data-q="${esc((p.title + " " + p.excerpt + " " + (p.tags || []).join(" ")).toLowerCase())}" data-tags="${esc((p.tags || []).join(","))}">
      ${p.cover ? pic(small(url(p.cover)), `class="pcard-cover" src="${esc(small(url(p.cover)))}" alt=""${dimAttr(small(url(p.cover)))} loading="${big ? "eager" : "lazy"}" decoding="async"`) : `<span class="pcard-cover pcard-ph" aria-hidden="true"><img src="/assets/logo.svg" alt="" width="56" height="56"></span>`}
      <span class="pcard-body"><span class="pmeta"><b>${TYPES[p.type].label}</b><time datetime="${p.date}">${fmt(p.date)}</time><span>${readMins(p.body)} min read</span></span>
      <h${big ? 2 : 3} class="pcard-title">${esc(p.title)}</h${big ? 2 : 3}><span class="pcard-ex">${esc(p.excerpt)}</span></span></a>`;

function listPage(type, all) {
  const T = TYPES[type], list = all.filter(p => p.type === type), path = `/${T.dir}/`;
  const body = `    <section class="pg-hero"><div class="wrap">
      ${eaStrip}
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FireClient</a><span aria-hidden="true">/</span><span aria-current="page">${T.label}</span></nav>
      <h1>${T.label}</h1><p class="lede">${T.lede} <a class="rss" href="/feed.xml">RSS feed</a></p>
      ${list.length > 1 ? `<div class="pg-tools" data-tools hidden><input type="search" id="pq" placeholder="Search ${T.label.toLowerCase()}" aria-label="Search ${T.label.toLowerCase()}"><div class="tagbar">${[...new Set(list.flatMap(p => p.tags || []))].sort().map(t => `<button type="button" class="tag" data-tag="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join("")}</div></div>` : ""}
    </div></section>
    <section class="wrap pg-list">
      <p class="nomatch panel" hidden>No posts match. Try a different word or clear the tag.</p>
${list.length ? `      <div class="pfeature">${card(list[0], true)}</div>\n      ${list.length > 1 ? `<div class="pgrid">\n${list.slice(1).map(p => "      " + card(p)).join("\n")}\n      </div>` : ""}` : `      <div class="panel empty"><h2>Nothing here yet.</h2><p>New ${T.label.toLowerCase()} posts will show up on this page. <a href="${SITE.discord}" target="_blank" rel="noopener noreferrer">Join the Discord</a> to hear first.</p></div>`}
    </section>
    ${T.start ? `<section class="wrap ea-cols"><div class="panel"><h2>${T.startH}</h2><p>${T.intro}</p><ul class="ea-list">${T.start.map(([u, t]) => `<li><a href="${u}">${esc(t)}</a></li>`).join("")}</ul></div></section>` : ""}`;
  return shell({ title: T.title, desc: T.desc, path, body, active: type, ld: [
    { "@type": "CollectionPage", "@id": SITE.url + path, url: SITE.url + path, name: T.title, description: T.desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en" },
    { "@type": "ItemList", itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: SITE.url + postUrl(p), name: p.title })) },
    crumbs([["FireClient", "/"], [T.label, path]])] });
}


// ---- Screenshots gallery: real screenshots from an early-access build. Captions only state what is visible. ----
const SHOTS = [
  { g: "game", n: "ingame-menu", t: "Title screen", c: "The FireClient title screen in Minecraft 1.21.1: your signed-in profile, a FireClient Menu button, a news card and a bottom row of buttons including Menu, Mods, Discord and Quit." },
  { g: "game", n: "ingame-hud", t: "In-game FireClient menu", c: "Tabs for Mods, Settings, Keybinds and Mod List. Filter modules by All, New, HUD, PvP, Visual, Move or Perf, switch each one on or off, keep profiles such as Default, PvP, Builder and Performance, and use Edit HUD Layout to move elements." },
  { g: "game", n: "ingame-gameplay", t: "HUD in a world", c: "HUD elements on screen in a singleplayer world: coordinates, ping, facing direction, memory use, clock, armor, CPS, hearts, speed, biome, a session timer, TPS and WASD keystrokes." },
  { g: "launcher", n: "launcher-home", t: "Launcher home", c: "A Launch button, your account and version, quick buttons and a news feed. The sidebar groups Play, Content, World, You and System pages." },
  { g: "launcher", n: "launcher-mods", t: "Mods", c: "Browse top Modrinth mods with install buttons and filters, plus curated packs such as Performance, Visuals, Utility and PvP." },
  { g: "launcher", n: "launcher-versions", t: "Versions", c: "Install a version with Vanilla, Fabric or Forge, then launch any version you have installed." },
  { g: "launcher", n: "launcher-modrinth", t: "Modrinth", c: "Search and filter Modrinth projects and install them from inside the launcher." },
  { g: "launcher", n: "launcher-library", t: "My Library", c: "The mods you have installed, each with an on/off switch and a delete button." },
  { g: "launcher", n: "launcher-resource-packs", t: "Resource packs", c: "Browse popular resource packs and manage the ones you use." },
  { g: "launcher", n: "launcher-shaders", t: "Shaders", c: "Browse popular shader packs from the launcher." },
  { g: "launcher", n: "launcher-worlds", t: "Worlds and saves", c: "Your worlds with preview images, plus a place for backups." },
  { g: "launcher", n: "launcher-accounts", t: "Accounts", c: "Sign in with Microsoft, use a token or an offline profile, and switch between saved accounts. Personal details in this screenshot are blurred." },
  { g: "launcher", n: "launcher-skins", t: "Skins", c: "Preview your skin and manage local skins." },
  { g: "launcher", n: "launcher-usage", t: "Usage", c: "Total playtime, sessions, versions played and a playtime-by-day chart." },
];
function shotsPage() {
  const path = "/screenshots/", title = "FireClient Screenshots: Launcher, Menu and HUD";
  const desc = "See FireClient for Windows: the launcher's mod manager, versions, worlds and accounts pages, plus the in-game menu and HUD in Minecraft 1.21.1.";
  const alt = s => `${s.t}: ${s.c}`.replace(/\s+/g, " ");
  const fig = s => { const d = IMG_DIMS[s.n + "-960"] || [960, 540];
    return `<figure class="shot-card"><a href="/assets/${s.n}.jpg" aria-label="Open the full-size image: ${esc(s.t)}"><picture><source srcset="/assets/${s.n}-960.webp" type="image/webp"><img src="/assets/${s.n}-960.jpg" alt="${esc(alt(s))}" width="${d[0]}" height="${d[1]}" loading="lazy" decoding="async"></picture></a><figcaption><strong>${esc(s.t)}</strong><span>${esc(s.c)}</span></figcaption></figure>`; };
  const sect = (id, h, d, g) => `<div class="wrap shots-sec" id="${id}"><h2>${h}</h2><p class="note">${d}</p><div class="shot-grid">${SHOTS.filter(s => s.g === g).map(fig).join("")}</div></div>`;
  const body = `    <section class="pg-hero"><div class="wrap">
      ${eaStrip}
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FireClient</a><span aria-hidden="true">/</span><span aria-current="page">Screenshots</span></nav>
      <h1>FireClient screenshots</h1>
      <p class="lede">Screenshots of the launcher and the in-game client from an early-access build (October 2026). Personal details are blurred, and labels may change between releases. Ready to try it? <a href="/download/">Download FireClient</a>.</p>
      <nav class="guide-jump" aria-label="Screenshot groups"><a href="#in-game">In game</a><a href="#launcher">Launcher</a></nav>
    </div></section>
${sect("in-game", "In game", "The title screen, the FireClient menu and the HUD in Minecraft 1.21.1 on Fabric.", "game")}
${sect("launcher", "Launcher", "The Windows launcher: mods, versions, worlds, accounts and more.", "launcher")}`;
  return shell({ title, desc, path, body, active: "", ld: [
    { "@type": ["CollectionPage", "ImageGallery"], "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, inLanguage: "en", isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" },
      image: SHOTS.map(s => ({ "@type": "ImageObject", contentUrl: `${SITE.url}/assets/${s.n}.jpg`, name: s.t, caption: s.c, width: 1600, height: IMG_DIMS[s.n + "-960"] ? Math.round(1600 * IMG_DIMS[s.n + "-960"][1] / IMG_DIMS[s.n + "-960"][0]) : undefined })) },
    crumbs([["FireClient", "/"], ["Screenshots", path]])] });
}

// ---- Guides index (topic hub): every article and tool grouped by what the reader is trying to do ----
const GUIDE_CLUSTERS = [
  { id: "start", h: "Get started with FireClient", d: "Install it, set up the HUD, and check your download is genuine.", slugs: ["install-fireclient-windows", "fireclient-hud-setup-guide", "back-up-fireclient-hud-layout", "is-fireclient-safe", "fireclient-vs-lunar-client", "fireclient-minecraft-bedrock-mcpe"] },
  { id: "choose", h: "Choose a launcher and understand clients", d: "What launchers, clients and mod loaders actually are, and how to pick.", slugs: ["free-minecraft-launcher-windows-what-to-look-for", "what-is-a-minecraft-client-fabric-explained", "minecraft-java-vs-bedrock-which-edition", "fabric-vs-forge-vs-neoforge-vs-quilt"] },
  { id: "mods", h: "Mods, Fabric and Java for 1.21.1", d: "Set up Fabric, find safe mods and install them from Modrinth.", slugs: ["install-java-21-for-minecraft-1-21-1", "install-fabric-mods-modrinth-minecraft-1-21-1", "how-to-find-safe-minecraft-mods", "switch-or-downgrade-minecraft-versions-safely"] },
  { id: "performance", h: "Performance and settings", d: "More FPS, sensible memory and PvP-friendly settings.", slugs: ["boost-fps-minecraft-1-21-1-fabric", "run-minecraft-smoothly-on-a-laptop", "minecraft-ram-allocation-guide", "best-minecraft-pvp-settings-1-21-1"] },
  { id: "fixes", h: "Fix problems", d: "Crashes, sign-in errors, launcher problems and connection errors.", slugs: ["fix-minecraft-crash-fabric-1-21-1", "minecraft-launcher-not-opening-windows", "fix-minecraft-microsoft-sign-in-error", "fix-minecraft-connection-timed-out"] },
  { id: "worlds", h: "Worlds, skins and servers", d: "Back up your worlds, change your skin and host a server.", slugs: ["backup-minecraft-worlds-windows", "how-to-change-minecraft-skin-java-edition", "host-minecraft-paper-server-windows"] },
];
function guidesPage(all) {
  const bySlug = Object.fromEntries(all.map(p => [p.slug, p])), used = new Set();
  const groups = GUIDE_CLUSTERS.map(c => ({ id: c.id, h: c.h, d: c.d, items: c.slugs.map(s => bySlug[s]).filter(Boolean) })).filter(g => g.items.length);
  groups.forEach(g => g.items.forEach(p => used.add(p.slug)));
  const more = all.filter(p => p.type === "blog" && !used.has(p.slug)); // posts added later still appear here
  if (more.length) groups.push({ id: "more", h: "More guides", d: "", items: more });
  const news = all.filter(p => p.type === "news");
  if (news.length) groups.push({ id: "news", h: "Release news", d: "What changed in each FireClient release.", items: news });
  const li = p => `<li><a href="${postUrl(p)}">${esc(p.title)}</a><span>${esc(p.excerpt || descOf(p))}</span></li>`;
  const tools = Object.values(TOOLS), path = "/guides/";
  const title = "Minecraft Guides: Fabric 1.21.1, Mods, Fixes & FireClient";
  const desc = "Every FireClient and Minecraft Java guide in one index: install and set up, Fabric 1.21.1 mods, performance, crash fixes, worlds and servers.";
  const body = `    <section class="pg-hero"><div class="wrap">
      ${eaStrip}
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FireClient</a><span aria-hidden="true">/</span><span aria-current="page">Guides</span></nav>
      <h1>Minecraft guides for Windows, Fabric 1.21.1 and FireClient</h1>
      <p class="lede">${all.length} articles and ${tools.length} free tools, grouped by what you are trying to do. Looking for something specific? <a href="/blog/">Search the blog</a>.</p>
      <nav class="guide-jump" aria-label="Guide topics">${groups.map(g => `<a href="#${g.id}">${esc(g.h)}</a>`).join("")}<a href="#tools">Free tools</a></nav>
    </div></section>
    <section class="wrap guide-index">
${groups.map(g => `      <div class="panel guide-cluster" id="${g.id}"><h2>${esc(g.h)}</h2>${g.d ? `<p class="note">${esc(g.d)}</p>` : ""}<ul class="guide-list">${g.items.map(li).join("")}</ul></div>`).join("\n")}
      <div class="panel guide-cluster" id="tools"><h2>Free tools</h2><p class="note">Run in your browser. Nothing is uploaded.</p><ul class="guide-list">${tools.map(t => `<li><a href="${t.path}">${esc(t.name)}</a><span>${esc(t.blurb)}</span></li>`).join("")}</ul></div>
    </section>`;
  const items = [...new Set(groups.flatMap(g => g.items))];
  return shell({ title, desc, path, body, active: "blog", ld: [
    { "@type": "CollectionPage", "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en" },
    { "@type": "ItemList", itemListElement: items.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: SITE.url + postUrl(p), name: p.title })) },
    crumbs([["FireClient", "/"], ["Guides", path]])] });
}

function postPage(p, all) {
  const T = TYPES[p.type], path = postUrl(p), { html, toc } = md(p.body), d = descOf(p), u = SITE.url + path;
  const rel = all.filter(x => x.id !== p.id).map(x => ({ x, s: (x.tags || []).filter(t => (p.tags || []).includes(t)).length + (x.type === p.type ? .5 : 0) })).sort((a, b) => b.s - a.s || (b.x.date > a.x.date ? 1 : -1)).slice(0, 3).map(r => r.x);
  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}&url=${encodeURIComponent(u)}`;
  const body = `    <div class="read-bar" id="read-bar" aria-hidden="true"></div>
    <article class="wrap post">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FireClient</a><span aria-hidden="true">/</span><a href="/${T.dir}/">${T.label}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.title)}</span></nav>
      <header class="post-head">
        <p class="pmeta"><a href="/${T.dir}/"><b>${T.label}</b></a><time datetime="${p.date}">${fmt(p.date)}</time>${p.updated && p.updated !== p.date ? `<span>Updated <time datetime="${p.updated}">${fmt(p.updated)}</time></span>` : ""}<span>${readMins(p.body)} min read</span></p>
        <h1>${esc(p.title)}</h1>
        ${p.excerpt ? `<p class="post-dek">${esc(p.excerpt)}</p>` : ""}
      </header>
      ${p.cover ? `<figure class="post-cover">${pic(small(url(p.cover)), `src="${esc(small(url(p.cover)))}" alt="${esc(p.title)}"${dimAttr(small(url(p.cover)))} fetchpriority="high" decoding="async"`)}</figure>` : ""}
      <div class="post-grid">
        ${toc.length > 2 ? `<aside class="toc" aria-label="On this page"><b>On this page</b><ol>${toc.map(t => `<li><a href="#${t.id}">${inline(t.text)}</a></li>`).join("")}</ol></aside>` : `<span></span>`}
        <div class="prose">
${callouts(p)}${html}
          <footer class="post-foot">
            ${(p.tags || []).length ? `<p class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</p>` : ""}
            <p class="share"><button class="btn btn-ghost btn-sm" type="button" data-copy="${u}">Copy link</button><a class="btn btn-ghost btn-sm" href="${tweet}" target="_blank" rel="noopener noreferrer">Share on X</a><span>By ${esc(p.author || SITE.author)}</span></p>
            <p class="page-tools"><button class="btn btn-ghost btn-sm" type="button" data-print>Print this guide</button><a class="btn btn-ghost btn-sm" href="${SITE.github}/issues/new?title=${encodeURIComponent("Problem on page: " + p.title)}&body=${encodeURIComponent("Page: " + u + "\n\nWhat is wrong:\n\n(Please do not include tokens or personal details.)")}" target="_blank" rel="noopener noreferrer">Report a problem with this page</a></p>
          </footer>
        </div>
      </div>
      <aside class="panel cta"><div><h2>Try FireClient.</h2><p>A free Minecraft Java launcher and Fabric client for Windows. Needs your own Minecraft Java Edition account to play online.</p></div><a class="btn btn-primary btn-lg" href="/#download">Download FireClient</a></aside>
      ${rel.length ? `<section class="related" aria-labelledby="rel-t"><h2 id="rel-t">Keep reading</h2><div class="pgrid">\n${rel.map(x => "      " + card(x)).join("\n")}\n      </div></section>` : ""}
    </article>`;
  return shell({ title: titleOf(p), desc: d, path, image: p.cover, og: "article", active: p.type, body,
    extra: `<meta property="article:published_time" content="${p.date}"><meta property="article:modified_time" content="${p.updated || p.date}"><meta property="article:author" content="${esc(p.author || SITE.author)}">${(p.tags || []).map(t => `<meta property="article:tag" content="${esc(t)}">`).join("")}`,
    ld: [{ "@type": T.ld, "@id": u + "#article", mainEntityOfPage: { "@type": "WebPage", "@id": u }, headline: p.title.slice(0, 110), description: d, image: [...new Set([abs(p.cover || SITE.ogImage), abs(SITE.ogImage)])], datePublished: p.date, dateModified: p.updated || p.date,
      author: { "@type": "Person", name: p.author || SITE.author }, publisher, keywords: (p.tags || []).join(", "), wordCount: words(p.body), inLanguage: "en" },
      crumbs([["FireClient", "/"], [T.label, `/${T.dir}/`], [p.title, path]])] });
}

/* ---------- Whole site ---------- */
export function buildSite(posts) {
  const pub = (posts || []).filter(p => p.status === "published" && p.title && p.slug).sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
  const f = {};
  for (const t of Object.keys(TYPES)) f[`${TYPES[t].dir}/index.html`] = listPage(t, pub);
  for (const p of pub) f[`${TYPES[p.type].dir}/${p.slug}/index.html`] = postPage(p, pub);
  f["early-access/index.html"] = earlyAccessPage();
  f["download/index.html"] = downloadPage();
  f["press/index.html"] = pressPage();
  f["faq/index.html"] = faqPage();
  f["removal-requests/index.html"] = removalPage();
  f["tools/index.html"] = toolsHub();
  f["guides/index.html"] = guidesPage(pub);
  f["screenshots/index.html"] = shotsPage();
  for (const k of Object.keys(TOOLS)) f[`${TOOLS[k].path.slice(1)}index.html`] = toolPage(k);
  for (const L of Object.values(LOCALES)) f[`${L.code}/index.html`] = localPage(L);
  const alts = () => `<xhtml:link rel="alternate" hreflang="en" href="${SITE.url}/"/>` + Object.values(LOCALES).map(L => `<xhtml:link rel="alternate" hreflang="${HL(L)}" href="${SITE.url}/${L.code}/"/>`).join("") + `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}/"/>`;
  const img = (loc, t) => `<image:image><image:loc>${abs(loc)}</image:loc><image:title>${esc(t)}</image:title></image:image>`;
  const U = (loc, mod, freq, pr, extra = "") => `  <url><loc>${SITE.url}${loc}</loc><lastmod>${mod}</lastmod><changefreq>${freq}</changefreq><priority>${pr}</priority>${extra}</url>`;
  const newest = t => pub.filter(p => p.type === t).map(p => p.updated || p.date).filter(Boolean).sort().pop() || SITE.homeLastmod;
  f["sitemap.xml"] = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` + [
    U("/", SITE.changedLastmod, "weekly", "1.0", img("/assets/ingame-menu.jpg", "FireClient main menu") + img("/assets/ingame-hud.jpg", "FireClient in-game menu") + img("/assets/ingame-gameplay.jpg", "FireClient HUD in a world") + img("/assets/launcher-home.jpg", "FireClient launcher home") + img("/assets/launcher-mods.jpg", "FireClient mod manager") + alts()),
    U("/download/", SITE.changedLastmod, "weekly", "0.9"), U("/press/", SITE.staticLastmod, "monthly", "0.6"), U("/faq/", SITE.staticLastmod, "monthly", "0.8"), U("/removal-requests/", SITE.staticLastmod, "yearly", "0.3"), U("/tools/", SITE.homeLastmod, "monthly", "0.8"), ...Object.values(TOOLS).map(t => U(t.path, lm(t.path), "monthly", "0.8")), ...Object.values(LOCALES).map(L => U(`/${L.code}/`, SITE.changedLastmod, "monthly", "0.8", alts())), U("/early-access/", SITE.changedLastmod, "weekly", "0.9"), U("/screenshots/", SITE.changedLastmod, "monthly", "0.7", SHOTS.map(s => img(`/assets/${s.n}.jpg`, `FireClient ${s.t}`)).join("")), U("/guides/", pub.map(p => p.updated || p.date).filter(Boolean).sort().pop() || SITE.homeLastmod, "weekly", "0.8"), U("/blog/", newest("blog"), "weekly", "0.8"), U("/news/", newest("news"), "weekly", "0.8"),
    ...pub.map(p => U(postUrl(p), p.updated || p.date, "monthly", p.type === "news" ? "0.6" : "0.7", p.cover ? img(p.cover, p.title) : "")),
    U("/terms-and-privacy.html", "2026-10-22", "yearly", "0.3"),
    U("/license.html", SITE.changedLastmod, "monthly", "0.8")].join("\n") + "\n</urlset>\n";
  f["feed.xml"] = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n<channel>\n  <title>FireClient — blog and news</title><link>${SITE.url}/</link><description>Guides and release news for FireClient, the free Minecraft Java launcher and Fabric client.</description><language>en</language>\n  <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>\n` +
    pub.slice(0, 30).map(p => `  <item><title>${esc(p.title)}</title><link>${SITE.url}${postUrl(p)}</link><guid isPermaLink="true">${SITE.url}${postUrl(p)}</guid><pubDate>${rfc822(p.date)}</pubDate><description>${esc(descOf(p))}</description>${(p.tags || []).map(t => `<category>${esc(t)}</category>`).join("")}<content:encoded><![CDATA[${md(p.body).html.replace(/\]\]>/g, "]]&gt;").replace(/(src|href)="\//g, `$1="${SITE.url}/`)}]]></content:encoded></item>`).join("\n") + "\n</channel>\n</rss>\n";
  const pages = [["Download FireClient", "/download/", "Windows installer, requirements and how to check your download", ["download", "install", "windows"]], ["FAQ", "/faq/", "Short answers about FireClient with links to guides", ["faq", "questions"]], ["Screenshots", "/screenshots/", "Screenshots of the launcher and the in-game menu and HUD", ["screenshots", "images", "ui"]], ["Press kit", "/press/", "Facts, logos and screenshots for creators", ["press", "logo"]], ["Early access", "/early-access/", "What is built, what is planned and the November 2026 full version", ["roadmap", "beta"]], ["Terms and Privacy", "/terms-and-privacy.html", "What the launcher and website store and share", ["privacy", "terms", "legal"]], ["License and Safety", "/license.html", "Personal-use license, honest safety facts, how to check your download", ["license", "safety", "trust", "legal"]], ["Removal requests", "/removal-requests/", "DMCA notices, page removal, fake downloads and data questions", ["dmca", "removal", "copyright"]], ["Free Minecraft tools", "/tools/", "RAM calculator, settings, Java checker, crash analyzer and verifier", ["tools"]], ...Object.values(TOOLS).map(t => [t.name, t.path, t.blurb, ["tool", "free"]])].map(([title, url, excerpt, tags]) => ({ type: "page", title, url, date: SITE.homeLastmod, excerpt, tags }));
  f["content/search.json"] = JSON.stringify([...pub.map(p => ({ type: p.type, title: p.title, url: postUrl(p), date: p.date, excerpt: p.excerpt, tags: p.tags || [] })), ...pages]);
  return { files: f, published: pub };
}

/* Home page: swaps the block between the LATEST markers in index.html for the newest posts (real links crawlers can follow). */
export const HOME_RE = /<!--LATEST:START-->[\s\S]*?<!--LATEST:END-->/;
export function injectHome(html, pub) {
  const top = pub.slice(0, 3);
  const block = !top.length ? "<!--LATEST:START--><!--LATEST:END-->" : `<!--LATEST:START-->
    <section class="section" id="latest" aria-labelledby="latest-title">
      <div class="wrap">
        <header class="section-head"><h2 id="latest-title">Latest from FireClient.</h2><p class="lede">Guides, release news and tips for the launcher and the in-game client.</p></header>
        <div class="pgrid">
${top.map(p => "          " + card(p)).join("\n")}
        </div>
        <p class="more"><a class="btn btn-ghost btn-sm" href="/blog/">All blog posts</a><a class="btn btn-ghost btn-sm" href="/news/">All news</a></p>
        <p class="note">New here? Start with the <a href="/blog/install-fireclient-windows/">install guide</a>, the <a href="/blog/fireclient-hud-setup-guide/">HUD setup guide</a> and the <a href="/news/fireclient-1-0-beta-available/">FireClient 1.0 release notes</a>, or <a href="/guides/">browse every guide by topic</a>.</p>
      </div>
    </section>
    <!--LATEST:END-->`;
  const out = HOME_RE.test(html) ? html.replace(HOME_RE, () => block) : html;
  const o2 = RM_RE.test(out) ? out.replace(RM_RE, () => `<!--ROADMAP:START-->\n${roadmap()}\n    <!--ROADMAP:END-->`) : out;
  const o3 = HL_RE.test(o2) ? o2.replace(HL_RE, () => `<!--HREFLANG:START-->${hreflangs("/")}<!--HREFLANG:END-->`) : o2;
  return LANG_RE.test(o3) ? o3.replace(LANG_RE, () => `<!--LANG:START--><div class="wrap lang-wrap">${langPicker("en")}</div><!--LANG:END-->`) : o3;
}

/* ---------- Early access: roadmap block, strip and landing page ---------- */
export const RM_RE = /<!--ROADMAP:START-->[\s\S]*?<!--ROADMAP:END-->/;
const eaStrip = `<p class="ea-strip"><span class="dot" aria-hidden="true"></span><span>Early access is live. Full version planned for November 2026.</span> <a href="/early-access/">Details</a></p>`;
const eaDownload = `    <section class="section" id="ea-download" aria-labelledby="eadl-title"><div class="wrap">
      <header class="section-head"><h2 id="eadl-title">Download early access.</h2><p class="lede">Free Windows installer. You need your own Minecraft Java Edition account to play online.</p></header>
      <div class="panel dl-main">
        <div class="dl-actions"><a class="btn btn-primary btn-lg" id="ea-dl-button" href="${SITE.installer}" download rel="nofollow noopener" data-ea-download><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 17v3h14v-3"/></svg><span>Download early access for Windows</span></a><a class="btn btn-ghost btn-lg" href="${SITE.releases}" target="_blank" rel="noopener noreferrer">All releases</a></div>
        <p class="callout" role="note"><strong>Unsigned early access build.</strong> Windows SmartScreen may warn about it. Only install from this site or the official GitHub releases page, and compare the SHA-256 below when one is shown.</p>
        <p class="thanks" id="ea-thanks" hidden><b>Thanks for downloading FireClient.</b> Run the installer, then join the Discord if you need help.</p>
        <dl class="dl-facts" id="ea-facts">
          <div><dt>Version</dt><dd data-rel="version">Checking…</dd></div>
          <div><dt>File size</dt><dd data-rel="size">Checking…</dd></div>
          <div><dt>Released</dt><dd data-rel="date">Checking…</dd></div>
        </dl>
        <p class="note" id="ea-status" role="status">Checking the latest release on GitHub…</p>
        <noscript><p class="note">JavaScript is off, so the version, size and checksum cannot load here. Open the <a href="${SITE.releases}" rel="noopener">official releases page</a> to see them.</p></noscript>
        <div class="hash" id="ea-hash-box" hidden><span class="hash-k">SHA-256</span><code id="ea-sha">Checking…</code><button type="button" class="btn btn-ghost btn-sm" id="ea-copy" hidden>Copy</button></div>
        <p class="note hash-note" id="ea-hash-note">Checking…</p>
        <p class="note">If a checksum is shown, a match means the file is the one that was published. It does not prove the file is free of malware.</p>
        <p class="note"><a id="ea-report" class="link-strong" href="${SITE.releases}" hidden rel="nofollow noopener" target="_blank">Open this release's verification report</a> <button type="button" class="btn btn-ghost btn-sm" id="ea-retry" hidden>Try again</button></p>
        <p class="pc-check" data-pc hidden></p>
        <p class="note">Direct download: <a id="ea-direct" href="${SITE.installer}" rel="nofollow noopener">FireClient-Setup.exe</a> from GitHub Releases. Windows 10 or 11, 64-bit.</p>
      </div>
    </div></section>
    <script src="/release-core.js" defer></script><script src="/release-panel.js" defer></script>
`;
export function roadmap() {
  return `    <section class="section" id="roadmap" aria-labelledby="roadmap-title">
      <div class="wrap">
        <header class="section-head">
          <h2 id="roadmap-title">Early access now. Full version in November.</h2>
          <p class="lede">FireClient is in early access. The full version is planned for November 2026. We will announce the exact date here, in the Discord and in the RSS feed.</p>
        </header>
        <ol class="roadmap">
          <li class="rm rm-now"><span class="rm-tag">Live now</span><h3>Early access</h3><p>The launcher and the Fabric client for Minecraft 1.21.1: draggable HUD with 11 elements, 3 accent themes, Modrinth mod manager, worlds library, memory control and local skins.</p></li>
          <li class="rm rm-next"><span class="rm-tag">Planned</span><h3>Crosshair editor and cosmetics</h3><p>Not built yet. Follow progress in the Discord.</p></li>
          <li class="rm rm-full"><span class="rm-tag">November 2026</span><h3>Full version</h3><p>Planned for November 2026. Dates can move, so we will confirm the release day before it happens.</p></li>
        </ol>
        <p class="more"><a class="btn btn-primary btn-sm" href="/early-access/">Early access details</a><button class="btn btn-ghost btn-sm" type="button" data-ics>Add a November reminder</button><a class="btn btn-ghost btn-sm" href="${SITE.discord}" target="_blank" rel="noopener noreferrer">Join the Discord</a></p>
      </div>
    </section>`;
}


const shareRow = (path, title, label = "Share") => {
  const u = SITE.url + path, e = encodeURIComponent, a = (href, t) => `<a class="btn btn-ghost btn-sm" href="${href}" target="_blank" rel="noopener noreferrer">${t}</a>`;
  return `<div class="share-row" role="group" aria-label="${esc(label)}"><button class="btn btn-primary btn-sm" type="button" data-share data-url="${u}" data-title="${esc(title)}">${esc(label)}</button>` +
    a(`https://wa.me/?text=${e(title + " " + u)}`, "WhatsApp") + a(`https://t.me/share/url?url=${e(u)}&text=${e(title)}`, "Telegram") +
    a(`https://www.reddit.com/submit?url=${e(u)}&title=${e(title)}`, "Reddit") + a(`https://twitter.com/intent/tweet?url=${e(u)}&text=${e(title)}`, "X") +
    a(`https://www.facebook.com/sharer/sharer.php?u=${e(u)}`, "Facebook") + `</div>`;
};
const HL = L => L.hl || L.code;
const langPicker = (cur, label = "Language") => `<details class="lang-picker"><summary><span aria-hidden="true">🌐</span> ${esc(label)}</summary><ul>` +
  [`<li><a href="/" hreflang="en" lang="en" data-suggest="View this page in English?"${cur === "en" ? ' aria-current="true"' : ""}><span class="flag" aria-hidden="true">🇺🇸</span> English</a></li>`,
   ...Object.values(LOCALES).map(L => `<li><a href="/${L.code}/" hreflang="${HL(L)}" lang="${HL(L)}" data-suggest="${esc(L.suggest)}"${cur === HL(L) ? ' aria-current="true"' : ""}><span class="flag" aria-hidden="true">${L.flag}</span> ${esc(L.name)}</a></li>`)].join("") + `</ul></details>`;
export const HL_RE = /<!--HREFLANG:START-->[\s\S]*?<!--HREFLANG:END-->/, LANG_RE = /<!--LANG:START-->[\s\S]*?<!--LANG:END-->/;
const hreflangs = (path) => ["<link rel=\"alternate\" hreflang=\"en\" href=\"" + SITE.url + "/\">", ...Object.values(LOCALES).map(L => `<link rel="alternate" hreflang="${HL(L)}" href="${SITE.url}/${L.code}/">`), "<link rel=\"alternate\" hreflang=\"x-default\" href=\"" + SITE.url + "/\">"].join("");
function localPage(L) {
  const path = `/${L.code}/`, dl = SITE.installer;
  const li = a => a.map(x => `<li>${esc(x)}</li>`).join("");
  const faqAll = L.faq.concat(L.faq2 || []);
  const body = `    <section class="pg-hero ea-hero"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">${L.home}</a><span aria-hidden="true">/</span><span aria-current="page">${L.crumb}</span></nav>
      <h1>${esc(L.h1)}</h1>
      <p class="lede">${esc(L.lede)}</p>
    </div></section>
    <section class="section" id="ea-download" aria-labelledby="ldl-title"><div class="wrap">
      <header class="section-head"><h2 id="ldl-title">${esc(L.dlh)}</h2><p class="lede">${esc(L.dllede)}</p></header>
      <div class="panel dl-main">
        <div class="dl-actions"><a class="btn btn-primary btn-lg" href="${dl}" download rel="nofollow noopener" data-ea-download><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 17v3h14v-3"/></svg><span>${esc(L.btn)}</span></a></div>
        <p class="thanks" id="ea-thanks" hidden><b>${esc(L.thanks)}</b></p>
        <p class="note">${esc(L.direct)}</p>
        <p class="note"><strong>${esc(L.warn)}</strong></p>
      </div>
    </div></section>
    <section class="wrap"><div class="panel">${shareRow(path, L.title, L.share)}</div></section>
    <section class="wrap ea-cols">
      <div class="panel"><h2>${esc(L.fh)}</h2><ul class="ea-list">${li(L.feats)}</ul></div>
      <div class="panel"><h2>${esc(L.rh)}</h2><ul class="ea-list">${li(L.reqs)}</ul></div>
    </section>
    ${L.steps ? `<section class="wrap ea-cols">
      <div class="panel"><h2>${esc(L.ih)}</h2><ol class="ea-list ea-steps">${li(L.steps)}</ol></div>
      <div class="panel"><h2>${esc(L.sth)}</h2><ul class="ea-list">${li(L.stat)}</ul></div>
    </section>
    <section class="wrap ea-cols"><div class="panel"><h2>${esc(L.sfh)}</h2><ul class="ea-list">${L.safe.map(x => `<li>${esc(x).replace(/Get-FileHash FireClient-Setup\.exe -Algorithm SHA256/, "<code dir=\"ltr\">$&</code>")}</li>`).join("")}</ul></div></section>` : ""}
    <section class="wrap ea-cols"><div class="panel"><h2>${esc(L.gh)}</h2><ul class="ea-list">${L.guides.map(([u, t]) => `<li><a href="${u}" lang="en">${esc(t)}</a></li>`).join("")}</ul></div></section>
    <section class="section" aria-labelledby="lfaq-title"><div class="wrap ea-faq">
      <header class="section-head"><h2 id="lfaq-title">${esc(L.qh)}</h2></header>
      ${faqAll.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n      ")}
    </div></section>`;
  return shell({ title: L.title, desc: L.desc, path, body, active: "dl", lang: HL(L), locale: L.locale, dir: L.dir || "ltr", L, extra: hreflangs(path), ld: [
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: L.title, description: L.desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: HL(L), dateModified: lm(path) },
    { "@type": "SoftwareApplication", name: "FireClient", applicationCategory: "GameApplication", operatingSystem: "Windows 10, Windows 11", downloadUrl: dl, url: SITE.url + path, inLanguage: HL(L), offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": SITE.url + "/#org" } },
    { "@type": "FAQPage", inLanguage: HL(L), mainEntity: faqAll.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    crumbs([[L.home, "/"], [L.crumb, path]])] });
}

function downloadPage() {
  const path = "/download/", title = "Download FireClient — Free Minecraft Launcher for Windows",
    desc = "Download FireClient for Windows 10 and 11: a free Minecraft Java launcher with a Fabric 1.21.1 client, Modrinth mod manager and draggable HUD. Early access.";
  const faq = [
    ["Is FireClient free to download?", "Yes. The launcher and in-game client are free. You need your own Minecraft Java Edition account to play online."],
    ["Which Windows versions are supported?", "Windows 10 and Windows 11, 64-bit."],
    ["Does FireClient work on Bedrock, MCPE, Mac or Linux?", "No. It is for Minecraft Java Edition on Windows only."],
    ["Why does Windows show a warning?", "The early access installer is unsigned, so SmartScreen can show a prompt. Download only from this site or the official GitHub releases page and compare the SHA-256 if you want to be sure."],
    ["Which Minecraft version has the in-game client?", "Minecraft 1.21.1 on Fabric with Java 21. Other versions can be launched without the FireClient mod."]];
  const body = `    <section class="pg-hero ea-hero"><div class="wrap">
      ${eaStrip}
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FireClient</a><span aria-hidden="true">/</span><span aria-current="page">Download</span></nav>
      <h1>Download FireClient for Windows</h1>
      <p class="lede">A free Minecraft Java launcher with a Fabric 1.21.1 in-game client, a Modrinth mod manager and a draggable HUD. Early access for Windows 10 and 11 (64-bit).</p>
    </div></section>
${eaDownload.replace(/<header class="section-head">[\s\S]*?<\/header>/, "").replace('aria-labelledby="eadl-title"', 'aria-label="Download FireClient"').replace('class="section" id="ea-download"', 'class="section dl-first" id="ea-download"')}
<div class="wrap"><p class="note" id="os-note" role="status" hidden></p></div>
<div class="wrap"><div class="panel" id="pc-check" hidden><h2>Your PC</h2><p id="pc-text"></p><p><a href="/tools/minecraft-ram-calculator/">Work out a memory setting</a> or <a href="/tools/minecraft-settings-generator/">get starting video settings</a>.</p></div></div>
    <section class="wrap"><div class="panel"><h2>Check your download</h2><ul class="ea-list"><li>The download panel above shows the installer's SHA-256 when GitHub publishes one. In PowerShell run <code id="ps-cmd">Get-FileHash .\FireClient-Setup.exe -Algorithm SHA256</code> <button class="btn btn-ghost btn-sm" type="button" data-copy-target="#ps-cmd">Copy</button> and compare the result, or <a href="/tools/verify-download/">check the file in your browser</a>.</li><li>When a release has a verification report attached, the download panel above links to it. Read it yourself; a report is the maintainers' own record, not an independent certification.</li><li>FireClient is not yet a Windows Verified Publisher, so Windows may still show a warning even for the genuine file. Download only from this page or the <a href="${SITE.releases}" target="_blank" rel="noopener noreferrer">official releases</a>.</li></ul></div></section>
    <section class="wrap"><div class="panel">${shareRow(path, title)}</div></section>
    <section class="wrap ea-cols">
      <div class="panel"><h2>Before you install</h2><ul class="ea-list"><li>Windows 10 or 11, 64-bit</li><li>Your own Minecraft Java Edition account for online play</li><li>Download only from this page or the <a href="${SITE.releases}" target="_blank" rel="noopener noreferrer">official GitHub releases</a></li><li>Optional: compare the SHA-256 shown above with <code>Get-FileHash</code> in PowerShell</li></ul></div>
      <div class="panel"><h2>Next steps</h2><ul class="ea-list"><li><a href="/blog/install-fireclient-windows/">Install FireClient in five steps</a></li><li><a href="/blog/is-fireclient-safe/">Is FireClient safe? Check your download</a></li><li><a href="/blog/fireclient-hud-setup-guide/">Set up the HUD</a></li><li><a href="/news/fireclient-1-0-beta-available/">FireClient 1.0 release notes</a></li><li><a href="/blog/boost-fps-minecraft-1-21-1-fabric/">Boost your FPS</a></li><li><a href="/early-access/">Early access details and roadmap</a></li></ul></div>
    </section>
    <section class="section" aria-labelledby="dlfaq-title"><div class="wrap ea-faq">
      <header class="section-head"><h2 id="dlfaq-title">Download questions.</h2></header>
      ${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n      ")}
    </div></section>`;
  return shell({ title, desc, path, body, active: "dl", extra: '<script src="/os-check.js" defer></script>', ld: [
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en", dateModified: lm(path) },
    { "@type": "SoftwareApplication", name: "FireClient", applicationCategory: "GameApplication", operatingSystem: "Windows 10, Windows 11", downloadUrl: SITE.installer, url: SITE.url + path, image: SITE.url + SITE.ogImage, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": SITE.url + "/#org" } },
    { "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    crumbs([["FireClient", "/"], ["Download", path]])] });
}
function pressPage() {
  const path = "/press/", title = "FireClient Press Kit — Facts, Logos and Screenshots for Creators",
    desc = "Press kit and creator resources for FireClient, a free Minecraft Java launcher and Fabric client for Windows: accurate facts, a copy-paste description, logos and screenshots.";
  const short = "FireClient is a free Minecraft Java launcher and Fabric client for Windows 10 and 11. It has a draggable HUD, a Modrinth mod manager and a worlds library. Download: " + SITE.url + "/download/";
  const long = "FireClient is a free Minecraft Java Edition launcher for Windows 10 and 11, with a Fabric in-game client for Minecraft 1.21.1 (Java 21). It includes a draggable HUD with 11 elements and 3 accent themes, a menu on Right Shift, a Modrinth mod manager, a worlds library, a memory setting, local skins and Paper server hosting. Early access is live; the full version is planned for November 2026 with no exact date. You need your own Minecraft Java Edition account to play online. The early access installer is unsigned, so Windows may show a warning. Download only from " + SITE.url + "/download/ or the official GitHub releases page. FireClient is not affiliated with Mojang or Microsoft.";
  const link = `<a href="${SITE.url}/">FireClient — free Minecraft launcher for Windows</a>`;
  const md = `[FireClient — free Minecraft launcher for Windows](${SITE.url}/)`;
  const facts = [["Name", "FireClient"], ["What it is", "Free Minecraft Java Edition launcher plus a Fabric in-game client"], ["Platform", "Windows 10 and 11, 64-bit. Not for Bedrock, MCPE, phones, consoles, macOS or Linux"], ["In-game client", "Minecraft 1.21.1 on Fabric with Java 21"], ["Price", "Free. A Minecraft Java Edition account is needed for online play"], ["Status", "Early access v1.0. Full version planned for November 2026, no exact date"], ["Not yet built", "Crosshair editor and cosmetics (planned)"], ["Website", SITE.url + "/"], ["Download", SITE.url + "/download/"], ["GitHub", SITE.github], ["Releases", SITE.releases], ["Discord", SITE.discord]];
  const assets = [["/logo.png", "Logo (PNG)"], ["/assets/logo.svg", "Logo (SVG)"], ["/assets/ingame-menu.jpg", "Screenshot: main menu"], ["/assets/ingame-hud.jpg", "Screenshot: in-game menu"], ["/assets/ingame-gameplay.jpg", "Screenshot: HUD in a world"], ["/assets/launcher-home.jpg", "Screenshot: launcher home"], ["/assets/launcher-mods.jpg", "Screenshot: mod manager"], ["/assets/launcher-versions.jpg", "Screenshot: versions"], ["/assets/launcher-worlds.jpg", "Screenshot: worlds"]];
  const box = (id, label, text) => `<div class="panel"><h3>${esc(label)}</h3><textarea class="press-box" id="${id}" readonly rows="${text.length > 300 ? 8 : 3}">${esc(text)}</textarea><p><button class="btn btn-primary btn-sm" type="button" data-copy-target="#${id}">Copy</button></p></div>`;
  const body = `    <section class="pg-hero ea-hero"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FireClient</a><span aria-hidden="true">/</span><span aria-current="page">Press kit</span></nav>
      <h1>FireClient press kit and creator resources</h1>
      <p class="lede">Accurate facts, ready-to-use descriptions, logos and screenshots for videos, articles and server pages. Please keep claims in line with the facts below.</p>
    </div></section>
    <section class="wrap"><div class="panel"><h2>Quick facts</h2><dl class="press-facts">${facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${/^https?:/.test(v) ? `<a href="${esc(v)}">${esc(v)}</a>` : esc(v)}</dd>`).join("")}</dl></div></section>
    <section class="wrap ea-cols">${box("press-short", "Short description", short)}${box("press-long", "Full description", long)}</section>
    <section class="wrap ea-cols">${box("press-html", "Link (HTML)", link)}${box("press-md", "Link (Markdown)", md)}</section>
    <section class="wrap ea-cols">
      <div class="panel"><h2>Logos and screenshots</h2><ul class="ea-list">${assets.map(([u, t]) => `<li><a href="${u}" download>${esc(t)}</a></li>`).join("")}</ul></div>
      <div class="panel"><h2>Please keep it accurate</h2><ul class="ea-list"><li>Say it is early access and Windows only</li><li>Mention that the installer is unsigned, so Windows may show a warning</li><li>Link the official download page, not mirrors</li><li>Do not say it is affiliated with Mojang or Microsoft</li><li>Disclose sponsored content as the rules where you publish require</li></ul></div>
    </section>
    <section class="wrap"><div class="panel"><h2>Share FireClient</h2>${shareRow("/", "FireClient — Free Minecraft Launcher & 1.21.1 Fabric Client")}</div></section>`;
  return shell({ title, desc, path, body, ld: [
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en", dateModified: lm(path) },
    crumbs([["FireClient", "/"], ["Press kit", path]])] });
}

function removalPage() {
  const path = "/removal-requests/", title = "Removal Requests: Copyright, Content, Fake Downloads",
    desc = "How to send a copyright (DMCA) notice, ask for a FireClient page to be removed or corrected, report a fake download, or ask about your data.";
  const contact = `<p><a class="btn btn-primary btn-sm" href="${SITE.discord}" target="_blank" rel="noopener noreferrer">FireClient Discord</a> <a class="btn btn-ghost btn-sm" href="${SITE.github}/issues/new" target="_blank" rel="noopener noreferrer">GitHub issue</a></p>`;
  const body = `    <section class="pg-hero ea-hero"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FireClient</a><span aria-hidden="true">/</span><span aria-current="page">Removal requests</span></nav>
      <h1>Removal requests</h1>
      <p class="lede">Use this page to report copyright problems, ask for a page to be removed or corrected, report a fake download, or ask about your data.</p>
    </div></section>
    <section class="wrap"><div class="panel"><h2>How to contact us</h2>
      <p>Message a server owner in the FireClient Discord, or open a GitHub issue that only asks for a private way to send your notice. <strong>Do not post personal details, access tokens or private documents in public.</strong></p>${contact}</div></section>
    <section class="wrap ea-cols">
      <div class="panel"><h2>Copyright (DMCA) notice</h2><p>If you believe something on fireclient.net or in a FireClient release infringes your copyright, send us:</p><ul class="ea-list"><li>What the copyrighted work is</li><li>The exact page address or file you object to</li><li>Your name and a way to reach you</li><li>A statement that you believe in good faith the use is not authorized by the owner, its agent or the law</li><li>A statement that the information is accurate and, under penalty of perjury, that you are the owner or authorized to act for the owner</li><li>Your signature (a typed name is fine)</li></ul><p>We review notices and may remove or disable the material while we do. If you think material was removed by mistake, you can send a counter-notice with your contact details and a statement explaining why.</p></div>
      <div class="panel"><h2>Remove or correct a page</h2><p>If a page names you, states something that is not true, or you want it taken down, send the page address, what is wrong and how you would like it changed.</p><h2>Report a fake or harmful download</h2><p>The genuine installer is only linked from the <a href="/download/">download page</a> and the <a href="${SITE.releases}" target="_blank" rel="noopener noreferrer">official releases</a>. If you find an installer, video or site that pretends to be FireClient, send us the link so we can report it to the host.</p></div>
    </section>
    <section class="wrap ea-cols">
      <div class="panel"><h2>Your data</h2><ul class="ea-list"><li><strong>This website:</strong> it has no accounts. Items saved in your browser (language choice, ad notice choice, release cache) can be cleared in your browser settings.</li><li><strong>The launcher:</strong> data stays in the .fireclient folder in your Windows user folder. Uninstalling leaves that folder, and you can delete it yourself in File Explorer.</li><li><strong>Community features:</strong> if you used the optional community account features, that data is held by that service. Contact it under its own policy.</li></ul><p>Details are in the <a href="/terms-and-privacy.html">Terms and Privacy notice</a>.</p></div>
      <div class="panel"><h2>Search engines</h2><p>Removing a page from this site does not remove it from Google or Bing at once. They update their results when they next visit. You can also use their own removal tools to hide an outdated result sooner.</p></div>
    </section>`;
  return shell({ title, desc, path, body, ld: [
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en", dateModified: lm(path) },
    crumbs([["FireClient", "/"], ["Removal requests", path]])] });
}

const TOOLS = {
  ram: { path: "/tools/minecraft-ram-calculator/", name: "Minecraft RAM calculator", blurb: "Get a memory setting for your PC and mod count." },
  settings: { path: "/tools/minecraft-settings-generator/", name: "Minecraft video settings generator", blurb: "Starting render distance, particles and more for your PC." },
  java: { path: "/tools/minecraft-java-version-checker/", name: "Java version checker", blurb: "Paste java -version to see if you have Java 21." },
  crash: { path: "/tools/minecraft-crash-report-analyzer/", name: "Crash report analyzer", blurb: "Paste a crash report to find the likely cause." },
  verify: { path: "/tools/verify-download/", name: "Download verifier", blurb: "Check a file's SHA-256 in your browser." } };
const CALLOUTS = { "minecraft-ram-allocation-guide": ["ram"], "boost-fps-minecraft-1-21-1-fabric": ["ram", "settings"], "best-minecraft-pvp-settings-1-21-1": ["settings"], "fix-minecraft-crash-fabric-1-21-1": ["crash", "java"], "install-java-21-for-minecraft-1-21-1": ["java"], "is-fireclient-safe": ["verify"], "install-fireclient-windows": ["verify"], "minecraft-launcher-not-opening-windows": ["verify"], "run-minecraft-smoothly-on-a-laptop": ["ram", "settings"], "switch-or-downgrade-minecraft-versions-safely": ["java"] };
const callouts = p => { const k = CALLOUTS[p.slug]; return k ? `<aside class="tool-callout"><b>Free tool${k.length > 1 ? "s" : ""}:</b> ${k.map(x => `<a href="${TOOLS[x].path}">${esc(TOOLS[x].name)}</a> (${esc(TOOLS[x].blurb.replace(/\.$/, "").toLowerCase())})`).join(" and ")}.</aside>\n` : ""; };
const G = { java: ["/blog/install-java-21-for-minecraft-1-21-1/", "Install Java 21"], ram: ["/blog/minecraft-ram-allocation-guide/", "RAM guide"], fps: ["/blog/boost-fps-minecraft-1-21-1-fabric/", "FPS guide"], crash: ["/blog/fix-minecraft-crash-fabric-1-21-1/", "Crash checklist"], pvp: ["/blog/best-minecraft-pvp-settings-1-21-1/", "PvP settings guide"], safe: ["/blog/is-fireclient-safe/", "Is FireClient safe?"], mods: ["/blog/install-fabric-mods-modrinth-minecraft-1-21-1/", "Install Fabric mods"], inst: ["/blog/install-fireclient-windows/", "Install FireClient"] };
const TOOL_PAGES = {
  ram: { title: "Minecraft RAM Calculator: How Much Memory to Allocate", desc: "Free Minecraft RAM calculator: pick your PC memory and mod count to get a safe memory setting and Java argument for Java Edition 1.21.1. Runs in your browser.",
    h1: "Minecraft RAM calculator", lede: "Pick your PC's memory and what you run, and get a memory setting that leaves room for Windows.",
    inner: `<div class="panel tool" data-tool="ram"><div class="tool-grid"><label>Total RAM in your PC<select id="ram-total">${[4, 8, 12, 16, 24, 32, 64].map(n => `<option value="${n}"${n === 16 ? " selected" : ""}>${n} GB</option>`).join("")}</select></label><label>What do you run?<select id="ram-setup"><option value="2.5">Vanilla or a few mods (under 20)</option><option value="4" selected>Fabric with performance mods (20 to 60)</option><option value="6">Large mod list (60 to 150)</option><option value="8">Very large modpack (150 or more)</option></select></label></div><p><label class="chk"><input type="checkbox" id="ram-shaders"> I use shaders (adds 1 GB)</label><label class="chk"><input type="checkbox" id="ram-server"> I host a server on this PC (adds 2 GB)</label></p><div class="result" id="ram-out" aria-live="polite"></div><noscript><p>This tool needs JavaScript.</p></noscript></div>`,
    how: "This calculator uses common rules of thumb: about 2 to 3 GB for vanilla or a few mods, around 4 GB for Fabric with performance mods, 6 GB for large mod lists and 8 GB for very large modpacks. It adds 1 GB for shaders and 2 GB if you host a server on the same PC, then keeps the result at or below half of your total RAM so Windows and other programs have room. Treat the number as a starting point. Watch your frame rate, and if the game stutters or reports out-of-memory errors, change it in small steps.",
    faq: [["Does more RAM make Minecraft faster?", "Not always. Too little memory causes stutters and crashes, but giving the game far more than it needs leaves less for Windows and can make pauses longer."], ["Where do I set the memory?", "In your launcher's memory setting. FireClient has a memory setting for Java, and the RAM guide shows where to find it."], ["What does -Xmx mean?", "It is the Java argument that sets the maximum memory the game can use. -Xmx4G means 4 GB."]], rel: [G.ram, G.fps, G.crash] },
  settings: { title: "Minecraft Video Settings Generator for FPS (1.21.1)", desc: "Pick your PC level and goal to get starting Minecraft 1.21.1 video settings: render distance, simulation distance, graphics, particles and more. Free, in your browser.",
    h1: "Minecraft video settings generator", lede: "Choose how strong your PC is and what you care about, and get settings to start from.",
    inner: `<div class="panel tool" data-tool="settings"><div class="tool-grid"><label>My PC is<select id="set-level"><option value="low">Low-end (old laptop, integrated graphics)</option><option value="mid" selected>Mid-range</option><option value="high">High-end</option></select></label><label>I care most about<select id="set-goal"><option value="fps">Maximum FPS</option><option value="balanced" selected>Balance</option><option value="looks">How it looks</option></select></label></div><div class="result" id="set-out" aria-live="polite"></div><noscript><p>This tool needs JavaScript.</p></noscript></div>`,
    how: "These values are starting points for Minecraft Java Edition 1.21.1, based on the settings that have the biggest effect on frame rate: render distance, simulation distance, graphics mode, particles and entity distance. Low-end PCs get shorter distances and simpler graphics, high-end PCs get longer distances and fancier visuals. Every PC is different, so turn on an FPS counter, change one setting at a time and keep what works.",
    faq: [["Which setting helps FPS the most?", "Render distance usually has the biggest effect, followed by simulation distance, graphics mode and particles."], ["Do performance mods help?", "Fabric performance mods from Modrinth can help a lot. Check that each one lists Minecraft 1.21.1 and Fabric."], ["Should I turn VSync on?", "Leave it off for the lowest input delay and turn it on only if you see screen tearing."]], rel: [G.fps, G.pvp, G.ram] },
  java: { title: "Minecraft Java Version Checker: Do You Have Java 21?", desc: "Paste your java -version output to see if you have the right Java for Minecraft 1.21.1, whether it is 64-bit, and what to do next. Runs in your browser.",
    h1: "Java version checker", lede: "Minecraft 1.21.1 needs Java 21. Paste what Command Prompt prints and see if you are ready.",
    inner: `<div class="panel tool" data-tool="java"><p>Open Command Prompt (press the Windows key, type <code>cmd</code>), run <code>java -version</code> and paste everything it prints.</p><label>Output<textarea id="java-in" rows="5" placeholder='openjdk version "21.0.4" 2024-07-16 LTS'></textarea></label><p><button class="btn btn-primary btn-sm" type="button" id="java-go">Check</button></p><div class="result" id="java-out" aria-live="polite"></div><noscript><p>This tool needs JavaScript.</p></noscript></div>`,
    how: "The checker reads the version number at the top of the java -version output. Version 21 is what Minecraft 1.21.1 targets. Older versions such as 8, 11 or 17 can stop the game from starting, and a newer version usually works but is not what the game is built for. It also looks for 64-bit, because a 32-bit Java cannot give the game enough memory. If the check says to install Java 21, the Java 21 guide shows how.",
    faq: [["Why does Minecraft need Java 21?", "Minecraft 1.21.1 is built for Java 21. Older Java versions cannot run its code."], ["I installed Java 21 but it still shows an old version.", "Another Java earlier in your PATH may be answering. Uninstall the old one, reopen Command Prompt and check again."], ["Is anything uploaded?", "No. The text you paste is read in your browser and never leaves your computer."]], rel: [G.java, G.crash, G.inst] },
  crash: { title: "Minecraft Crash Report Analyzer: Find the Likely Cause", desc: "Paste a Minecraft crash report or log to spot the likely cause: Java version, memory, missing mod dependencies, mixin conflicts and drivers. Nothing is uploaded.",
    h1: "Minecraft crash report analyzer", lede: "Paste a crash report or log and see the most likely causes, with links to the right fix.",
    inner: `<div class="panel tool" data-tool="crash"><label>Crash report or log<textarea id="crash-in" rows="10" placeholder="Paste the contents of a file from the crash-reports folder"></textarea></label><p><button class="btn btn-primary btn-sm" type="button" id="crash-go">Analyze</button> <button class="btn btn-ghost btn-sm" type="button" id="crash-clear">Clear</button></p><p class="note">Nothing is uploaded. Remove your Windows user name and any account details from text before you share it anywhere else.</p><div class="result" id="crash-out" aria-live="polite"></div><noscript><p>This tool needs JavaScript.</p></noscript></div>`,
    how: "The analyzer looks for patterns that cause most Fabric crashes: a Java version that is too old, running out of memory, a mod that needs another mod, mixin errors from conflicting or mismatched mods, graphics driver errors, network failures and download problems. It also pulls out the Minecraft and Java versions, the crash description and the first and last Caused by lines. It cannot read your mind, so use it as a pointer, then confirm with the crash checklist. In the standard setup crash reports are in the crash-reports folder inside your game folder.",
    faq: [["Where do I find the crash report?", "In the crash-reports folder inside your game folder. The newest file has the latest crash."], ["Is my crash report uploaded?", "No. It is analyzed in your browser and never leaves your computer."], ["It found nothing. What now?", "Work through the crash checklist, test with no mods, or ask in the Discord and share only the relevant lines."]], rel: [G.crash, G.java, G.mods] },
  verify: { title: "Verify a Download: SHA-256 File Checker in Your Browser", desc: "Check a downloaded file's SHA-256 against the published hash without uploading it. Works with the FireClient installer and any other file.",
    h1: "Verify a download", lede: "Pick a file, paste the published SHA-256 and see if they match. The file never leaves your computer.",
    inner: `<div class="panel tool" data-tool="verify"><label>File<input type="file" id="v-file"></label><div class="v-progress-row"><progress id="v-progress" max="1" value="0" hidden aria-label="Hashing progress"></progress><button class="btn btn-ghost btn-sm" type="button" id="v-cancel" hidden>Cancel</button></div><label>Published SHA-256<input type="text" id="v-hash" autocomplete="off" spellcheck="false" placeholder="Paste the SHA-256 from the release page"></label><p><button class="btn btn-ghost btn-sm" type="button" id="v-fill">Fill with the latest FireClient release hash</button></p><p class="note" id="v-note" aria-live="polite"></p><div class="result" id="v-out" aria-live="polite"></div><noscript><p>This tool needs JavaScript. You can use Get-FileHash in PowerShell instead.</p></noscript></div><script src="/release-core.js" defer></script><script src="/hash-core.js" defer></script>`,
    how: "A SHA-256 hash is a fingerprint of a file. This page calculates the fingerprint of the file you choose in your browser, in pieces so large files work and you can cancel, and compares it with the one you paste. If they match, your copy is identical to the file the hash was published for, so it was not changed after publishing. A match does not prove a file is free of malware, and it is only as trustworthy as the source of the hash, so download only from official sources. The button looks up the SHA-256 that GitHub lists for the latest FireClient release, when one is published.",
    faq: [["Is my file uploaded?", "No. The hash is calculated in your browser and the file is never uploaded. The only request the page makes is the optional lookup of the latest release hash from this site or GitHub."], ["Can I do this without the website?", "Yes. In PowerShell run Get-FileHash .\\FireClient-Setup.exe -Algorithm SHA256 and compare the result."], ["The hashes do not match. What now?", "Do not run the file. Delete it and download again from the official download page."]], rel: [G.safe, G.inst, G.crash] }
};
function toolPage(key) {
  const T = TOOL_PAGES[key], path = TOOLS[key].path;
  const body = `    <section class="pg-hero ea-hero"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FireClient</a><span aria-hidden="true">/</span><a href="/tools/">Tools</a><span aria-hidden="true">/</span><span aria-current="page">${esc(TOOLS[key].name)}</span></nav>
      <h1>${esc(T.h1)}</h1><p class="lede">${esc(T.lede)}</p>
    </div></section>
    <section class="wrap">${T.inner}</section>
    <section class="wrap"><div class="panel"><h2>How it works</h2><p>${esc(T.how)}</p></div></section>
    <section class="section"><div class="wrap ea-faq"><header class="section-head"><h2>Questions</h2></header>
      ${T.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n      ")}
    </div></section>
    <section class="wrap"><div class="panel"><h2>Related guides and tools</h2><ul class="ea-list">${T.rel.map(([u, t]) => `<li><a href="${u}">${esc(t)}</a></li>`).join("")}<li><a href="/tools/">All free tools</a></li></ul></div></section>`;
  return shell({ title: T.title, desc: T.desc, path, body, extra: '<script src="/tools.js" defer></script>', ld: [
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: T.title, description: T.desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en", dateModified: lm(path) },
    { "@type": "WebApplication", name: TOOLS[key].name, url: SITE.url + path, applicationCategory: "UtilitiesApplication", operatingSystem: "Any (web browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": SITE.url + "/#org" } },
    { "@type": "FAQPage", mainEntity: T.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    crumbs([["FireClient", "/"], ["Tools", "/tools/"], [TOOLS[key].name, path]])] });
}
const HELP = [["install", "Install or download FireClient", [["/download/", "Download page"], G.inst, G.safe, [TOOLS.verify.path, "Verify your download"]]], ["crash", "Minecraft crashes or will not start", [G.crash, G.java, [TOOLS.crash.path, "Crash report analyzer"], [TOOLS.java.path, "Java version checker"]]], ["fps", "Low FPS or lag", [G.fps, [TOOLS.ram.path, "RAM calculator"], [TOOLS.settings.path, "Video settings generator"], G.pvp]], ["mods", "Mods", [G.mods, ["/blog/how-to-find-safe-minecraft-mods/", "Find safe mods"], ["/blog/what-is-a-minecraft-client-fabric-explained/", "What is a Minecraft client?"]]], ["account", "Sign-in problems", [["/blog/fix-minecraft-microsoft-sign-in-error/", "Fix Microsoft sign-in errors"]]], ["server", "Servers and connecting", [["/blog/fix-minecraft-connection-timed-out/", "Fix connection timed out"], ["/blog/host-minecraft-paper-server-windows/", "Host a Paper server"]]], ["launcher", "The launcher will not open", [["/blog/minecraft-launcher-not-opening-windows/", "Launcher not opening fixes"], [TOOLS.verify.path, "Verify your download"]]], ["edition", "Java, Bedrock or my device", [["/blog/minecraft-java-vs-bedrock-which-edition/", "Java vs Bedrock"], ["/blog/fireclient-minecraft-bedrock-mcpe/", "Bedrock, MCPE and mobile"], ["/faq/", "FAQ"]]], ["worlds", "Back up or restore worlds", [["/blog/backup-minecraft-worlds-windows/", "Back up your worlds"]]]];
function toolsHub() {
  const path = "/tools/", title = "Free Minecraft Tools: RAM, Settings, Java, Crash Reports", desc = "Free tools for Minecraft Java Edition 1.21.1: RAM calculator, video settings generator, Java version checker, crash report analyzer and download verifier.";
  const body = `    <section class="pg-hero ea-hero"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FireClient</a><span aria-hidden="true">/</span><span aria-current="page">Tools</span></nav>
      <h1>Free Minecraft tools</h1><p class="lede">Small tools that run in your browser and upload nothing. Made for Minecraft Java Edition 1.21.1 on Windows.</p>
    </div></section>
    <section class="wrap"><div class="tool-cards">${Object.values(TOOLS).map(t => `<a href="${t.path}"><b>${esc(t.name)}</b><span>${esc(t.blurb)}</span></a>`).join("")}</div></section>
    <section class="wrap"><div class="panel"><h2>What do you need help with?</h2>
      <label class="chk" for="help-pick" style="display:block">Pick a problem <select id="help-pick" hidden><option value="all">Show everything</option>${HELP.map(([id, t]) => `<option value="${id}">${esc(t)}</option>`).join("")}</select></label>
      ${HELP.map(([id, t, ls]) => `<div class="help-group" data-help="${id}"><h3>${esc(t)}</h3><ul>${ls.map(([u, n]) => `<li><a href="${u}">${esc(n)}</a></li>`).join("")}</ul></div>`).join("\n      ")}
    </div></section>`;
  return shell({ title, desc, path, body, extra: '<script src="/tools.js" defer></script>', ld: [
    { "@type": "CollectionPage", "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en", dateModified: lm(path) },
    { "@type": "ItemList", itemListElement: Object.values(TOOLS).map((t, i) => ({ "@type": "ListItem", position: i + 1, url: SITE.url + t.path, name: t.name })) },
    crumbs([["FireClient", "/"], ["Tools", path]])] });
}

function faqPage() {
  const path = "/faq/", title = "FireClient FAQ — Answers About the Free Minecraft Launcher",
    desc = "Answers about FireClient: is it free and safe, supported Windows and Minecraft versions, Java 21, mods, HUD, RAM and the November 2026 full version.";
  const items = [
    ["What is FireClient?", "FireClient is a free Minecraft Java Edition launcher for Windows 10 and 11, with a Fabric in-game client for Minecraft 1.21.1. It adds a draggable HUD, a Modrinth mod manager and a worlds library.", "/download/", "Download page"],
    ["Is FireClient free?", "Yes. The launcher and the in-game client are free. You need your own Minecraft Java Edition account to play online.", "/download/", "Download FireClient"],
    ["Is this the same as the FireClient SMP mod on Modrinth?", "No. FireClient on fireclient.net is a free Windows launcher with a Fabric in-game client for Minecraft Java Edition. A utility mod with a similar name for SMP servers exists on Modrinth; it is a separate project and is not affiliated with this site.", "/download/", "Download FireClient for Windows"],
    ["Is FireClient safe to download?", "Download it only from fireclient.net or the official GitHub releases page, and compare the SHA-256 shown on the download page with your file. The early access installer is unsigned, so Windows may show a warning.", "/blog/is-fireclient-safe/", "How to check your download"],
    ["Does FireClient work on Bedrock, MCPE, phones or consoles?", "No. FireClient is for Minecraft Java Edition on Windows only.", "/blog/fireclient-minecraft-bedrock-mcpe/", "Bedrock and MCPE explained"],
    ["Does it run on Mac or Linux?", "Not yet. The launcher is Windows 10 and 11 (64-bit) only for now.", "/early-access/", "Early access details"],
    ["Which Minecraft version does the in-game client support?", "Minecraft 1.21.1 on Fabric with Java 21. Other versions can be launched without the FireClient mod.", "/blog/install-java-21-for-minecraft-1-21-1/", "Install Java 21"],
    ["Can I use mods with FireClient?", "Yes. The launcher has a mod manager with Modrinth browsing, your own jar files and curated packs for Performance, Visuals, Utility and PvP.", "/blog/install-fabric-mods-modrinth-minecraft-1-21-1/", "Install Fabric mods"],
    ["How do I open the FireClient menu?", "Press Right Shift in game.", "/blog/fireclient-hud-setup-guide/", "HUD setup guide"],
    ["Can I move the HUD elements?", "Yes. The HUD has 11 elements that you drag where you want them, and 3 accent themes.", "/blog/fireclient-hud-setup-guide/", "HUD setup guide"],
    ["How much RAM should I give Minecraft?", "Around 4 GB is a comfortable start for Fabric with performance mods. More is not always faster.", "/blog/minecraft-ram-allocation-guide/", "RAM guide"],
    ["Why does Windows show a warning when I install?", "The early access installer is unsigned, so SmartScreen can show a prompt for an app it does not recognise. Verify the file before you run it.", "/blog/minecraft-launcher-not-opening-windows/", "Launcher not opening fixes"],
    ["Minecraft crashes on launch. What should I do?", "Check that you use Java 21, remove the last mod you added, make sure every mod matches 1.21.1 and Fabric, and read the crash report.", "/blog/fix-minecraft-crash-fabric-1-21-1/", "Crash checklist"],
    ["Is FireClient affiliated with Mojang or Microsoft?", "No. FireClient is an independent project and is not affiliated with Mojang or Microsoft.", "/press/", "Press kit and facts"],
    ["When is the full version coming?", "The full version is planned for November 2026. No exact date has been announced.", "/early-access/", "Roadmap"],
    ["Does it have a crosshair editor or cosmetics?", "Not yet. A crosshair editor and cosmetics are planned but not built.", "/early-access/", "Roadmap"],
    ["How do I get help or report a bug?", "Ask in the FireClient Discord. Never post access tokens, account files or unredacted logs.", "/download/", "Download page"]];
  const body = `    <section class="pg-hero ea-hero"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FireClient</a><span aria-hidden="true">/</span><span aria-current="page">FAQ</span></nav>
      <h1>FireClient FAQ</h1>
      <p class="lede">Short answers about the free Minecraft Java launcher and Fabric client. Each answer links to a longer guide.</p>
    </div></section>
    <section class="section"><div class="wrap ea-faq">
      <div class="faq-tools" hidden><input type="search" id="faq-filter" placeholder="Search the FAQ" aria-label="Search the FAQ"><button class="btn btn-ghost btn-sm" type="button" data-faq-all="open">Expand all</button><button class="btn btn-ghost btn-sm" type="button" data-faq-all="close">Collapse all</button><span id="faq-count" aria-live="polite"></span></div>
      ${items.map(([q, a, u, t]) => `<details><summary>${esc(q)}</summary><p>${esc(a)} <a href="${u}">${esc(t)}</a></p></details>`).join("\n      ")}
    </div></section>`;
  return shell({ title, desc, path, body, ld: [
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en", dateModified: lm(path) },
    { "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    crumbs([["FireClient", "/"], ["FAQ", path]])] });
}

function earlyAccessPage() {
  const path = "/early-access/", title = "FireClient Early Access and November 2026 Full Version",
    desc = "FireClient early access is live for Windows. See what works today, known issues and the plan for the full version, planned for November 2026.";
  const li = a => a.map(x => `<li>${x}</li>`).join("");
  const faq = [
    ["Is early access free?", "Yes. The launcher and the in-game client are free to download and use. You need your own Minecraft Java Edition account to play online."],
    ["When is the full version?", "It is planned for November 2026. There is no exact release day yet, and plans can change. The date will be announced on this site, in the Discord and in the RSS feed."],
    ["Which Minecraft version does the in-game client support?", "Minecraft 1.21.1 on Fabric with Java 21. The launcher can start other versions, but they run without the FireClient mod."],
    ["Will updates delete my worlds?", "No. The installer and uninstaller leave your game-data folder in place, including worlds and resource packs. Back up important worlds anyway."],
    ["Where do I report a bug?", "In the Discord or as a GitHub issue. Please never post access tokens, account files or unredacted logs in public."]];
  const body = `    <section class="pg-hero ea-hero"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FireClient</a><span aria-hidden="true">/</span><span aria-current="page">Early access</span></nav>
      <p class="pill"><span class="dot" aria-hidden="true"></span>Early access · Full version planned for November 2026</p>
      <h1>FireClient early access</h1>
      <p class="lede">A free Minecraft Java launcher with a Fabric 1.21.1 in-game client. Use it today, tell us what to fix, and watch the full version take shape.</p>
      <p class="more"><a class="btn btn-primary btn-lg" href="#ea-download">Download early access</a><button class="btn btn-ghost btn-lg" type="button" data-ics>Add a November reminder</button></p>
    </div></section>
    <section class="wrap ea-cols">
      <div class="panel"><h2>Included today</h2><ul class="ea-list">${li([
        "Launcher for Minecraft Java Edition on Windows 10 and 11 (64-bit)", "Fabric in-game client for Minecraft 1.21.1 (Java 21), menu on <code>Right Shift</code>",
        "Draggable HUD with 11 elements, saved to <code>config/fireclient/client.json</code>", "3 accent themes",
        "Modrinth mod manager, your own jar files, and curated packs for Performance, Visuals, Utility and PvP", "Worlds library with each world's icon, last-saved date and size",
        "Memory setting passed to Java as the max heap, local skins, and Paper server hosting"])}</ul></div>
      <div class="panel"><h2>Known limits</h2><ul class="ea-list">${li([
        "The installer is unsigned, so Windows may show a security prompt. If a SHA-256 is shown on the download section, compare it with your file.",
        "The in-game mod exists for Minecraft 1.21.1 on Fabric only.", "Windows only. macOS and Linux are not available.", "Crosshair editor and cosmetics are planned and not built yet."])}</ul></div>
    </section>
    <section class="wrap"><div class="panel"><h2>Read more</h2><ul class="ea-list"><li><a href="/news/fireclient-1-0-beta-available/">FireClient 1.0 release notes</a></li><li><a href="/news/fireclient-early-access-november-2026-roadmap/">Early access and the November 2026 plan</a></li><li><a href="/blog/fireclient-hud-setup-guide/">How to set up the HUD</a></li><li><a href="/blog/install-fireclient-windows/">Install FireClient in five steps</a></li></ul></div></section>
${eaDownload}${roadmap()}
    <section class="section section-alt" aria-labelledby="fb-title"><div class="wrap">
      <header class="section-head"><h2 id="fb-title">Help shape the full version.</h2><p class="lede">Early access players decide what gets fixed first. Say what works, what breaks and what you want next.</p></header>
      <p class="more"><a class="btn btn-primary btn-sm" href="${SITE.discord}" target="_blank" rel="noopener noreferrer">Join the Discord</a><a class="btn btn-ghost btn-sm" href="${SITE.github}/issues/new" target="_blank" rel="noopener noreferrer">Report a bug on GitHub</a><a class="btn btn-ghost btn-sm" href="/feed.xml">Subscribe via RSS</a><a class="btn btn-ghost btn-sm" href="/news/">Read the news</a></p>
    </div></section>
    <section class="section" aria-labelledby="eafaq-title"><div class="wrap ea-faq">
      <header class="section-head"><h2 id="eafaq-title">Early access questions.</h2></header>
      ${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n      ")}
    </div></section>`;
  return shell({ title, desc, path, body, active: "ea", ld: [
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en", dateModified: lm(path) },
    crumbs([["FireClient", "/"], ["Early access", path]])] });
}
