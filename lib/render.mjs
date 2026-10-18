/* FireClient content renderer. Shared by tools/build.mjs (Node) and admin/admin.js (browser).
   Turns content/posts.json into static, SEO-ready pages, sitemap.xml, feed.xml and content/latest.json. */
import { LOCALES } from "./locales.mjs";
export const SITE = {
  url: "https://www.fireclient.net", name: "FireClient", tagline: "Minecraft, Your Way.",
  author: "FirePDX", ogImage: "/assets/og-image.png", homeLastmod: "2026-10-18",
  discord: "https://discord.gg/r23YNWWfrx", github: "https://github.com/untitledinfo/fireclient-launcher",
  releases: "https://github.com/untitledinfo/verifed-fireclient/releases", installer: "https://github.com/untitledinfo/verifed-fireclient/releases/latest/download/FireClient-Setup.exe", report: "https://github.com/untitledinfo/verifed-fireclient/releases/latest/download/verification-report.json"
};
export const TYPES = {
  blog: { dir: "blog", label: "Blog", ld: "BlogPosting", title: "FireClient Blog — Guides for the Minecraft launcher and client",
    desc: "Guides and tips for FireClient, the free Minecraft Java launcher and Fabric client: HUD setup, installing, mods and more.", lede: "Guides and tips for the launcher and the in-game client." },
  news: { dir: "news", label: "News", ld: "NewsArticle", title: "FireClient News — Releases and announcements",
    desc: "Release notes and announcements for FireClient, the free Minecraft Java launcher and Fabric client for Windows.", lede: "Releases and announcements." }
};

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const slugify = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/, "");
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
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => `<img src="${safeUrl(u)}" alt="${a}" loading="lazy" decoding="async">`);
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
      out.push(`<h${lv} id="${id}">${inline(m[2])}</h${lv}>`); i++; continue; }
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
      <nav class="footer-nav" aria-label="Footer navigation"><a href="/#features">Features</a><a href="/download/">Download</a><a href="/early-access/">Early access</a><a href="/faq/">FAQ</a><a href="/press/">Press kit</a><a href="/#changelog">Changelog</a><a href="/blog/">Blog</a><a href="/news/">News</a><a href="/feed.xml">RSS</a><a href="/#faq">FAQ</a><a href="${SITE.discord}" target="_blank" rel="noopener noreferrer">Discord</a><a href="${SITE.github}" target="_blank" rel="noopener noreferrer">GitHub</a><a href="/terms-and-privacy.html">Terms &amp; Privacy</a></nav>
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

function shell({ title, desc, path, image, og = "website", ld = [], body, active, extra = "", lang = "en", locale = "en_US", dir = "ltr", L: LL }) {
  const canon = SITE.url + path, img = abs(image || SITE.ogImage);
  return `<!doctype html>
<html lang="${lang}"${dir === "rtl" ? ' dir="rtl"' : ""}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#09070a">
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
  <script src="/share.js" defer></script>
  <script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
`;
}
const crumbs = items => ({ "@type": "BreadcrumbList", itemListElement: items.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE.url + u })) });
const publisher = { "@type": "Organization", name: "FireClient", url: SITE.url + "/", logo: { "@type": "ImageObject", url: SITE.url + "/assets/icon.png", width: 512, height: 512 } };

