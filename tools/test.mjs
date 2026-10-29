// Run:  node --test tools/test.mjs     (offline; GitHub responses below are SYNTHETIC fixtures, not real release data)
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { createHash, randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildSite } from "../lib/render.mjs";
import { findClaims } from "./claims.mjs";
const require = createRequire(import.meta.url), core = require("../release-core.js"), H = require("../hash-core.js"), api = require("../api/latest.js");
const root = new URL("../", import.meta.url), rd = p => readFileSync(fileURLToPath(new URL(p, root)), "utf8");
const A = h => "a".repeat(64), B = "b".repeat(64);
const asset = (name, extra = {}) => ({ name, size: 1000, browser_download_url: `https://github.com/o/r/releases/download/v1/${name}`, state: "uploaded", ...extra });

test("release-core: prefers the exact installer name and reads GitHub's digest", () => {
  const p = core.pickInstaller([asset("other.exe"), asset("FireClient-Setup.exe", { digest: "sha256:" + A() })]);
  assert.equal(p.asset.name, "FireClient-Setup.exe"); assert.equal(p.asset.sha256, A());
});
test("release-core: refuses to guess between several .exe files", () => {
  const p = core.pickInstaller([asset("tool-a.exe"), asset("tool-b.exe")]); assert.equal(p.asset, null); assert.equal(p.issue, "ambiguous");
});
test("release-core: ignores non-installer files and incomplete uploads", () => {
  assert.equal(core.pickInstaller([asset("x.blockmap"), asset("verification-report.json")]).issue, "none");
  assert.equal(core.pickInstaller([asset("FireClient-Setup.exe", { state: "starter" })]).issue, "none");
});
test("release-core: rejects malformed digests", () => {
  for (const d of ["sha256:xyz", "md5:" + A(), "", null, undefined, "sha256:" + "a".repeat(63)]) assert.equal(core.sha256FromDigest(d), "");
});
test("release-core: report hash needs a matching file name, ignores certificate fingerprints", () => {
  const rep = { file: "FireClient-Setup.exe", sha256: A(), certificate: { sha256: B } };
  assert.equal(core.extractReportSha256(rep, "FireClient-Setup.exe"), A());
  assert.equal(core.extractReportSha256({ certificate: { sha256: B } }, "FireClient-Setup.exe"), "");
  assert.equal(core.extractReportSha256({ thumbprintSha256: B }, "FireClient-Setup.exe"), "");
  assert.equal(core.extractReportSha256({ files: [{ name: "a.exe", sha256: A() }, { name: "b.exe", sha256: B }] }, "b.exe"), B);
});
test("release-core: conflicting hash sources produce no hash and a flag", () => {
  const s = core.summarize([{ tag_name: "v1", assets: [asset("FireClient-Setup.exe", { digest: "sha256:" + A() })] }]);
  core.applyReportHash(s, { file: "FireClient-Setup.exe", sha256: B });
  assert.equal(s.installer.sha256, ""); assert.equal(s.hashConflict, true);
});
test("release-core: report fills a missing digest but never overrides one", () => {
  const s = core.summarize([{ tag_name: "v1", assets: [asset("FireClient-Setup.exe")] }]);
  core.applyReportHash(s, { file: "FireClient-Setup.exe", sha256: B }); assert.equal(s.installer.sha256, B); assert.equal(s.installer.sha256Source, "verification-report");
});
test("release-core: summarize skips drafts, honours the prerelease flag, formats bytes", () => {
  const rels = [{ tag_name: "v3", draft: true, assets: [] }, { tag_name: "v2", prerelease: true, assets: [] }, { tag_name: "v1", assets: [] }];
  assert.equal(core.summarize(rels, { includePrereleases: true }).tag, "v2"); assert.equal(core.summarize(rels, { includePrereleases: false }).tag, "v1"); assert.equal(core.summarize([]), null);
  assert.equal(core.formatBytes(0), ""); assert.equal(core.formatBytes(1536), "1.5 KB"); assert.equal(core.formatBytes(5 * 1048576), "5.0 MB");
});

