(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const btn = $(".menu-toggle"), toast = $("#toast");
  btn?.addEventListener("click", () => { const o = document.body.classList.toggle("nav-open"); btn.setAttribute("aria-expanded", o); });
  const say = m => { if (!toast) return; toast.textContent = m; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200); };
  document.addEventListener("click", async e => { const b = e.target.closest("[data-copy]"); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); say("Link copied."); } catch { say("Copy failed. Select the address bar instead."); } });
  const bar = $("#read-bar"), art = $(".prose");
  if (bar && art) { const f = () => { const r = art.getBoundingClientRect(), t = r.height - innerHeight * .6; bar.style.transform = `scaleX(${Math.min(1, Math.max(0, -r.top / Math.max(t, 1)))})`; }; addEventListener("scroll", f, { passive: true }); f(); }
  const tools = $("[data-tools]");
  if (tools) { tools.hidden = false;
    const q = $("#pq"), cards = [...document.querySelectorAll(".pg-list .pcard")], none = $(".nomatch"); let tag = "";
    const run = () => { const v = q.value.trim().toLowerCase(); let n = 0;
      cards.forEach(c => { const ok = (!v || c.dataset.q.includes(v)) && (!tag || c.dataset.tags.split(",").includes(tag)); c.hidden = !ok; if (ok) n++; }); none.hidden = n > 0; };
    q.addEventListener("input", run);
    tools.addEventListener("click", e => { const b = e.target.closest("[data-tag]"); if (!b) return; const on = b.getAttribute("aria-pressed") !== "true";
      tools.querySelectorAll("[data-tag]").forEach(x => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", on); tag = on ? b.dataset.tag : ""; run(); }); }
  const links = [...document.querySelectorAll(".toc a")];
  if (links.length && "IntersectionObserver" in window) { const map = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.classList.remove("on")); map.get(e.target.id)?.classList.add("on"); } }), { rootMargin: "-20% 0px -70% 0px" });
    map.forEach((_, id) => { const h = document.getElementById(id); h && io.observe(h); }); }
})();
