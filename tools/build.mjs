// Regenerates blog/, news/, sitemap.xml, feed.xml and content/latest.json from content/posts.json.
// Usage: node tools/build.mjs   (the admin panel does the same thing in the browser when you publish)
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSite, injectHome, TYPES } from "../lib/render.mjs";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { posts = [] } = JSON.parse(readFileSync(join(root, "content/posts.json"), "utf8"));
const { files, published } = buildSite(posts);
for (const [p, c] of Object.entries(files)) { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), c); }
for (const t of Object.values(TYPES)) { const d = join(root, t.dir); if (!existsSync(d)) continue;
  for (const n of readdirSync(d)) if (statSync(join(d, n)).isDirectory() && !(`${t.dir}/${n}/index.html` in files)) rmSync(join(d, n), { recursive: true }); }
const idx = join(root, "index.html"), h = readFileSync(idx, "utf8"), n = injectHome(h, published); if (n !== h) writeFileSync(idx, n);
console.log(`Built ${published.length} published post(s), ${Object.keys(files).length} files.`);