test("hash-core: matches node:crypto at every padding boundary", () => {
  for (let len = 0; len <= 200; len++) { const b = randomBytes(len), s = new H.Sha256(); for (let i = 0; i < len; i += 13) s.update(b.subarray(i, i + 13)); assert.equal(s.hex(), createHash("sha256").update(b).digest("hex"), `len ${len}`); }
});
test("hash-core: chunked file hashing, progress and cancellation", async () => {
  const data = randomBytes(3 * 1048576 + 7), blob = new Blob([data]), want = createHash("sha256").update(data).digest("hex"), steps = [];
  assert.equal(await H.hashFile(blob, { smallLimit: 0, chunkSize: 1048576, onProgress: f => steps.push(f) }), want); assert.ok(steps.length >= 3 && steps.at(-1) === 1);
  assert.equal(await H.hashFile(blob), want);
  const ac = new AbortController(); await assert.rejects(H.hashFile(blob, { smallLimit: 0, chunkSize: 262144, signal: ac.signal, onProgress: f => f > 0.4 && ac.abort() }), { name: "AbortError" });
});
test("hash-core: normalizeHash accepts common paste formats", () => {
  assert.equal(H.normalizeHash(`SHA-256: ${A().toUpperCase()}  FireClient-Setup.exe`), A()); assert.equal(H.normalizeHash("  " + A() + " \n"), A()); assert.equal(H.isSha256("abc"), false);
});

