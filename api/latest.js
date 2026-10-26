// Vercel serverless function: /api/latest
// Returns one small, normalised summary of the newest FireClient release: version, date, the installer's
// real name/size/download URL and its SHA-256, plus the verification-report link when the release has one.
// Everything comes from GitHub's own release data. Nothing is guessed: if GitHub did not publish a value,
// the field is empty and the page says so. The older /api/release (raw GitHub JSON) is unchanged.
const core = require("../release-core.js");
const REPO = "untitledinfo/verifed-fireclient";
const MAX_REPORT_BYTES = 512 * 1024;

async function getWithTimeout(url, init, ms) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try { return await fetch(url, { ...init, signal: ctl.signal }); } finally { clearTimeout(timer); }
}

module.exports = async (req, res) => {
  try {
    const headers = { Accept: "application/vnd.github+json", "User-Agent": "fireclient-site", "X-GitHub-Api-Version": "2022-11-28" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const r = await getWithTimeout(`https://api.github.com/repos/${REPO}/releases?per_page=10`, { headers }, 8000);
    if (!r.ok) throw new Error(`GitHub returned ${r.status}`);
    const releases = await r.json();
    if (!Array.isArray(releases)) throw new Error("Unexpected response from GitHub");

    const summary = core.summarize(releases, { includePrereleases: true });
    if (!summary) {
      res.setHeader("Cache-Control", "public, s-maxage=300, stale-if-error=86400");
      return res.status(200).json({ ok: false, reason: "no-release", repo: REPO, fetchedAt: new Date().toISOString() });
    }

    // Cross-check against the release's own verification report when it exists. A failure here never breaks the response.
    if (summary.installer && summary.report && summary.report.url) {
      try {
        const rr = await getWithTimeout(summary.report.url, { headers: { Accept: "application/json", "User-Agent": "fireclient-site" } }, 6000);
        if (rr.ok) {
          const text = await rr.text();
          if (text.length <= MAX_REPORT_BYTES) core.applyReportHash(summary, JSON.parse(text));
        }
      } catch (e) { /* report unavailable or not JSON: keep GitHub's digest only */ }
    }

    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400, stale-if-error=86400");
    res.status(200).json({ ok: true, repo: REPO, fetchedAt: new Date().toISOString(), ...summary });
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ ok: false, message: String((e && e.message) || e) });
  }
};
