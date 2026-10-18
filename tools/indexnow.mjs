// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver) about every URL in sitemap.xml.
// Run AFTER the site is deployed:  node tools/indexnow.mjs
// Google does not use IndexNow. For Google use Search Console (submit the sitemap and request indexing).
import { readFileSync } from "node:fs";
const host = "www.fireclient.net", key = "6bfb53e06a4864361932b8c254859f76";
const urls = [...readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls })
});
console.log(res.status, res.statusText, `- submitted ${urls.length} URLs`);