async function callApi(fetchImpl) {
  const real = globalThis.fetch; globalThis.fetch = fetchImpl; const res = { h: {}, setHeader(k, v) { this.h[k] = v; }, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
  try { await api({}, res); } finally { globalThis.fetch = real; } return res;
}
const J = (b, ok = true, status = 200) => ({ ok, status, json: async () => b, text: async () => JSON.stringify(b) });
test("api/latest: returns installer details with GitHub's digest", async () => {
  const rel = [{ tag_name: "v1.2.3", published_at: "2026-10-22T00:00:00Z", assets: [asset("FireClient-Setup.exe", { digest: "sha256:" + A() })] }];
  const r = await callApi(async () => J(rel)); assert.equal(r.code, 200); assert.equal(r.body.ok, true); assert.equal(r.body.installer.sha256, A()); assert.equal(r.body.version, "1.2.3"); assert.match(r.h["Cache-Control"], /s-maxage/);
});
test("api/latest: a conflicting verification report removes the hash", async () => {
  const rel = [{ tag_name: "v1", assets: [asset("FireClient-Setup.exe", { digest: "sha256:" + A() }), asset("verification-report.json")] }];
  const r = await callApi(async u => String(u).includes("api.github.com") ? J(rel) : J({ file: "FireClient-Setup.exe", sha256: B })); assert.equal(r.body.hashConflict, true); assert.equal(r.body.installer.sha256, "");
});
test("api/latest: an unreadable report never breaks the response", async () => {
  const rel = [{ tag_name: "v1", assets: [asset("FireClient-Setup.exe", { digest: "sha256:" + A() }), asset("verification-report.json")] }];
  const r = await callApi(async u => { if (String(u).includes("api.github.com")) return J(rel); throw new Error("boom"); }); assert.equal(r.code, 200); assert.equal(r.body.installer.sha256, A());
});
test("api/latest: GitHub failure becomes a 502 that is not cached; no release is reported honestly", async () => {
  const r = await callApi(async () => J({}, false, 500)); assert.equal(r.code, 502); assert.equal(r.h["Cache-Control"], "no-store");
  const e = await callApi(async () => J([])); assert.equal(e.body.ok, false); assert.equal(e.body.reason, "no-release");
});

const posts = JSON.parse(rd("content/posts.json")).posts, built = buildSite(posts).files;
test("build: generation is deterministic and the committed output is current", () => {
  assert.deepEqual(Object.keys(buildSite(posts).files), Object.keys(built));
  const stale = Object.entries(built).filter(([p, c]) => existsSync(new URL(p, root)) && rd(p) !== c).map(([p]) => p);
  assert.deepEqual(stale, [], "run node tools/build.mjs; stale generated files: " + stale.join(", "));
});
const sm = rd("sitemap.xml"), locs = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
test("sitemap: well formed, unique, canonical host, files exist, lastmod valid and not in the future", () => {
  assert.equal(new Set(locs).size, locs.length);
  const today = new Date().toISOString().slice(0, 10);
  for (const m of sm.matchAll(/<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>/g)) { assert.match(m[2], /^\d{4}-\d{2}-\d{2}$/); assert.ok(m[2] <= today, `${m[1]} lastmod ${m[2]} is in the future`); }
  for (const u of locs) { assert.ok(u.startsWith("https://www.fireclient.net/")); let p = u.replace("https://www.fireclient.net/", ""); if (!p || p.endsWith("/")) p += "index.html"; assert.ok(existsSync(new URL(p, root)), "missing " + p); }
});
test("pages: no unsubstantiated safety claims anywhere", () => {
  const bad = []; for (const u of locs) { let p = u.replace("https://www.fireclient.net/", ""); if (!p || p.endsWith("/")) p += "index.html"; const t = rd(p).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, " "); findClaims(t).forEach(c => bad.push(`${u}: ${c.label}`)); }
  assert.deepEqual(bad, []);
});
test("claims linter: flags the original overclaims, passes honest negations", () => {
  assert.ok(findClaims("Yes, 100% safe. FireClient is free of malware.").length >= 2);
  assert.ok(findClaims("100% VirusTotal Clean").length >= 1);
  assert.equal(findClaims("We cannot promise any installer is 100% safe, so we do not.").length, 0);
  assert.equal(findClaims("This page does not claim an independent security audit.").length, 0);
});
test("no stale hard-coded version in the generated download pages", () => {
  for (const p of ["download/index.html", "early-access/index.html", "index.html"]) { const h = rd(p); assert.doesNotMatch(h, /softwareVersion/); assert.doesNotMatch(h, /Early access v1\.0|installer, v1\.0/); }
});
test("download pages: real release panel and scripts are present", () => {
  for (const p of ["download/index.html", "early-access/index.html"]) { const h = rd(p); for (const s of ['id="ea-facts"', 'id="ea-hash-box"', "/release-core.js", "/release-panel.js"]) assert.ok(h.includes(s), `${p} lacks ${s}`); }
  assert.ok(rd("tools/verify-download/index.html").includes("/hash-core.js"));
});
test("vercel.json and robots.txt: canonical host redirect, no asset blocking, sitemap listed", () => {
  const v = JSON.parse(rd("vercel.json")); assert.equal(v.trailingSlash, true);
  assert.ok((v.redirects || []).some(r => JSON.stringify(r).includes("fireclient.net") && JSON.stringify(r).includes("www.fireclient.net")), "apex to www redirect");
  assert.ok((v.redirects || []).some(r => /index\.html/.test(r.source)), "/index.html redirect");
  const rb = rd("robots.txt"); assert.match(rb, /Sitemap:\s*https:\/\/www\.fireclient\.net\/sitemap\.xml/); assert.doesNotMatch(rb, /Disallow:\s*\/(css|js|assets)?\s*$/m);
});
test("seo-audit passes with no errors", () => { const r = spawnSync(process.execPath, [fileURLToPath(new URL("seo-audit.mjs", import.meta.url))], { encoding: "utf8" }); assert.equal(r.status, 0, r.stdout); });