const small = c => String(c || "").replace(/^(\/assets\/(?:ingame-hud|ingame-menu|launcher-home|launcher-mods))\.jpg$/, "$1-960.jpg");
const card = (p, big) => `<a class="pcard${big ? " pcard-big" : ""}" href="${postUrl(p)}" data-q="${esc((p.title + " " + p.excerpt + " " + (p.tags || []).join(" ")).toLowerCase())}" data-tags="${esc((p.tags || []).join(","))}">
      ${p.cover ? `<img class="pcard-cover" src="${esc(small(url(p.cover)))}" alt="" loading="${big ? "eager" : "lazy"}" decoding="async">` : `<span class="pcard-cover pcard-ph" aria-hidden="true"><img src="/assets/logo.svg" alt="" width="56" height="56"></span>`}
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
    </section>`;
  return shell({ title: T.title, desc: T.desc, path, body, active: type, ld: [
    { "@type": "CollectionPage", "@id": SITE.url + path, url: SITE.url + path, name: T.title, description: T.desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en" },
    { "@type": "ItemList", itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: SITE.url + postUrl(p), name: p.title })) },
    crumbs([["FireClient", "/"], [T.label, path]])] });
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
      ${p.cover ? `<figure class="post-cover"><img src="${esc(small(url(p.cover)))}" alt="${esc(p.title)}" width="960" height="564" fetchpriority="high" decoding="async"></figure>` : ""}
      <div class="post-grid">
        ${toc.length > 2 ? `<aside class="toc" aria-label="On this page"><b>On this page</b><ol>${toc.map(t => `<li><a href="#${t.id}">${inline(t.text)}</a></li>`).join("")}</ol></aside>` : `<span></span>`}
        <div class="prose">
