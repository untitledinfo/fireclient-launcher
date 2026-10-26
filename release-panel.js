// Fills the version, size and SHA-256 on /download/ and /early-access/ from the real GitHub release.
// Nothing is guessed: whatever GitHub (or the release's own verification report) does not publish is shown as "not published".
(() => {
  const facts = document.getElementById("ea-facts"), R = window.FCRelease;
  if (!facts || !R) return;
  const $ = id => document.getElementById(id);
  const REPO = "untitledinfo/verifed-fireclient";
  const set = (k, v) => document.querySelectorAll(`[data-rel="${k}"]`).forEach(e => { e.textContent = v; });
  const date = iso => iso ? new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }) : "";
  const official = u => { try { const x = new URL(u); return x.protocol === "https:" && (x.hostname === "github.com" || x.hostname.endsWith(".githubusercontent.com")) ? x.href : ""; } catch { return ""; } };

  async function load() {
    try {
      const r = await fetch("/api/latest", { headers: { Accept: "application/json" } });
      if (r.ok) { const j = await r.json(); if (j && j.ok) return j; }
    } catch { /* fall through to GitHub */ }
    const r = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=10`, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) throw new Error(r.status === 403 || r.status === 429 ? "GitHub's rate limit was reached" : `GitHub answered ${r.status}`);
    const s = R.summarize(await r.json(), { includePrereleases: true });
    if (!s) throw new Error("no release has been published yet");
    return s;
  }

  function render(s) {
    const i = s.installer, url = i ? official(i.url) : "";
    set("version", s.version ? "v" + s.version : "Not available");
    set("date", date(s.date) || "Not available");
    set("size", i && i.size ? R.formatBytes(i.size) : "Not listed");
    if (url) { $("ea-dl-button").href = url; $("ea-direct").href = url; $("ea-direct").textContent = i.name; }
    $("ea-status").textContent = i ? "Latest release on GitHub." :
      (s.installerIssue === "ambiguous" ? "This release lists several installers, so the site cannot tell which one is official. Choose the file on the releases page." : "This release has no Windows installer attached yet. Check the releases page.");
    const sha = i && i.sha256, box = $("ea-hash-box");
    box.hidden = !i;
    $("ea-sha").textContent = sha || (s.hashConflict ? "Not shown: the sources listed for this release disagree." : "Not published for this release yet.");
    $("ea-copy").hidden = !sha;
    $("ea-hash-note").textContent = !i ? "" : sha
      ? (i.sha256Source === "verification-report" ? "Source: this release's verification report." : "Source: GitHub's listing for this file.")
      : "No checksum is published for this release yet.";
    const rep = s.report ? official(s.report.url) : "";
    $("ea-report").hidden = !rep; if (rep) $("ea-report").href = rep;
    $("ea-retry").hidden = true;
  }

  function fail(err) {
    set("version", "Not available"); set("size", "Not available"); set("date", "Not available");
    $("ea-status").textContent = `Could not load release details (${err && err.message ? err.message : "network error"}). The download button still works; open the releases page to see the version and checksum.`;
    $("ea-hash-box").hidden = true; $("ea-hash-note").textContent = ""; $("ea-retry").hidden = false;
  }

  const run = () => { set("version", "Checking…"); set("size", "Checking…"); set("date", "Checking…"); load().then(render, fail); };
  $("ea-retry").addEventListener("click", run);
  $("ea-copy").addEventListener("click", async () => {
    const t = $("ea-sha").textContent.trim();
    try { await navigator.clipboard.writeText(t); $("ea-copy").textContent = "Copied"; } catch { const r = document.createRange(); r.selectNodeContents($("ea-sha")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); $("ea-copy").textContent = "Press Ctrl+C"; }
    setTimeout(() => { $("ea-copy").textContent = "Copy"; }, 2000);
  });
  run();
})();
