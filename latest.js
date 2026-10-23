// Home page: shows the newest blog and news posts from content/latest.json. Stays hidden if the file is missing or empty.
(async () => {
  const sec = document.getElementById("latest"), grid = document.getElementById("latest-grid");
  if (!sec || !grid) return;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  try {
    const r = await fetch("/content/latest.json", { cache: "no-cache" }); if (!r.ok) return;
    const list = (await r.json()).slice(0, 3); if (!list.length) return;
    grid.innerHTML = list.map(p => `<a class="pcard" href="${esc(p.url)}">${p.cover ? `${/-960\.jpg$/.test(p.cover) ? `<picture><source srcset="${esc(p.cover.replace(/-960\.jpg$/, "-960.webp"))}" type="image/webp">` : ""}<img class="pcard-cover" src="${esc(p.cover)}" alt="" loading="lazy" decoding="async">${/-960\.jpg$/.test(p.cover) ? "</picture>" : ""}` : `<span class="pcard-cover pcard-ph" aria-hidden="true"><img src="assets/logo.svg" alt="" width="56" height="56"></span>`}<span class="pcard-body"><span class="pmeta"><b>${p.type === "news" ? "News" : "Blog"}</b><time datetime="${esc(p.date)}">${new Date(p.date + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time><span>${p.mins} min read</span></span><h3 class="pcard-title">${esc(p.title)}</h3><span class="pcard-ex">${esc(p.excerpt)}</span></span></a>`).join("");
    sec.hidden = false;
  } catch {}
})();
