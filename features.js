// Site-wide helpers: search, back-to-top, accent colour, code copy, section links, print, FAQ filter.
// Everything runs in the browser. Choices (accent colour) are kept in this browser only.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const say = m => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2000); };
  const copy = async t => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };
  const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  // Accent colour (3 choices)
  const ACCENTS = {
    ember: { "--red": "#e0313f", "--red-hot": "#ff4a55", "--red-deep": "#7d1521", "--ember": "#ff7a72", "--line-red": "rgba(224, 49, 63, .38)" },
    ocean: { "--red": "#2f7de0", "--red-hot": "#4aa0ff", "--red-deep": "#153d7d", "--ember": "#72b6ff", "--line-red": "rgba(47, 125, 224, .38)" },
    lime: { "--red": "#3fae4a", "--red-hot": "#5fd36a", "--red-deep": "#17621f", "--ember": "#8be39a", "--line-red": "rgba(63, 174, 74, .38)" }
  };
  const applyAccent = k => { const a = ACCENTS[k] || ACCENTS.ember; for (const [p, v] of Object.entries(a)) document.documentElement.style.setProperty(p, v); $$(".accent-picker button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.accent === (ACCENTS[k] ? k : "ember")))); };
  const saved = store.get("fc-accent"); if (saved && ACCENTS[saved]) applyAccent(saved);
  const wrap = $$(".lang-wrap").pop();
  if (wrap) {
    const box = el("div", "accent-picker"); box.setAttribute("role", "group"); box.setAttribute("aria-label", "Accent colour"); box.append(el("span", "", "Accent"));
    for (const [k, label] of [["ember", "Ember"], ["ocean", "Ocean"], ["lime", "Lime"]]) {
      const b = el("button"); b.type = "button"; b.dataset.accent = k; b.setAttribute("aria-label", label + " accent"); b.style.setProperty("--c", ACCENTS[k]["--red"]); b.setAttribute("aria-pressed", String((saved || "ember") === k));
      b.addEventListener("click", () => { applyAccent(k); store.set("fc-accent", k); }); box.append(b);
    }
    wrap.append(box);
  }

  // Back to top (the home page already has one; other pages get this one)
  if (!$(".to-top")) {
    const top = el("button", "to-top", "\u2191"); top.type = "button"; top.setAttribute("aria-label", "Back to top");
    top.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })); document.body.append(top);
    addEventListener("scroll", () => top.classList.toggle("show", scrollY > 700), { passive: true });
  }

  // Copy buttons on code blocks
  $$(".prose pre").forEach(pre => {
    const b = el("button", "code-copy", "Copy"); b.type = "button"; pre.style.position = "relative";
    b.addEventListener("click", async () => { const ok = await copy((pre.querySelector("code") || pre).innerText); b.textContent = ok ? "Copied" : "Press Ctrl+C"; setTimeout(() => { b.textContent = "Copy"; }, 1500); });
    pre.append(b);
  });

  // Section links: copy the full link to a heading
  document.addEventListener("click", async e => {
    const a = e.target.closest(".h-anchor"); if (!a) return;
    if (await copy(location.origin + location.pathname + a.getAttribute("href"))) say("Link to this section copied.");
  });

  // Print button
  document.addEventListener("click", e => { if (e.target.closest("[data-print]")) print(); });

  // FAQ filter
  const ff = $("#faq-filter");
  if (ff) {
    const bar = ff.closest(".faq-tools"); bar.hidden = false;
    const items = $$(".ea-faq details"), count = $("#faq-count");
    const run = () => { const v = ff.value.trim().toLowerCase(); let n = 0; items.forEach(d => { const ok = !v || d.textContent.toLowerCase().includes(v); d.hidden = !ok; if (ok) n++; }); if (count) count.textContent = v ? `${n} of ${items.length} questions` : ""; };
    ff.addEventListener("input", run);
    bar.addEventListener("click", e => { const b = e.target.closest("[data-faq-all]"); if (!b) return; items.forEach(d => { if (!d.hidden) d.open = b.dataset.faqAll === "open"; }); });
  }

  // Site search (press / to open)
  let overlay, input, list, index = null, loading = null;
  const load = () => loading || (loading = fetch("/content/search.json").then(r => r.json()).then(j => { index = j; }).catch(() => { index = []; }));
  const score = (it, toks) => { let s = 0; const t = it.title.toLowerCase(), g = (it.tags || []).join(" ").toLowerCase(), x = (it.excerpt || "").toLowerCase(); for (const k of toks) { let h = 0; if (t.includes(k)) h += 5; if (g.includes(k)) h += 3; if (x.includes(k)) h += 1; if (!h) return 0; s += h; } return s; };
  const render = () => {
    list.replaceChildren(); const q = input.value.trim().toLowerCase();
    if (!q) return; if (!index) { list.append(el("li", "s-none", "Loading\u2026")); return; }
    const toks = q.split(/\s+/), res = index.map(it => [score(it, toks), it]).filter(r => r[0]).sort((a, b) => b[0] - a[0]).slice(0, 8);
    if (!res.length) { list.append(el("li", "s-none", "No matches. Try a different word.")); return; }
    for (const [, it] of res) { const li = el("li"), a = el("a"); a.href = it.url; a.append(el("b", "", it.title), el("span", "", it.excerpt || "")); li.append(a); list.append(li); }
  };
  const close = () => { if (overlay) overlay.hidden = true; document.body.classList.remove("s-open"); };
  const open = () => {
    if (!overlay) {
      overlay = el("div", "s-overlay"); overlay.hidden = true; overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true"); overlay.setAttribute("aria-label", "Search FireClient");
      const box = el("div", "s-box"); input = el("input"); input.type = "search"; input.placeholder = "Search guides, tools and pages"; input.setAttribute("aria-label", "Search");
      list = el("ul", "s-results"); box.append(input, list, el("p", "s-hint", "Press Esc to close")); overlay.append(box); document.body.append(overlay);
      overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
      input.addEventListener("input", () => { render(); });
      input.addEventListener("keydown", e => { const links = $$("a", list); if (e.key === "ArrowDown" && links[0]) { e.preventDefault(); links[0].focus(); } if (e.key === "Enter" && links[0]) links[0].click(); });
      list.addEventListener("keydown", e => { const links = $$("a", list), i = links.indexOf(document.activeElement); if (e.key === "ArrowDown" && links[i + 1]) { e.preventDefault(); links[i + 1].focus(); } if (e.key === "ArrowUp") { e.preventDefault(); (links[i - 1] || input).focus(); } });
    }
    overlay.hidden = false; document.body.classList.add("s-open"); input.focus(); load().then(render);
  };
  const header = $(".site-header");
  if (header) {
    const b = el("button", "s-btn"); b.type = "button"; b.setAttribute("aria-label", "Search (press /)");
    b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
    b.addEventListener("click", open); const t = $(".menu-toggle", header); t ? header.insertBefore(b, t) : header.append(b);
  }
  $$("[data-open-search]").forEach(b => b.addEventListener("click", open));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
    if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { e.preventDefault(); open(); }
  });
})();
