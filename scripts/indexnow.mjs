#!/usr/bin/env node
/**
 * IndexNow helper for Bing (and Yandex/Naver — they share the same endpoint).
 *
 *   node scripts/indexnow.mjs --keyfile   # write public/<key>.txt for the build
 *   node scripts/indexnow.mjs --submit    # push the sitemap's URLs to IndexNow
 *
 * The key is not a secret: IndexNow requires it to be publicly fetchable at
 *   https://<host>/<key>.txt
 * so this script writes that file into public/ before the build.
 *
 * Configure with:
 *   INDEXNOW_KEY=<32+ hex chars>     (required)
 *   NEXT_PUBLIC_SITE_URL=https://fireclient.net
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://fireclient.net").replace(/\/$/, "");

function readKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY.trim();
  const keyFile = join(ROOT, ".indexnow-key");
  if (existsSync(keyFile)) return readFileSync(keyFile, "utf8").trim();
  return null;
}

const args = process.argv.slice(2);
const key = readKey();

if (!key) {
  console.log("[indexnow] INDEXNOW_KEY not set — skipping (no key file written, no submission).");
  process.exit(0);
}

if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
  console.error("[indexnow] INDEXNOW_KEY must be 8–128 chars of a-z, A-Z, 0-9 or '-'.");
  process.exit(1);
}

if (args.includes("--keyfile")) {
  const target = join(ROOT, "public", `${key}.txt`);
  writeFileSync(target, key, "utf8");
  console.log(`[indexnow] wrote ${target.replace(ROOT + "/", "")}`);
  process.exit(0);
}

if (args.includes("--submit")) {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  let urls = [];

  try {
    const res = await fetch(sitemapUrl, { headers: { "user-agent": "FireClient-IndexNow/1.0" } });
    if (!res.ok) throw new Error(`sitemap responded ${res.status}`);
    const xml = await res.text();
    urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  } catch (error) {
    console.error(`[indexnow] could not read ${sitemapUrl}: ${error.message}`);
    console.error("[indexnow] deploy first, then run this again.");
    process.exit(1);
  }

  if (urls.length === 0) {
    console.error("[indexnow] sitemap contained no URLs.");
    process.exit(1);
  }

  const body = {
    host: new URL(SITE_URL).host,
    key,
    keyLocation: `${SITE_URL}/${key}.txt`,
    urlList: urls.slice(0, 10000),
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  console.log(`[indexnow] submitted ${urls.length} URLs — HTTP ${res.status} ${res.statusText}`);
  if (!res.ok) {
    console.error(await res.text().catch(() => ""));
    process.exit(1);
  }
  process.exit(0);
}

console.log("Usage: node scripts/indexnow.mjs --keyfile | --submit");