test("home page: layout-stable download card (no pop-in elements, no bare dashes, static text matches the loading text)", () => {
  const h = rd("index.html");
  assert.doesNotMatch(h, /<div class="hash" id="hash-box" hidden>/, "hash row must be visible from the start");
  assert.doesNotMatch(h, /data-bind-wrap|<li data-win-chip hidden>/, "chips must not be hidden until JS runs");
  assert.match(h, /id="dl-state">Checking release…</, "static status text must equal the JS loading text");
  const facts = (h.match(/<dl class="dl-facts">[\s\S]*?<\/dl>/) || [""])[0];
  assert.doesNotMatch(facts, />\s*—\s*</, "no bare dash placeholders in the facts");
  assert.match(h, /<noscript>[^]*releases/, "no-JS users get a link to the releases page");
});
test("cards and screenshots carry intrinsic dimensions (prevents image layout shift)", () => {
  for (const p of ["index.html", "blog/index.html", "news/index.html"]) {
    const bad = [...rd(p).matchAll(/<img\b[^>]*-960\.jpg[^>]*>/g)].map(m => m[0]).filter(t => !/\bwidth="\d+"/.test(t) || !/\bheight="\d+"/.test(t));
    assert.deepEqual(bad, [], `${p}: images without width/height`);
  }
});
test("list pages reserve space for the JS search bar", () => {
  assert.match(rd("blog.css"), /\.pg-tools\[hidden\]\s*\{[^}]*display:\s*block\s*!important/);
});

test("card covers must not take their height from the HTML height attribute (regression: stretched images)", () => {
  assert.match(rd("blog.css"), /\.pcard-cover\s*\{[^}]*height:\s*auto/);
  assert.match(rd("blog.css"), /\.pgrid\s*\{[^}]*auto-fit/, "grid must use auto-fit so a short row fills the width");
});
test("comparison page: sourced, dated, discloses affiliation, makes no unverified speed or competitor claims", () => {
  const h = rd("blog/fireclient-vs-lunar-client/index.html").replace(/<[^>]+>/g, " ");
  assert.match(h, /lunarclient\.com\/faq/); assert.match(h, /We make FireClient/); assert.match(h, /not affiliated/);
  assert.doesNotMatch(h, /faster than|better than lunar|more fps|benchmark(ed)? results/i);
  assert.doesNotMatch(h, /Feather/, "no claims about products we could not verify");
});
test("FAQ explains the name collision and JSON-LD carries a disambiguating description", () => {
  assert.match(rd("faq/index.html"), /FireClient SMP mod on Modrinth/);
  assert.match(rd("index.html"), /disambiguatingDescription/);
});

