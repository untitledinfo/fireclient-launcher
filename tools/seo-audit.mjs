// Offline SEO audit of every page in sitemap.xml (reads the built files, needs no network).
// Run after building:  node tools/build.mjs && node tools/seo-audit.mjs
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url), file = p => fileURLToPath(new URL(p, root));
const base = "https://www.fireclient.net";
const urls = [...readFileSync(file("sitemap.xml"), "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const errors = [], warns = [], titles = new Map(), descs = new Map(), pages = {};
const toFile = u => { let p = u.replace(base, ""); if (!p || p.endsWith("/")) p += "index.html"; return file("." + p); };
const text = h => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
for (const u of urls) {
  const f = toFile(u), e = m => errors.push(`${u}: ${m}`), w = m => warns.push(`${u}: ${m}`);
  if (!existsSync(f)) { e("file missing"); continue; }
  const h = readFileSync(f, "utf8"); pages[u] = h;
  const title = (h.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim() || "";
  const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const canon = (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
  if (!title) e("no <title>"); else if (title.length > 70) w(`title is ${title.length} characters`);
  if (!desc) e("no meta description"); else if (desc.length < 60) w(`description is short (${desc.length})`); else if (desc.length > 175) w(`description is ${desc.length} characters`);
  if (canon !== u) e(`canonical is "${canon}" (expected "${u}")`);
  if (/<meta name="robots" content="[^"]*noindex/i.test(h)) e("has noindex");
  const h1 = (h.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) w(`${h1} <h1> tags`);
  if (!/<html[^>]*\slang="/.test(h)) e("no lang on <html>");
  for (const p of ["og:title", "og:description", "og:image"]) if (!h.includes(`property="${p}"`)) w(`missing ${p}`);
  [...h.matchAll(/application\/ld\+json">([\s\S]*?)<\/script>/g)].forEach(m => { try { JSON.parse(m[1]); } catch { e("invalid JSON-LD"); } });
  const noAlt = (h.match(/<img\b(?![^>]*\balt=)[^>]*>/g) || []).length; if (noAlt) w(`${noAlt} image(s) without alt`);
  for (const m of h.matchAll(/(?:href|src)="(\/[^"#?:]*)/g)) { const l = m[1]; if (l.startsWith("//") || l.startsWith("/_vercel")) continue; let p = "." + l; if (l.endsWith("/")) p += "index.html"; if (!existsSync(file(p))) e(`broken internal link ${l}`); }
  const tx = text(h), cjk = (tx.match(/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/g) || []).length, words = tx.split(" ").length + Math.floor(cjk / 2); if (words < 150) w(`thin page (${words} words)`);
  titles.set(title, [...(titles.get(title) || []), u]); descs.set(desc, [...(descs.get(desc) || []), u]);
}
for (const [t, us] of titles) if (t && us.length > 1) warns.push(`duplicate title "${t.slice(0, 50)}" on ${us.length} pages`);
for (const [t, us] of descs) if (t && us.length > 1) warns.push(`duplicate description on ${us.length} pages: ${us.slice(0, 3).join(", ")}`);
// hreflang: every page that lists alternates must be listed back by each of them
const alt = h => [...h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(m => [m[1], m[2]]);
for (const [u, h] of Object.entries(pages)) { const a = alt(h); if (!a.length) continue; if (!a.some(([, href]) => href === u)) errors.push(`${u}: hreflang set does not include the page itself`);
  for (const [, href] of a) { const o = pages[href]; if (o && !alt(o).some(([, x]) => x === u)) errors.push(`${u}: ${href} does not link back (hreflang)`); } }
console.log(`${urls.length} pages audited`);
warns.forEach(m => console.log("warning:", m)); errors.forEach(m => console.log("ERROR:  ", m));
console.log(`${errors.length} error(s), ${warns.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
