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
  const ACCENTS = window.FCAccents || { ember: {} };   // defined in accent.js (loaded in <head>)
  const applyAccent = k => { const a = ACCENTS[k] || ACCENTS.ember || {}; for (const [p, v] of Object.entries(a)) document.documentElement.style.setProperty(p, v); $$(".accent-picker button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.accent === (ACCENTS[k] ? k : "ember")))); };
  const saved = store.get("fc-accent"); if (saved && ACCENTS[saved]) applyAccent(saved);
  const wrap = $$(".lang-wrap").pop();
  if (wrap) {
    const box = el("div", "accent-picker"); box.setAttribute("role", "group"); box.setAttribute("aria-label", "Accent colour"); box.append(el("span", "", "Accent"));
    for (const [k, label] of [["ember", "Ember"], ["ocean", "Ocean"], ["lime", "Lime"]]) {
      const b = el("button"); b.type = "button"; b.dataset.accent = k; b.setAttribute("aria-label", label + " accent"); b.style.setProperty("--c", (ACCENTS[k] || {})["--red"] || "#e0313f"); b.setAttribute("aria-pressed", String((saved || "ember") === k));
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
  // ---- ranking: "fire client" = "fireclient", synonyms (boost -> fps), brand word is a bonus not a requirement ----
  const norm = s => String(s).toLowerCase().replace(/fire[\s-]+client/g, "fireclient").replace(/[^a-z0-9.\s]/g, " ").replace(/\s+/g, " ").trim();
  const STOP = new Set(["the", "a", "an", "how", "to", "for", "in", "of", "and", "on", "with", "my", "is", "do", "does", "i", "can", "you", "it", "minecraft", "all", "show"]);
  const SYN = { boost: ["fps", "performance", "faster", "lag", "smooth"], fps: ["performance", "boost"], lag: ["fps", "performance"], mod: ["mods", "modrinth", "fabric"], mods: ["mod", "modrinth", "fabric"],
    download: ["install", "installer", "setup"], install: ["installer", "setup", "download"], safe: ["safety", "virus", "malware", "trust"], virus: ["safe", "safety", "malware"], crash: ["crashing", "error", "fix"],
    skin: ["skins"], server: ["servers", "paper", "host"], lunar: ["alternative", "comparison", "vs"], alternative: ["lunar", "comparison"], java: ["jdk", "21"], hud: ["keystrokes", "cps"],
    mac: ["macos", "linux"], linux: ["mac", "macos"], free: ["price", "cost"], launcher: ["launch", "client"] };
  const PRIORITY = { "/download/": 12, "/blog/install-fireclient-windows/": 10, "/": 8, "/faq/": 8, "/blog/is-fireclient-safe/": 8, "/guides/": 6, "/screenshots/": 6 };
  const POPULAR = [["Download FireClient", "/download/"], ["Install FireClient in five steps", "/blog/install-fireclient-windows/"], ["Is FireClient safe?", "/blog/is-fireclient-safe/"], ["Set up the HUD", "/blog/fireclient-hud-setup-guide/"], ["Install Fabric mods from Modrinth", "/blog/install-fabric-mods-modrinth-minecraft-1-21-1/"], ["FireClient vs Lunar Client", "/blog/fireclient-vs-lunar-client/"]];
  const score = (it, toks) => {
    const t = norm(it.title), g = norm((it.tags || []).join(" ")), x = norm(it.excerpt || ""); let s = 0, matched = 0, needed = 0;
    for (const k of toks) {
      const alts = [k, ...(SYN[k] || [])]; let best = 0;
      for (const alt of alts) { const w = alt === k ? 1 : .5; let h = 0; if (t.includes(alt)) h += 5; if (g.includes(alt)) h += 3; if (x.includes(alt)) h += 1; best = Math.max(best, h * w); }
      if (k === "fireclient") { s += Math.min(best, 1); continue; }      // the brand appears everywhere, so it only breaks ties
      needed++; if (!best) return 0; matched++; s += best;
    }
    if (needed === 0) s += 1;                                            // brand-only search: priority pages decide the order
    return s + (PRIORITY[it.url] || 0) * (needed === 0 ? 1 : .3);
  };
  const row = (title, href, sub) => { const li = el("li"), a = el("a"); a.href = href; a.append(el("b", "", title)); if (sub) a.append(el("span", "", sub)); li.append(a); return li; };
  const footer = () => { const li = el("li", "s-all"); const a = el("a"); a.href = "/guides/"; a.append(el("b", "", "Browse all guides, tools and pages \u2192")); li.append(a); return li; };
  const render = () => {
    list.replaceChildren(); const q = norm(input.value);
    if (!q) { list.append(el("li", "s-none", "Popular")); POPULAR.forEach(([t, h]) => list.append(row(t, h))); list.append(footer()); return; }
    if (!index) { list.append(el("li", "s-none", "Loading\u2026")); return; }
    const wantsAll = /(^| )(all|everything|browse|index|allow)( |$)/.test(q);           // "show all", "all", "browse": the index comes first
    const toks = q.split(" ").filter(k => k && !STOP.has(k) && k !== "allow" && k !== "everything" && k !== "browse" && k !== "index"), use = toks.length ? toks : ["fireclient"];
    const res = index.map(it => [score(it, use), it]).filter(r => r[0]).sort((a, b) => b[0] - a[0]).slice(0, 8);
    if (!res.length) { list.append(el("li", "s-none", "No exact match. Try one of these:")); POPULAR.forEach(([t, h]) => list.append(row(t, h))); list.append(footer()); return; }
    if (wantsAll && !toks.length) { list.append(row("Guides index: every guide and tool by topic", "/guides/", "All articles, free tools and release news in one place")); }
    for (const [, it] of res) if (!(wantsAll && !toks.length && it.url === "/guides/")) list.append(row(it.title, it.url, it.excerpt || ""));
    list.append(footer());
  };
  const close = () => { if (overlay) overlay.hidden = true; document.body.classList.remove("s-open"); };
  const open = () => {
    if (!overlay) {
      overlay = el("div", "s-overlay"); overlay.hidden = true; overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true"); overlay.setAttribute("aria-label", "Search FireClient");
      const box = el("div", "s-box"); input = el("input"); input.type = "search"; input.placeholder = "Search guides, tools and pages"; input.setAttribute("aria-label", "Search");
      list = el("ul", "s-results"); box.append(input, list, el("p", "s-hint", "Press Esc to close")); overlay.append(box); document.body.append(overlay);
      overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
      input.addEventListener("input", () => { render(); });
      input.addEventListener("focus", () => { if (!input.value) render(); });
      input.addEventListener("keydown", e => { const links = $$("a", list); if (e.key === "ArrowDown" && links[0]) { e.preventDefault(); links[0].focus(); } if (e.key === "Enter" && links[0]) links[0].click(); });
      list.addEventListener("keydown", e => { const links = $$("a", list), i = links.indexOf(document.activeElement); if (e.key === "ArrowDown" && links[i + 1]) { e.preventDefault(); links[i + 1].focus(); } if (e.key === "ArrowUp") { e.preventDefault(); (links[i - 1] || input).focus(); } });
    }
    overlay.hidden = false; document.body.classList.add("s-open"); input.focus(); render(); load().then(render);
  };
  const header = $(".site-header");
  if (header) {
    const b = el("button", "s-btn"); b.type = "button"; b.setAttribute("aria-label", "Search the site (press /)"); b.title = "Search (press /)";
    b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span class="s-label">Search</span><kbd aria-hidden="true">/</kbd>';
    b.addEventListener("click", open); const t = $(".menu-toggle", header); t ? header.insertBefore(b, t) : header.append(b);
  }
  $$("[data-open-search]").forEach(b => b.addEventListener("click", open));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
    if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { e.preventDefault(); open(); }
  });
})();
