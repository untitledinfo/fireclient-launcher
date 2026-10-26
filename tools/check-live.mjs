// Checks the LIVE site from your own computer (needs internet and Node 18+):   node tools/check-live.mjs
// 1) Redirect chains for http/https, apex/www, /index.html and nested /index.html (want: one permanent hop, then 200).
// 2) robots.txt, sitemap.xml, the release API.
// 3) Every sitemap URL: status 200, no noindex (meta or X-Robots-Tag), matching canonical, correct content type.
import { readFileSync } from "node:fs";
const base = "https://www.fireclient.net", UA = { "User-Agent": "fireclient-check" };
const get = (u, init = {}) => fetch(u, { redirect: "manual", headers: UA, signal: AbortSignal.timeout(15000), ...init });
async function hops(start) { const out = []; let url = start; for (let i = 0; i < 8; i++) { const r = await get(url); out.push(`${r.status} ${url}`); const loc = r.headers.get("location"); if (r.status >= 300 && r.status < 400 && loc) { url = new URL(loc, url).href; if (out.length > 1 && out.some(x => x.endsWith(" " + url))) { out.push("LOOP"); break; } } else break; } return out; }
let bad = 0; const fail = m => { bad++; console.log("PROBLEM " + m); };

console.log("Redirect chains (want one permanent redirect at most, then 200):");
for (const s of ["http://fireclient.net/", "https://fireclient.net/", "http://www.fireclient.net/", `${base}/`, `${base}/index.html`, `${base}/download/index.html`, `${base}/download`, `${base}/license`]) {
  try { const h = await hops(s); console.log(`- ${s}\n    ${h.join("\n    ")}`); const redirects = h.filter(x => /^30[1278]/.test(x)); if (h.includes("LOOP")) fail(`${s} loops`); else if (redirects.length > 2) fail(`${s}: ${redirects.length} redirects`); else if (!h.at(-1).startsWith("200")) fail(`${s} does not end in 200`); else if (redirects.some(x => x.startsWith("302"))) console.log("    note: a 302 is temporary; use 301/308 for permanent canonical redirects"); } catch (e) { fail(`${s}: ${e.message}`); }
}
const robots = await get(`${base}/robots.txt`).then(r => r.text()).catch(() => ""); console.log(/Sitemap:\s*https:\/\/www\.fireclient\.net\/sitemap\.xml/i.test(robots) ? "\nrobots.txt lists the sitemap" : (fail("robots.txt does not list the canonical sitemap"), ""));
if (/^\s*Disallow:\s*\/(css|js|assets)?\s*$/im.test(robots)) fail("robots.txt blocks site-wide or asset paths");
const api = await get(`${base}/api/latest`).catch(e => ({ status: e.message })); console.log(`/api/latest -> ${api.status}${api.status === 200 ? "" : " (deploy api/latest.js; the page falls back to GitHub meanwhile)"}`);
if (api.status === 200) { const j = await api.json(); console.log(`  version ${j.version}, installer ${j.installer?.name}, size ${j.installer?.size}, sha256 ${j.installer?.sha256 ? "present" : "missing"}`); }

const urls = [...readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
console.log(`\nChecking ${urls.length} sitemap URLs:`);
for (let i = 0; i < urls.length; i += 6) await Promise.all(urls.slice(i, i + 6).map(async u => {
  try {
    const r = await get(u), h = r.status === 200 ? await r.text() : "", tag = r.headers.get("x-robots-tag") || "";
    const canon = (h.match(/<link[^>]+rel="canonical"[^>]*href="([^"]*)"/) || h.match(/<link[^>]+href="([^"]*)"[^>]*rel="canonical"/) || [])[1] || "", p = [];
    if (r.status !== 200) p.push(`status ${r.status}`);
    if (/noindex/i.test(tag) || /<meta name="robots" content="[^"]*noindex/i.test(h)) p.push("noindex");
    if (r.status === 200 && canon !== u) p.push(`canonical ${canon || "missing"}`);
    if (r.status === 200 && !/text\/html/.test(r.headers.get("content-type") || "")) p.push(`content-type ${r.headers.get("content-type")}`);
    if (p.length) fail(`${u}: ${p.join(", ")}`);
  } catch (e) { fail(`${u}: ${e.message}`); }
}));
console.log(bad ? `\n${bad} problem(s) need attention.` : "\nAll checks passed: redirects, robots, sitemap URLs (200, indexable, matching canonical).");
process.exit(bad ? 1 : 0);
