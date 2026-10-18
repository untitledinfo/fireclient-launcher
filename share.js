// Share button: uses the device share sheet when available, otherwise copies the link.
(() => {
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-share]");
    if (!b) return;
    e.preventDefault();
    const url = b.dataset.url || location.href, title = b.dataset.title || document.title;
    if (navigator.share) { navigator.share({ title, url }).catch(() => {}); return; }
    const done = () => { const o = b.textContent; b.textContent = "\u2713"; setTimeout(() => { b.textContent = o; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(done, () => {}); return; }
    const t = document.createElement("textarea");
    t.value = url; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;opacity:0";
    document.body.append(t); t.select();
    try { document.execCommand("copy"); done(); } catch (_) {}
    t.remove();
  });
  document.addEventListener("click", e => {
    const c = e.target.closest("[data-copy-target]");
    if (!c) return;
    const src = document.querySelector(c.dataset.copyTarget);
    if (!src) return;
    const text = src.value || src.textContent;
    const done = () => { const o = c.textContent; c.textContent = "\u2713"; setTimeout(() => { c.textContent = o; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, () => {}); return; }
    src.select(); try { document.execCommand("copy"); done(); } catch (_) {}
  });
})();
