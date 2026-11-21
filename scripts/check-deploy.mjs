#!/usr/bin/env node
/**
 * Diagnose a deployment URL. Distinguishes:
 *   - the app answering (our own 404 page says "Lost in the overworld")
 *   - Vercel's platform 404 (request never reached the app)
 *   - auth protection / redirects / wrong project
 *
 *   node scripts/check-deploy.mjs https://fireclient-launcher.vercel.app
 */

const target = process.argv[2] || process.env.DEPLOY_URL;

if (!target) {
  console.error("Usage: node scripts/check-deploy.mjs <url>");
  process.exit(1);
}

const base = target.replace(/\/$/, "");
const paths = ["/", "/download", "/features", "/api/health", "/sitemap.xml"];

function line(label, value) {
  console.log(`  ${label.padEnd(16)} ${value}`);
}

console.log(`\nChecking ${base}\n`);

for (const path of paths) {
  try {
    const res = await fetch(base + path, { redirect: "manual" });
    const body = res.status === 200 && path === "/" ? await res.text() : "";
    const ours = body.includes("Lost in the overworld") || body.includes("FireClient");
    const location = res.headers.get("location");

    console.log(`${path}  →  ${res.status} ${res.statusText}`);
    line("x-vercel-id", res.headers.get("x-vercel-id") ?? "—");
    line("content-type", res.headers.get("content-type") ?? "—");
    if (location) line("location", location);
    if (path === "/") {
      line("app content", ours ? "yes (FireClient HTML)" : "NO — not our app");
    }
  } catch (error) {
    console.log(`${path}  →  request failed: ${error.message}`);
  }
}

console.log(`
How to read this
----------------
200 on /download and /sitemap.xml  → the app is deployed; a 404 on one path is a missing route.
404 everywhere, content-type text/html, no "FireClient" in the body
                                   → Vercel's platform 404: the domain/project is not
                                     serving this deployment. Fix the domain assignment.
401/403                            → Deployment Protection is on (Settings → Deployment Protection).
307 to vercel.com/sso              → the same protection.
200 on the *.vercel.app URL but 404 on your custom domain
                                   → the domain is attached to another project or its DNS
                                     still points at the old deployment.
`);