${html}
          <footer class="post-foot">
            ${(p.tags || []).length ? `<p class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</p>` : ""}
            <p class="share"><button class="btn btn-ghost btn-sm" type="button" data-copy="${u}">Copy link</button><a class="btn btn-ghost btn-sm" href="${tweet}" target="_blank" rel="noopener noreferrer">Share on X</a><span>By ${esc(p.author || SITE.author)}</span></p>
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
  for (const L of Object.values(LOCALES)) f[`${L.code}/index.html`] = localPage(L);
  const alts = () => `<xhtml:link rel="alternate" hreflang="en" href="${SITE.url}/"/>` + Object.values(LOCALES).map(L => `<xhtml:link rel="alternate" hreflang="${HL(L)}" href="${SITE.url}/${L.code}/"/>`).join("") + `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}/"/>`;
  const img = (loc, t) => `<image:image><image:loc>${abs(loc)}</image:loc><image:title>${esc(t)}</image:title></image:image>`;
  const U = (loc, mod, freq, pr, extra = "") => `  <url><loc>${SITE.url}${loc}</loc><lastmod>${mod}</lastmod><changefreq>${freq}</changefreq><priority>${pr}</priority>${extra}</url>`;
  const newest = t => pub.find(p => p.type === t)?.updated || pub.find(p => p.type === t)?.date || SITE.homeLastmod;
  f["sitemap.xml"] = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` + [
    U("/", SITE.homeLastmod, "weekly", "1.0", img("/assets/ingame-menu.jpg", "FireClient main menu") + img("/assets/ingame-hud.jpg", "FireClient HUD settings") + img("/assets/launcher-home.jpg", "FireClient launcher home") + alts()),
    U("/download/", SITE.homeLastmod, "weekly", "0.9"), U("/press/", SITE.homeLastmod, "monthly", "0.6"), U("/faq/", SITE.homeLastmod, "monthly", "0.8"), ...Object.values(LOCALES).map(L => U(`/${L.code}/`, SITE.homeLastmod, "monthly", "0.8", alts())), U("/early-access/", SITE.homeLastmod, "weekly", "0.9"), U("/blog/", newest("blog"), "weekly", "0.8"), U("/news/", newest("news"), "weekly", "0.8"),
    ...pub.map(p => U(postUrl(p), p.updated || p.date, "monthly", p.type === "news" ? "0.6" : "0.7", p.cover ? img(p.cover, p.title) : "")),
    U("/terms-and-privacy.html", "2026-10-10", "yearly", "0.3")].join("\n") + "\n</urlset>\n";
  f["feed.xml"] = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n<channel>\n  <title>FireClient — blog and news</title><link>${SITE.url}/</link><description>Guides and release news for FireClient, the free Minecraft Java launcher and Fabric client.</description><language>en</language>\n  <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>\n` +
    pub.slice(0, 30).map(p => `  <item><title>${esc(p.title)}</title><link>${SITE.url}${postUrl(p)}</link><guid isPermaLink="true">${SITE.url}${postUrl(p)}</guid><pubDate>${rfc822(p.date)}</pubDate><description>${esc(descOf(p))}</description>${(p.tags || []).map(t => `<category>${esc(t)}</category>`).join("")}<content:encoded><![CDATA[${md(p.body).html.replace(/\]\]>/g, "]]&gt;").replace(/(src|href)="\//g, `$1="${SITE.url}/`)}]]></content:encoded></item>`).join("\n") + "\n</channel>\n</rss>\n";
  f["content/search.json"] = JSON.stringify(pub.map(p => ({ type: p.type, title: p.title, url: postUrl(p), date: p.date, excerpt: p.excerpt, tags: p.tags || [] })));
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
      <header class="section-head"><h2 id="eadl-title">Download early access.</h2><p class="lede">Free Windows installer, v1.0. You need your own Minecraft Java Edition account to play online.</p></header>
      <div class="panel dl-main">
        <div class="dl-actions"><a class="btn btn-primary btn-lg" id="ea-dl-button" href="${SITE.installer}" download rel="nofollow noopener" data-ea-download><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 17v3h14v-3"/></svg><span>Download early access for Windows</span></a><a class="btn btn-ghost btn-lg" href="${SITE.releases}" target="_blank" rel="noopener noreferrer">All releases</a></div>
        <p class="thanks" id="ea-thanks" hidden><b>Thanks for downloading FireClient.</b> Run the installer, then join the Discord if you need help.</p>
        <p class="pc-check" data-pc hidden></p>
        <p class="note">Direct download: <a href="${SITE.installer}" rel="nofollow noopener">FireClient-Setup.exe</a> from GitHub Releases. Windows 10 or 11, 64-bit.</p>
        <p class="note"><strong>Unsigned early access build.</strong> Windows may show a security prompt. Only install from this site or the official GitHub repository.</p>
      </div>
    </div></section>
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
    <section class="wrap ea-cols"><div class="panel"><h2>${esc(L.gh)}</h2><ul class="ea-list">${L.guides.map(([u, t]) => `<li><a href="${u}" lang="en">${esc(t)}</a></li>`).join("")}</ul></div></section>
    <section class="section" aria-labelledby="lfaq-title"><div class="wrap ea-faq">
      <header class="section-head"><h2 id="lfaq-title">${esc(L.qh)}</h2></header>
      ${L.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n      ")}
    </div></section>`;
  return shell({ title: L.title, desc: L.desc, path, body, active: "dl", lang: HL(L), locale: L.locale, dir: L.dir || "ltr", L, extra: hreflangs(path), ld: [
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: L.title, description: L.desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: HL(L), dateModified: SITE.homeLastmod },
    { "@type": "SoftwareApplication", name: "FireClient", applicationCategory: "GameApplication", operatingSystem: "Windows 10, Windows 11", softwareVersion: "1.0", downloadUrl: dl, url: SITE.url + path, inLanguage: HL(L), offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": SITE.url + "/#org" } },
    { "@type": "FAQPage", inLanguage: HL(L), mainEntity: L.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    crumbs([[L.home, "/"], [L.crumb, path]])] });
}

function downloadPage() {
  const path = "/download/", title = "Download FireClient — Free Minecraft Launcher for Windows",
    desc = "Download FireClient for Windows 10 and 11: a free Minecraft Java launcher with a Fabric 1.21.1 client, Modrinth mod manager and draggable HUD. Early access v1.0.";
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
      <p class="lede">A free Minecraft Java launcher with a Fabric 1.21.1 in-game client, a Modrinth mod manager and a draggable HUD. Early access v1.0 for Windows 10 and 11 (64-bit).</p>
    </div></section>
<div class="wrap"><p class="note" id="os-note" role="status" hidden></p></div>
${eaDownload}
    <section class="wrap"><div class="panel"><h2>Check your download</h2><ul class="ea-list"><li>The release page lists the SHA-256 of the installer. Compare it with your file using <code>Get-FileHash</code> in PowerShell.</li><li>Each release also carries a <a href="${SITE.report}" rel="nofollow noopener">verification report</a> with the SHA-256 and SHA-512, the certificate details and the result of a Microsoft Defender scan. It exists once a release has been published with it.</li><li>FireClient is not yet a Windows Verified Publisher, so Windows may still show a warning even for the genuine file. Download only from this page or the <a href="${SITE.releases}" target="_blank" rel="noopener noreferrer">official releases</a>.</li></ul></div></section>
    <section class="wrap"><div class="panel">${shareRow(path, title)}</div></section>
    <section class="wrap ea-cols">
      <div class="panel"><h2>Before you install</h2><ul class="ea-list"><li>Windows 10 or 11, 64-bit</li><li>Your own Minecraft Java Edition account for online play</li><li>Download only from this page or the <a href="${SITE.releases}" target="_blank" rel="noopener noreferrer">official GitHub releases</a></li><li>Optional: compare the SHA-256 shown above with <code>Get-FileHash</code> in PowerShell</li></ul></div>
      <div class="panel"><h2>Next steps</h2><ul class="ea-list"><li><a href="/blog/install-fireclient-windows/">Install FireClient in five steps</a></li><li><a href="/blog/is-fireclient-safe/">Is FireClient safe? Check your download</a></li><li><a href="/blog/fireclient-hud-setup-guide/">Set up the HUD</a></li><li><a href="/blog/boost-fps-minecraft-1-21-1-fabric/">Boost your FPS</a></li><li><a href="/early-access/">Early access details and roadmap</a></li></ul></div>
    </section>
    <section class="section" aria-labelledby="dlfaq-title"><div class="wrap ea-faq">
      <header class="section-head"><h2 id="dlfaq-title">Download questions.</h2></header>
      ${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n      ")}
    </div></section>`;
  return shell({ title, desc, path, body, active: "dl", extra: '<script src="/os-check.js" defer></script>', ld: [
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en", dateModified: SITE.homeLastmod },
    { "@type": "SoftwareApplication", name: "FireClient", applicationCategory: "GameApplication", operatingSystem: "Windows 10, Windows 11", softwareVersion: "1.0", downloadUrl: SITE.installer, url: SITE.url + path, image: SITE.url + SITE.ogImage, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": SITE.url + "/#org" } },
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
  const assets = [["/logo.png", "Logo (PNG)"], ["/assets/logo.svg", "Logo (SVG)"], ["/assets/ingame-menu.jpg", "Screenshot: main menu"], ["/assets/ingame-hud.jpg", "Screenshot: HUD"], ["/assets/launcher-home.jpg", "Screenshot: launcher home"], ["/assets/launcher-mods.jpg", "Screenshot: mod manager"]];
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
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en", dateModified: SITE.homeLastmod },
    crumbs([["FireClient", "/"], ["Press kit", path]])] });
}

function faqPage() {
  const path = "/faq/", title = "FireClient FAQ — Answers About the Free Minecraft Launcher",
    desc = "Answers to common questions about FireClient: is it free and safe, which Windows and Minecraft versions it supports, Java 21, mods, HUD, RAM and the November 2026 full version.";
  const items = [
    ["What is FireClient?", "FireClient is a free Minecraft Java Edition launcher for Windows 10 and 11, with a Fabric in-game client for Minecraft 1.21.1. It adds a draggable HUD, a Modrinth mod manager and a worlds library.", "/download/", "Download page"],
    ["Is FireClient free?", "Yes. The launcher and the in-game client are free. You need your own Minecraft Java Edition account to play online.", "/download/", "Download FireClient"],
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
      ${items.map(([q, a, u, t]) => `<details><summary>${esc(q)}</summary><p>${esc(a)} <a href="${u}">${esc(t)}</a></p></details>`).join("\n      ")}
    </div></section>`;
  return shell({ title, desc, path, body, ld: [
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en", dateModified: SITE.homeLastmod },
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
    { "@type": "WebPage", "@id": SITE.url + path, url: SITE.url + path, name: title, description: desc, isPartOf: { "@type": "WebSite", url: SITE.url + "/", name: "FireClient" }, inLanguage: "en", dateModified: SITE.homeLastmod },
    crumbs([["FireClient", "/"], ["Early access", path]])] });
}