test("guides index: lists every published article exactly once, is in the sitemap, footer and home link to it", () => {
  const pub = posts.filter(p => p.status === "published" && p.slug), h = rd("guides/index.html");
  const hrefs = [...h.matchAll(/<ul class="guide-list">([\s\S]*?)<\/ul>/g)].flatMap(m => [...m[1].matchAll(/<a href="([^"]+)"/g)].map(x => x[1]));
  for (const p of pub) { const u = `/${p.type === "news" ? "news" : "blog"}/${p.slug}/`; assert.equal(hrefs.filter(x => x === u).length, 1, `${u} must appear exactly once`); }
  assert.ok(sm.includes("<loc>https://www.fireclient.net/guides/</loc>"));
  assert.match(rd("index.html"), /href="\/guides\/"/); assert.match(h, /"@type":"ItemList"/);
  assert.match(rd("blog/index.html"), /<a href="\/guides\/">Guides<\/a>/, "footer links to the index");
});
test("indexnow workflow: waits for the live deploy, uses no secrets, runs the hardened tool", () => {
  const w = rd(".github/workflows/indexnow.yml");
  assert.doesNotMatch(w, /secrets\./); assert.match(w, /cmp -s/); assert.match(w, /tools\/indexnow\.mjs/);
});

function imgSize(buf) { // JPEG SOF parser, WebP VP8/VP8L/VP8X reader
  if (buf[0] === 0xff && buf[1] === 0xd8) { let i = 2; while (i < buf.length) { if (buf[i] !== 0xff) { i++; continue; } const m = buf[i + 1]; if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)]; i += 2 + buf.readUInt16BE(i + 2); } }
  if (buf.toString("ascii", 0, 4) === "RIFF") { const t = buf.toString("ascii", 12, 16); if (t === "VP8X") return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)]; if (t === "VP8 ") return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff]; if (t === "VP8L") { const b = buf.readUInt32LE(21); return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1]; } }
  return null;
}
test("every local screenshot image exists and its declared width/height matches the real file", () => {
  const bad = [];
  for (const u of locs) { let p = u.replace("https://www.fireclient.net/", ""); if (!p || p.endsWith("/")) p += "index.html";
    for (const m of rd(p).matchAll(/<img\b[^>]*\bsrc="\/?(assets\/[a-z0-9-]+-960\.jpg)"[^>]*>/g)) {
      const w = +(/\bwidth="(\d+)"/.exec(m[0]) || [])[1], h = +(/\bheight="(\d+)"/.exec(m[0]) || [])[1], f = m[1];
      if (!existsSync(new URL(f, root))) { bad.push(`${p}: missing ${f}`); continue; }
      const s = imgSize(readFileSync(fileURLToPath(new URL(f, root)))); if (!s || s[0] !== w || s[1] !== h) bad.push(`${p}: ${f} declared ${w}x${h}, real ${s}`); } }
  assert.deepEqual([...new Set(bad)], []);
});
test("screenshots page: 14 images, each with .jpg, -960.jpg and -960.webp on disk; in sitemap; linked from footer and home", () => {
  const h = rd("screenshots/index.html"), names = [...h.matchAll(/href="\/assets\/([a-z-]+)\.jpg"/g)].map(m => m[1]);
  assert.equal(names.length, 14);
  for (const n of names) for (const s of [`${n}.jpg`, `${n}-960.jpg`, `${n}-960.webp`]) assert.ok(existsSync(new URL("assets/" + s, root)), s);
  assert.ok(sm.includes("<loc>https://www.fireclient.net/screenshots/</loc>")); assert.match(rd("index.html"), /href="\/screenshots\/"/); assert.match(rd("blog/index.html"), /<a href="\/screenshots\/">Screenshots<\/a>/);
  assert.doesNotMatch(h, /Activate Windows/);
});
test("no article describes the removed HUD screen (four tabs, Edit HUD Positions)", () => {
  for (const p of posts) assert.doesNotMatch(p.body || "", /Edit HUD Positions|HUD, Features, Theme/);
});

