/* FireClient release helpers. One implementation shared by the browser (window.FCRelease), the
   /api/latest function and tools/check-release.mjs, so the "which file is the installer and what is
   its checksum" logic exists exactly once.

   Rules this file enforces:
   - A size or SHA-256 is only returned when GitHub (or the release's own verification report) published it.
   - If more than one .exe could be the installer, nothing is picked. A wrong file would show a wrong hash.
   - If two sources disagree about the hash, no hash is returned and the conflict is flagged.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.FCRelease = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var HEX64 = /^[0-9a-f]{64}$/i;
  var PREFERRED_INSTALLER = "FireClient-Setup.exe";

  function sha256FromDigest(d) {
    if (typeof d !== "string") return "";
    var m = /^sha256:([0-9a-f]{64})$/i.exec(d.trim());
    return m ? m[1].toLowerCase() : "";
  }

  // Accepts GitHub's raw asset object or an already-normalised one.
  function normAsset(a) {
    if (!a || typeof a.name !== "string") return null;
    if (a.state && a.state !== "uploaded") return null; // still uploading or failed
    var url = a.browser_download_url || a.url || "";
    return {
      name: a.name,
      size: typeof a.size === "number" && a.size > 0 ? a.size : 0,
      url: typeof url === "string" ? url : "",
      sha256: a.sha256 && HEX64.test(a.sha256) ? String(a.sha256).toLowerCase() : sha256FromDigest(a.digest)
    };
  }

  // Returns { asset, issue }. issue is "" when an installer was chosen, else "none" or "ambiguous".
  function pickInstaller(assets, preferred) {
    var want = String(preferred || PREFERRED_INSTALLER).toLowerCase();
    var list = (Array.isArray(assets) ? assets : []).map(normAsset).filter(Boolean).filter(function (a) { return a.url; });
    var exact = list.filter(function (a) { return a.name.toLowerCase() === want; });
    if (exact.length === 1) return { asset: exact[0], issue: "" };
    var exes = list.filter(function (a) { return /\.exe$/i.test(a.name); });
    if (!exes.length) return { asset: null, issue: "none" };
    var setups = exes.filter(function (a) { return /(setup|install)/i.test(a.name); });
    if (setups.length === 1) return { asset: setups[0], issue: "" };
    if (!setups.length && exes.length === 1) return { asset: exes[0], issue: "" };
    return { asset: null, issue: "ambiguous" };
  }

  function baseName(s) { return String(s || "").split(/[\\/]/).pop().toLowerCase(); }

  // Looks inside a release's verification report for the installer's SHA-256.
  // The report's exact schema is not documented in this repository, so this is deliberately strict:
  // it accepts a hash only from a key named sha256/sha-256 (not thumbprints), prefers an entry that names
  // the installer file, and refuses anything that sits under certificate/scan data or that conflicts.
  function extractReportSha256(report, assetName) {
    var found = [];
    (function walk(node, path) {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) { node.forEach(function (n, i) { walk(n, path + "[" + i + "]"); }); return; }
      var label = null;
      ["file", "name", "filename", "asset", "path", "installer"].forEach(function (k) { if (label === null && typeof node[k] === "string") label = baseName(node[k]); });
      Object.keys(node).forEach(function (k) {
        var v = node[k];
        if (/^sha-?256$/i.test(k) && typeof v === "string" && HEX64.test(v)) found.push({ hash: v.toLowerCase(), label: label, path: path });
        else if (v && typeof v === "object") walk(v, path + "." + k);
      });
    })(report, "$");
    if (!found.length) return "";
    var target = baseName(assetName), named = found.filter(function (f) { return f.label === target; });
    var pool = named.length ? named : found.filter(function (f) { return f.label === null && !/cert|signat|signer|thumb|defender|scan/i.test(f.path); });
    var uniq = pool.map(function (f) { return f.hash; }).filter(function (h, i, a) { return a.indexOf(h) === i; });
    return uniq.length === 1 ? uniq[0] : "";
  }

  // Turns GitHub's /releases array into the one object the site needs. Returns null when there is no usable release.
  function summarize(releases, opts) {
    var includePre = !opts || opts.includePrereleases !== false;
    var r = (Array.isArray(releases) ? releases : []).filter(function (x) { return x && !x.draft && (includePre || !x.prerelease); })[0];
    if (!r) return null;
    var assets = Array.isArray(r.assets) ? r.assets : [];
    var pick = pickInstaller(assets, opts && opts.preferredInstaller);
    var rep = assets.map(normAsset).filter(Boolean).filter(function (a) { return /^verification-report\.json$/i.test(a.name); })[0] || null;
    return {
      tag: String(r.tag_name || ""),
      version: String(r.tag_name || r.name || "").replace(/^v/i, ""),
      date: r.published_at ? String(r.published_at).slice(0, 10) : "",
      htmlUrl: r.html_url || "",
      prerelease: !!r.prerelease,
      assetCount: assets.length,
      installer: pick.asset ? { name: pick.asset.name, size: pick.asset.size, url: pick.asset.url, sha256: pick.asset.sha256, sha256Source: pick.asset.sha256 ? "github-digest" : "" } : null,
      installerIssue: pick.issue,
      report: rep ? { name: rep.name, url: rep.url } : null,
      hashConflict: false
    };
  }

  // Merges the report's hash into a summary. Never overrides a GitHub digest; flags disagreement instead.
  function applyReportHash(summary, reportJson) {
    if (!summary || !summary.installer || !reportJson) return summary;
    var fromReport = extractReportSha256(reportJson, summary.installer.name);
    if (!fromReport) return summary;
    if (!summary.installer.sha256) { summary.installer.sha256 = fromReport; summary.installer.sha256Source = "verification-report"; }
    else if (summary.installer.sha256 !== fromReport) { summary.installer.sha256 = ""; summary.installer.sha256Source = ""; summary.hashConflict = true; }
    return summary;
  }

  function formatBytes(n) {
    if (!n || n < 0) return "";
    var u = ["B", "KB", "MB", "GB"], i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return (i === 0 ? n : n.toFixed(1)) + " " + u[i];
  }

  return { PREFERRED_INSTALLER: PREFERRED_INSTALLER, sha256FromDigest: sha256FromDigest, normAsset: normAsset, pickInstaller: pickInstaller, extractReportSha256: extractReportSha256, summarize: summarize, applyReportHash: applyReportHash, formatBytes: formatBytes };
});
