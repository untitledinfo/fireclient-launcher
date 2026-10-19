// Checks the LIVE site from your own computer (needs internet and Node 18+).
//   node tools/check-live.mjs
// 1) Shows every redirect hop for the http/https and www/apex versions of the home page.
//    Good result: ONE permanent redirect to https://www.fireclient.net/ and then 200.
// 2) Fetches every URL in sitemap.xml and checks status 200, no noindex, and a matching canonical.
import { readFileSync } from "node:fs";
const base = "https://www.fireclient.net";
async function hops(start) {
  const out = []; let url = start;
  for (let i = 0; i < 8; i++) {
    const r = await fetch(url, { redirect: "manual", headers: { "User-Agent": "fireclient-check" } });
    out.push(`${r.status} ${url}`);
    const loc = r.headers.get("location");
    if (r.status >= 300 && r.status < 400 && loc) url = new URL(loc, url).href; else break;
  }
  return out;
}
console.log("Redirect chains:");
for (const s of ["http://fireclient.net/", "https://fireclient.net/", "http://www.fireclient.net/", "https://www.fireclient.net/"]) {
  try { const h = await hops(s); console.log(`- ${s}\n    ${h.join("\n    ")}${h.length > 3 ? "\n    WARNING: more than two redirects" : ""}`); } catch (e) { console.log(`- ${s}: ${e.message}`); }
}
const urls = [...readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
let bad = 0;
console.log(`\nChecking ${urls.length} sitemap URLs:`);
for (const u of urls) {
  try {
    const r = await fetch(u, { redirect: "manual", headers: { "User-Agent": "fireclient-check" } });
    const h = r.status === 200 ? await r.text() : "";
    const canon = (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
    const problems = [];
    if (r.status !== 200) problems.push(`status ${r.status}`);
    if (/<meta name="robots" content="[^"]*noindex/i.test(h)) problems.push("noindex");
    if (r.status === 200 && canon !== u) problems.push(`canonical ${canon || "missing"}`);
    if (problems.length) { bad++; console.log(`PROBLEM ${u}: ${problems.join(", ")}`); }
  } catch (e) { bad++; console.log(`PROBLEM ${u}: ${e.message}`); }
}
console.log(bad ? `${bad} URL(s) need attention.` : "All sitemap URLs return 200 with a matching canonical and no noindex.");