// Minimal simulation of Vercel's redirect matching (host condition + :path* patterns), first match wins.
function followRedirects(startUrl) {
  const v = JSON.parse(rd("vercel.json")); let u = new URL(startUrl); const chain = [u.href];
  for (let i = 0; i < 6; i++) {
    let hit = null;
    for (const r of v.redirects || []) {
      if ((r.has || []).some(h => h.type === "host" && h.value !== u.hostname)) continue;
      const re = new RegExp("^" + r.source.replace(/:path\*/g, "(.*)").replace(/\(\.\*\)\/\(\.\*\)/g, "(.*)") + "$"); const m = re.exec(u.pathname);
      if (m) { hit = r.destination.replace(/:path\*/g, m[1] ?? "").replace(/\$1/g, m[1] ?? "").replace(/\/\/+$/, "/"); break; }
    }
    if (!hit) break; u = new URL(hit, u); chain.push(u.href);
  }
  return chain;
}
test("index.html aliases reach the canonical URL in ONE permanent redirect (apex and www)", () => {
  const want = { "https://fireclient.net/index.html": "https://www.fireclient.net/", "https://www.fireclient.net/index.html": "https://www.fireclient.net/",
    "https://fireclient.net/download/index.html": "https://www.fireclient.net/download/", "https://www.fireclient.net/download/index.html": "https://www.fireclient.net/download/",
    "https://fireclient.net/": "https://www.fireclient.net/", "https://fireclient.net/blog/x/": "https://www.fireclient.net/blog/x/" };
  for (const [from, to] of Object.entries(want)) { const c = followRedirects(from); assert.equal(c.at(-1), to, `${from} -> ${c.join(" -> ")}`); assert.equal(c.length, 2, `${from} must take exactly one hop: ${c.join(" -> ")}`); }
  assert.deepEqual(followRedirects("https://www.fireclient.net/download/"), ["https://www.fireclient.net/download/"], "canonical URLs are not redirected");
  for (const r of JSON.parse(rd("vercel.json")).redirects.filter(r => /index\.html/.test(r.source))) assert.equal(r.permanent, true);
});
test("no internal link or canonical points at an index.html URL", () => {
  for (const u of locs) { let p = u.replace("https://www.fireclient.net/", ""); if (!p || p.endsWith("/")) p += "index.html"; const h = rd(p); assert.doesNotMatch(h, /href="[^"]*\/index\.html"/, p); assert.doesNotMatch(h, /<link rel="canonical" href="[^"]*index\.html"/, p); }
  assert.doesNotMatch(sm, /index\.html/);
});
test("signing.js: never shows a claim it cannot back with a thumbprint, never says 'verified'", () => {
  const S = require("../signing.js"), T = "A".repeat(40);
  assert.equal(S.describe(null).status, "unsigned"); assert.equal(S.describe({ status: "self-signed" }).status, "unsigned");
  assert.equal(S.describe({ status: "trusted", thumbprint: "xyz" }).status, "unsigned");
  const s = S.describe({ status: "self-signed", subject: "CN=FireClient<script>", thumbprint: T.toLowerCase() });
  assert.equal(s.status, "self-signed"); assert.match(s.text, /not trust self-signed/); assert.match(s.text, new RegExp(T)); assert.doesNotMatch(s.text, /<|verified/i);
  assert.match(S.describe({ status: "trusted", subject: "FireClient", thumbprint: T }).text, /^Signed by FireClient/);
  assert.equal(JSON.parse(rd("content/signing.json")).status, "unsigned", "ship as unsigned until a real signed build exists");
});
test("the removed warning paragraph is gone from the home download card; a factual signature row replaces it", () => {
  const h = rd("index.html"); assert.doesNotMatch(h, /Unsigned beta\.<\/strong> Windows may show a security prompt/); assert.match(h, /data-signing/);
});
test("themes: every accent defines the same variables and keeps WCAG AA contrast for button text and accent text", async () => {
  const vm = await import("node:vm"), ctx = { window: {}, localStorage: { getItem: () => "lime" }, document: { documentElement: { style: { setProperty() {} } } } };
  vm.runInNewContext(rd("accent.js"), ctx); const A = ctx.window.FCAccents;
  const lum = h => { const f = c => c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4, [r, g, b] = [1, 3, 5].map(i => f(parseInt(h.slice(i, i + 2), 16) / 255)); return .2126 * r + .7152 * g + .0722 * b; };
  const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
  const keys = Object.keys(A.ember).sort(); assert.deepEqual(Object.keys(A).sort(), ["ember", "lime", "ocean"]);
  for (const [name, t] of Object.entries(A)) {
    assert.deepEqual(Object.keys(t).sort(), keys, `${name} must define the same variables`);
    assert.ok(cr(t["--on-btn"], t["--btn-2"]) >= 4.5, `${name}: button text contrast ${cr(t["--on-btn"], t["--btn-2"]).toFixed(2)}`);
    assert.ok(cr(t["--ember"], "#140f13") >= 4.5, `${name}: accent text on panels`); assert.ok(cr(t["--red-hot"], "#09070a") >= 4.5, `${name}: accent on page background`);
  }
  const css = rd("style.css") + rd("blog.css"); assert.doesNotMatch(css.replace(/:root\s*\{[^}]*\}/, ""), /#b82431|#e0313f|rgba\(\s*224,\s*49,\s*63/i, "no hard-coded red outside :root (it would ignore the theme)");
  assert.match(rd("index.html"), /src="\/accent\.js"/);
});
