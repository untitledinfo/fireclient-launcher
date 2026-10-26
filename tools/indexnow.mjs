// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver) about the canonical URLs in sitemap.xml.
// Run AFTER the site is deployed:   node tools/indexnow.mjs [--dry-run] [--changed-since=YYYY-MM-DD]
// Google does not use IndexNow. For Google use Search Console (submit the sitemap, then request indexing).
import { readFileSync, existsSync } from "node:fs";
const host = "www.fireclient.net", key = "6bfb53e06a4864361932b8c254859f76", base = `https://${host}`;
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const sm = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
let urls = [...sm.matchAll(/<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>/g)].map(m => ({ u: m[1], d: m[2] }));
if (args["changed-since"]) urls = urls.filter(x => x.d >= args["changed-since"]);
urls = urls.map(x => x.u).filter(u => u.startsWith(base + "/"));   // canonical host only
if (!urls.length) { console.log("No URLs to submit."); process.exit(0); }

// The proof file must exist locally and, once deployed, must be served with exactly the key as its body.
const local = new URL(`../${key}.txt`, import.meta.url);
if (!existsSync(local) || readFileSync(local, "utf8").trim() !== key) { console.error(`ERROR: ${key}.txt is missing or its content is not the key.`); process.exit(1); }
if (args["dry-run"]) { console.log(`Dry run: would submit ${urls.length} URLs to IndexNow for ${host}.`); process.exit(0); }
const proof = await fetch(`${base}/${key}.txt`).then(r => r.ok ? r.text() : `HTTP ${r.status}`).catch(e => e.message);
if (proof.trim() !== key) { console.error(`ERROR: ${base}/${key}.txt is not live with the right content (got: ${String(proof).slice(0, 60)}). Deploy first.`); process.exit(1); }

const MEANING = { 200: "accepted", 202: "accepted, key validation pending", 400: "bad request (invalid format)", 403: "key not valid or key file not found", 422: "URLs do not belong to the host or key does not match", 429: "too many requests, slow down and retry later" };
let failed = 0;
for (let i = 0; i < urls.length; i += 10000) {
  const batch = urls.slice(i, i + 10000);
  const res = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify({ host, key, keyLocation: `${base}/${key}.txt`, urlList: batch }) }).catch(e => ({ status: 0, statusText: e.message }));
  const ok = res.status === 200 || res.status === 202; if (!ok) failed++;
  console.log(`${ok ? "OK  " : "FAIL"} ${res.status} ${MEANING[res.status] || res.statusText || ""} - ${batch.length} URLs`);
}
console.log(failed ? "IndexNow submission failed. Nothing was recorded as submitted." : "Submitted. This only notifies IndexNow engines such as Bing; it does not guarantee indexing and does not notify Google.");
process.exit(failed ? 1 : 0);
