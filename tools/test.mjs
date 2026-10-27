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
