// Vercel serverless function: /api/release
// Returns GitHub's releases JSON, cached at Vercel's edge for 10 minutes, so visitors never hit GitHub's
// 60-requests-per-hour anonymous limit. Optional: add a GITHUB_TOKEN env var in Vercel (no scopes needed
// for a public repo) to raise GitHub's limit to 5,000 per hour for the refresh itself.
const REPO = "untitledinfo/verifed-fireclient";
module.exports = async (req, res) => {
  try {
    const headers = { Accept: "application/vnd.github+json", "User-Agent": "fireclient-site", "X-GitHub-Api-Version": "2022-11-28" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const r = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=10`, { headers });
    if (!r.ok) throw new Error(`GitHub returned ${r.status}`);
    const data = await r.json();
    if (!Array.isArray(data)) throw new Error("Unexpected response");
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400, stale-if-error=86400");
    res.status(200).json(data);
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ message: String(e.message || e) });
  }
};
