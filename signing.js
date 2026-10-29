/* Shows the installer's code-signature status from /content/signing.json (maintained by the owner).
   It never claims more than the file says, and it never shows "verified": a signature proves who signed
   a file and that it was not altered afterwards, not that the software is safe. Self-signed certificates
   are not trusted by Windows by default, so the text says so.  Works in browsers (window.FCSigning) and Node (tests). */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.FCSigning = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var UNSIGNED = "Not signed yet. Windows SmartScreen may show a warning.";
  function clean(s, max) { return String(s || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, max || 120); }
  function describe(j) {
    if (!j || typeof j !== "object") return { status: "unsigned", text: UNSIGNED };
    var thumb = String(j.thumbprint || "").replace(/[\s:]/g, "").toUpperCase();
    var okThumb = /^([0-9A-F]{40}|[0-9A-F]{64})$/.test(thumb), subject = clean(j.subject, 80);
    var who = (subject ? " by " + subject : "") + (okThumb ? ", thumbprint " + thumb : "");
    // A claim without a thumbprint cannot be checked by anyone, so it falls back to "not signed".
    if (j.status === "self-signed" && okThumb) return { status: "self-signed", thumbprint: thumb, text: "Self-signed" + who + ". Windows does not trust self-signed certificates by default, so SmartScreen may still warn. Compare the thumbprint in the file's Properties, Digital Signatures tab." };
    if (j.status === "trusted" && okThumb) return { status: "trusted", thumbprint: thumb, text: "Signed" + who + ". Check it yourself with Get-AuthenticodeSignature." };
    return { status: "unsigned", text: UNSIGNED };
  }
  function run() {
    var els = document.querySelectorAll("[data-signing]"); if (!els.length || typeof fetch !== "function") return;
    fetch("/content/signing.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      var d = describe(j);
      els.forEach(function (e) { var v = e.querySelector(".sig-v"); if (v) v.textContent = d.text; e.setAttribute("data-sig-status", d.status); });
    }).catch(function () { /* keep the static text, which says "not signed yet" */ });
  }
  if (typeof document !== "undefined") { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run(); }
  return { describe: describe, UNSIGNED: UNSIGNED };
});
