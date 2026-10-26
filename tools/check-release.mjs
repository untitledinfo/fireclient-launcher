// Checks the REAL FireClient release the way the website reads it. Needs internet and Node 18+.
//   node tools/check-release.mjs            (set GITHUB_TOKEN to avoid GitHub's anonymous rate limit)
// It reports what the download panel will show, and every reason a size or SHA-256 might be missing.
// Exit code 0 = installer found with size and a SHA-256. 1 = something the download panel cannot show.
import { createRequire } from "node:module";
const core = createRequire(import.meta.url)("../release-core.js");
const REPO = "untitledinfo/verifed-fireclient", SITE_LINK = `https://github.com/${REPO}/releases/latest/download/${core.PREFERRED_INSTALLER}`;
const headers = { Accept: "application/vnd.github+json", "User-Agent": "fireclient-check", ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };
const problems = [], ok = m => console.log("  ok   " + m), bad = m => { problems.push(m); console.log("  FAIL " + m); };

const r = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=10`, { headers }).catch(e => ({ ok: false, status: e.message }));
if (!r.ok) { console.log(`GitHub API unavailable (${r.status}). Rate limit? Set GITHUB_TOKEN. Nothing else can be checked.`); process.exit(1); }
const releases = await r.json(), s = core.summarize(releases, { includePrereleases: true });
if (!s) { console.log("No published release found."); process.exit(1); }
console.log(`Latest release: ${s.tag}  published ${s.date}  (${s.assetCount} assets)  prerelease=${s.prerelease}`);
console.log("Assets:", (releases.find(x => x.tag_name === s.tag)?.assets || []).map(a => `${a.name} [${a.size} B${a.digest ? ", digest" : ", no digest"}]`).join("; ") || "(none)");

if (!s.installer) bad(`no single installer could be identified (${s.installerIssue}). The site will show no size or hash and falls back to the ${core.PREFERRED_INSTALLER} link.`);
else {
  ok(`installer: ${s.installer.name}`);
  s.installer.size ? ok(`size: ${core.formatBytes(s.installer.size)} (${s.installer.size} bytes)`) : bad("GitHub lists no size for the installer");
  s.installer.sha256 ? ok(`SHA-256 from GitHub digest: ${s.installer.sha256}`) : bad("GitHub lists no digest for the installer");
  if (s.installer.name.toLowerCase() !== core.PREFERRED_INSTALLER.toLowerCase()) bad(`installer is named "${s.installer.name}", so the default link ${SITE_LINK} will 404. Rename the asset or update SITE.installer.`);
}
if (s.report) {
  try {
    const rr = await fetch(s.report.url, { headers: { "User-Agent": "fireclient-check" } });
    if (!rr.ok) bad(`verification report not downloadable (${rr.status})`);
    else {
      const json = JSON.parse(await rr.text()); ok(`verification report parsed (top-level keys: ${Object.keys(json).join(", ")})`);
      const h = s.installer ? core.extractReportSha256(json, s.installer.name) : "";
      if (!h) console.log("  note the report's SHA-256 could not be identified safely (unknown layout). The site then uses GitHub's digest only. Tell me the layout and I will extend the extractor.");
      else if (s.installer?.sha256 && h !== s.installer.sha256) bad(`report SHA-256 (${h}) disagrees with GitHub's digest (${s.installer.sha256}). The site will show no hash until this is resolved.`);
      else ok(`report SHA-256 ${s.installer?.sha256 ? "agrees with GitHub's digest" : "found (GitHub has no digest): " + h}`);
    }
  } catch (e) { bad(`verification report unreadable: ${e.message}`); }
} else console.log("  note this release has no verification-report.json, so the report link is hidden on the site.");

const d = await fetch(SITE_LINK, { method: "HEAD", redirect: "manual", headers: { "User-Agent": "fireclient-check" } }).catch(e => ({ status: e.message }));
d.status >= 300 && d.status < 400 ? ok(`default download link works (${d.status} redirect to the asset)`) : bad(`default download link ${SITE_LINK} returned ${d.status}`);

for (const p of ["/api/latest"]) {
  const x = await fetch("https://www.fireclient.net" + p, { headers: { Accept: "application/json" } }).catch(e => ({ status: e.message }));
  if (x.ok) { const j = await x.json(); j.ok && j.version === s.version ? ok(`${p} on the live site agrees (v${j.version})`) : bad(`${p} on the live site returned ${JSON.stringify(j).slice(0, 120)}`); }
  else console.log(`  note ${p} returned ${x.status}. If the function is not deployed yet, the page falls back to GitHub directly.`);
}
console.log(problems.length ? `\n${problems.length} problem(s) found.` : "\nThe download panel can show the version, size and SHA-256 for this release.");
process.exit(problems.length ? 1 : 0);
