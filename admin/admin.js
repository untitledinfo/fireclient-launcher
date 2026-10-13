/* FireClient admin: edits content/posts.json in your GitHub repo and publishes generated pages in one commit.
   No server. The access token stays in this browser and is only sent to api.github.com. */
import { ADMIN_USERS } from "/admin/config.js";
import { buildSite, injectHome, md, slugify, words, plain, esc, TYPES, SITE, titleOf, postUrl } from "/lib/render.mjs";

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const S = { repo: "", branch: "", token: "", posts: [], base: [], sha: null, sel: null, assets: new Map(), q: "", flt: "all" };
const today = () => new Date().toISOString().slice(0, 10);
const clone = o => JSON.parse(JSON.stringify(o));
const say = m => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(say.t); say.t = setTimeout(() => t.classList.remove("show"), 3200); };
const wipKey = () => `fc-admin-wip:${S.repo}@${S.branch}`;

/* ---------- GitHub API ---------- */
async function gh(path, opt = {}) {
  const r = await fetch("https://api.github.com" + path, { ...opt, headers: { Authorization: `Bearer ${S.token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(opt.body ? { "Content-Type": "application/json" } : {}) } });
  if (!r.ok) { let m = ""; try { m = (await r.json()).message; } catch {} const e = new Error(`GitHub ${r.status}: ${m || r.statusText}`); e.status = r.status; throw e; }
  return r.status === 204 ? null : r.json();
}
const b64dec = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g, "")), c => c.charCodeAt(0)));
async function loadPosts() {
  try {
    let f = await gh(`/repos/${S.repo}/contents/content/posts.json?ref=${encodeURIComponent(S.branch)}`);
    if (!f.content) f = { ...f, content: (await gh(`/repos/${S.repo}/git/blobs/${f.sha}`)).content };
    S.sha = f.sha; return JSON.parse(b64dec(f.content)).posts || [];
  } catch (e) { if (e.status === 404) { S.sha = null; return []; } throw e; }
}

/* ---------- Login ---------- */
const cfg = JSON.parse(localStorage.getItem("fc-admin-cfg") || "{}");
$("#l-repo").value = cfg.repo || "untitledinfo/fireclient-launcher"; $("#l-branch").value = cfg.branch || "";
localStorage.removeItem("fc-admin-token");
const saved = sessionStorage.getItem("fc-admin-token") || "";
if (saved) $("#l-token").value = saved;
$("#login-form").addEventListener("submit", async e => {
  e.preventDefault(); const err = $("#l-err"); err.hidden = true;
  S.repo = $("#l-repo").value.trim(); S.token = $("#l-token").value.trim();
  const btn = e.submitter; btn.disabled = true;
  try {
    const r = await gh(`/repos/${S.repo}`);
    if (r.permissions && !r.permissions.push) throw new Error("This token can read the repository but not write to it. Give it Contents: Read and write.");
    const me = await gh("/user"), allow = (ADMIN_USERS.length ? ADMIN_USERS : [r.owner.login]).map(x => x.toLowerCase());
    if (!allow.includes(me.login.toLowerCase())) { S.token = ""; sessionStorage.removeItem("fc-admin-token"); throw new Error(`Only the site owner can use this admin. You are signed in as @${me.login}.`); }
    S.user = me.login;
    S.branch = $("#l-branch").value.trim() || r.default_branch;
    S.posts = await loadPosts(); S.base = clone(S.posts);
    localStorage.setItem("fc-admin-cfg", JSON.stringify({ repo: S.repo, branch: $("#l-branch").value.trim() }));
    sessionStorage.setItem("fc-admin-token", S.token);
    const wip = localStorage.getItem(wipKey());
    if (wip) { try { const w = JSON.parse(wip); if (JSON.stringify(w) !== JSON.stringify(S.posts)) { S.posts = w; say("Restored your unpublished edits."); } } catch {} }
    $("#login").hidden = true; $("#app").hidden = false; $("#repo-chip").textContent = `${S.repo} · ${S.branch} · @${S.user}`; idle();
    renderList(); refresh();
  } catch (x) { err.textContent = x.status === 401 ? "GitHub rejected the token. Check that it has not expired." : x.status === 404 ? "Repository not found, or the token has no access to it." : x.message; err.hidden = false; }
  btn.disabled = false;
});
$("#b-out").addEventListener("click", () => { if (pending() && !confirm("You have unpublished edits. They stay saved in this browser. Sign out?")) return; sessionStorage.removeItem("fc-admin-token"); localStorage.removeItem("fc-admin-token"); location.reload(); });

/* Sign out after 30 minutes without activity. Unpublished edits stay saved in this browser. */
function idle() { clearTimeout(idle.t); idle.t = setTimeout(() => { sessionStorage.removeItem("fc-admin-token"); alert("Signed out after 30 minutes of inactivity. Your unpublished edits are kept in this browser."); location.reload(); }, 30 * 60 * 1000); }
["input", "click", "keydown"].forEach(ev => addEventListener(ev, () => { if (!$("#app").hidden) idle(); }));

/* ---------- State ---------- */
const cur = () => S.posts.find(p => p.id === S.sel);
const pending = () => { const b = new Map(S.base.map(p => [p.id, JSON.stringify(p)])); let n = S.posts.filter(p => b.get(p.id) !== JSON.stringify(p)).length; for (const id of b.keys()) if (!S.posts.some(p => p.id === id)) n++; return n; };
function refresh() {
  const n = pending(), b = $("#b-publish"); b.disabled = !n; b.textContent = n ? `Publish ${n} change${n > 1 ? "s" : ""}` : "Publish";
  try { n ? localStorage.setItem(wipKey(), JSON.stringify(S.posts)) : localStorage.removeItem(wipKey()); } catch {}
}
addEventListener("beforeunload", e => { if (pending() && !$("#app").hidden) { e.preventDefault(); e.returnValue = ""; } });

function renderList() {
  const q = S.q.toLowerCase(), base = new Map(S.base.map(p => [p.id, JSON.stringify(p)]));
  const list = [...S.posts].filter(p => (S.flt === "all" || S.flt === p.type || (S.flt === "draft" && p.status === "draft")) && (!q || (p.title + " " + (p.tags || []).join(" ")).toLowerCase().includes(q))).sort((a, b) => (b.date > a.date ? 1 : -1));
  $("#plist").innerHTML = list.length ? list.map(p => `<li><button type="button" data-id="${p.id}" ${p.id === S.sel ? 'aria-current="true"' : ""}><span class="t">${esc(p.title || "Untitled")}</span><span class="m"><span>${TYPES[p.type].label}</span><span class="${p.status === "published" ? "st-live" : "st-draft"}">${p.status === "published" ? "Live" : "Draft"}</span><span>${esc(p.date)}</span>${base.get(p.id) !== JSON.stringify(p) ? '<span class="st-chg">Edited</span>' : ""}</span></button></li>`).join("") : `<li class="hint" style="color:var(--quiet);padding:8px">No posts match.</li>`;
}
$("#plist").addEventListener("click", e => { const b = e.target.closest("[data-id]"); if (b) select(b.dataset.id); });
$("#q").addEventListener("input", e => { S.q = e.target.value; renderList(); }); $("#flt").addEventListener("change", e => { S.flt = e.target.value; renderList(); });
$$("[data-new]").forEach(b => b.addEventListener("click", () => {
  const p = { id: crypto.randomUUID(), type: b.dataset.new, title: "", slug: "", excerpt: "", body: "", cover: "", tags: [], date: today(), updated: "", status: "draft", metaTitle: "", metaDescription: "", author: SITE.author };
  S.posts.push(p); select(p.id); $("#f-title").focus(); refresh();
}));

/* ---------- Editor ---------- */
function select(id) {
  S.sel = id; const p = cur(); $("#empty").hidden = true; $("#form").hidden = false; setTab("write");
  $("#f-type").value = p.type; $("#f-status").value = p.status; $("#f-date").value = p.date; $("#f-title").value = p.title; $("#f-slug").value = p.slug;
  $("#f-excerpt").value = p.excerpt; $("#f-cover").value = p.cover; $("#f-tags").value = (p.tags || []).join(", "); $("#f-body").value = p.body; $("#f-mt").value = p.metaTitle || ""; $("#f-md").value = p.metaDescription || "";
  sync(); renderList();
}
const bind = (sel, fn) => $(sel).addEventListener("input", e => { const p = cur(); if (!p) return; fn(p, e.target.value); sync(); renderList(); refresh(); });
bind("#f-type", (p, v) => p.type = v); bind("#f-status", (p, v) => p.status = v); bind("#f-date", (p, v) => p.date = v);
bind("#f-title", (p, v) => { if (p.status === "draft" && (!p.slug || p.slug === slugify(p.title))) { p.slug = slugify(v); $("#f-slug").value = p.slug; } p.title = v; });
bind("#f-slug", (p, v) => p.slug = slugify(v)); bind("#f-excerpt", (p, v) => p.excerpt = v); bind("#f-cover", (p, v) => p.cover = v.trim());
bind("#f-tags", (p, v) => p.tags = v.split(",").map(t => t.trim().toLowerCase()).filter(Boolean)); bind("#f-body", (p, v) => p.body = v); bind("#f-mt", (p, v) => p.metaTitle = v); bind("#f-md", (p, v) => p.metaDescription = v);
$("#f-slug").addEventListener("blur", e => { e.target.value = cur()?.slug || ""; });

function sync() {
  const p = cur(); if (!p) return;
  $("#f-url").textContent = `${SITE.url}/${TYPES[p.type].dir}/${p.slug || "…"}/`;
  const cp = $("#cover-prev"), a = S.assets.get((p.cover || "").replace(/^\//, "")); cp.hidden = !p.cover; if (p.cover) cp.src = a ? a.url : p.cover;
  const live = S.base.find(x => x.id === p.id && x.status === "published"); const v = $("#b-view"); v.hidden = !live; if (live) v.href = SITE.url + postUrl(live);
  seo(p); if (!$("#preview").hidden) preview();
}
function setTab(t) { $$(".ed-tabs [data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === t)); $("#f-body").hidden = t !== "write"; $("#tools").hidden = t !== "write"; $("#preview").hidden = t !== "preview"; if (t === "preview") preview(); }
$$(".ed-tabs [data-tab]").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
function preview() {
  let h = md(cur().body).html; for (const [path, a] of S.assets) h = h.split(`src="/${path}"`).join(`src="${a.url}"`);
  $("#preview").innerHTML = h || '<p style="color:var(--quiet)">Nothing to preview yet.</p>';
}

/* Toolbar */
const body = () => $("#f-body"), fire = () => { body().dispatchEvent(new Event("input", { bubbles: true })); body().focus(); };
function wrap(a, b = a, ph = "text") { const t = body(), s = t.selectionStart, e = t.selectionEnd; t.setRangeText(a + (t.value.slice(s, e) || ph) + b, s, e, "select"); fire(); }
function prefix(p) { const t = body(), s = t.value.lastIndexOf("\n", t.selectionStart - 1) + 1; t.setRangeText(p, s, s, "end"); fire(); }
const pick = () => new Promise(r => { const i = document.createElement("input"); i.type = "file"; i.accept = "image/*"; i.onchange = () => r(i.files[0]); i.click(); });
async function upload(file) {
  const bmp = await createImageBitmap(file), w = Math.min(1600, bmp.width), c = document.createElement("canvas"); c.width = w; c.height = Math.round(bmp.height * w / bmp.width);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise(r => c.toBlob(r, "image/webp", .86)), data = await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result.split(",")[1]); f.readAsDataURL(blob); });
  const path = `assets/blog/${Date.now().toString(36)}-${slugify(file.name.replace(/\.[^.]+$/, "")) || "image"}.webp`;
  S.assets.set(path, { data, url: URL.createObjectURL(blob) }); return "/" + path;
}
$("#tools").addEventListener("click", async e => {
  const t = e.target.closest("[data-t]")?.dataset.t; if (!t) return;
  if (t === "h2") prefix("## "); else if (t === "b") wrap("**"); else if (t === "i") wrap("*"); else if (t === "ul") prefix("- "); else if (t === "q") prefix("> ");
  else if (t === "code") wrap("`"); else if (t === "a") { const u = prompt("Link address (https://… or /page/)"); if (u) wrap("[", `](${u})`, "link text"); }
  else if (t === "img") { const f = await pick(); if (!f) return; try { const p = await upload(f); const alt = prompt("Describe the image for screen readers and search", "") ?? ""; wrap(`![${alt}](${p})`, "", ""); say("Image added. It uploads when you publish."); } catch { say("Could not read that image."); } }
});
$("#b-cover").addEventListener("click", async () => { const f = await pick(); if (!f) return; try { const p = await upload(f); $("#f-cover").value = p; $("#f-cover").dispatchEvent(new Event("input", { bubbles: true })); say("Cover added. It uploads when you publish."); } catch { say("Could not read that image."); } });
$("#b-del").addEventListener("click", () => { const p = cur(); if (!p || !confirm(`Delete "${p.title || "Untitled"}"? The live page is removed when you publish.`)) return; S.posts = S.posts.filter(x => x.id !== p.id); S.sel = null; $("#form").hidden = true; $("#empty").hidden = false; renderList(); refresh(); });

/* ---------- SEO ---------- */
function seo(p) {
  const t = titleOf({ ...p, title: p.title || "Untitled" }), d = (p.metaDescription || p.excerpt || plain(p.body).slice(0, 155)).trim(), n = words(p.body), md_ = p.body || "";
  const cls = (v, lo, hi) => v >= lo && v <= hi ? "ok" : v ? "warn" : "bad";
  $("#c-mt").className = cls(t.length, 30, 60); $("#c-mt").textContent = `${t.length} characters with the site name. Aim for 30 to 60.`;
  $("#c-md").className = cls(d.length, 70, 160); $("#c-md").textContent = `${d.length} characters. Aim for 70 to 160.`;
  $("#s-url").textContent = `fireclient.net › ${TYPES[p.type].dir} › ${p.slug || "…"}`; $("#s-title").textContent = t.length > 60 ? t.slice(0, 58) + "…" : t; $("#s-desc").textContent = d.length > 160 ? d.slice(0, 157) + "…" : d;
  const imgs = [...md_.matchAll(/!\[([^\]]*)\]\(/g)], min = p.type === "news" ? 120 : 300;
  const C = [
    [t.length >= 30 && t.length <= 60, "Title tag is 30 to 60 characters", "Edit the meta title."],
    [d.length >= 70 && d.length <= 160, "Description is 70 to 160 characters", "Write a meta description or summary of that length."],
    [p.slug.length >= 3 && p.slug.length <= 60, "Short, readable URL slug", "Use 3 to 60 characters of plain words."],
    [!!p.cover, "Cover image set", "It becomes the social share image."],
    [n >= min, `At least ${min} words (${n} now)`, "Longer, useful posts rank better."],
    [(md_.match(/^##\s/gm) || []).length >= (n > 300 ? 2 : 0), "Subheadings break up the text", "Add H2 headings."],
    [/\]\((\/(?!\/)|https?:\/\/fireclient\.net)/.test(md_), "Links to another page on the site", "Link a related post or the download section."],
    [imgs.every(m => m[1].trim()), "Every image has alt text", "Describe each image."],
    [(p.tags || []).length > 0, "Has at least one tag", "Tags feed related posts and keywords."]];
  $("#score").textContent = Math.round(C.filter(c => c[0]).length / C.length * 100);
  $("#checks").innerHTML = C.map(([ok, a, b]) => `<li><span class="${ok ? "ok" : "warn"}">${ok ? "✓" : "!"}</span><span>${a}${ok ? "" : `<small>${b}</small>`}</span></li>`).join("");
}

/* ---------- Publish ---------- */
async function publish() {
  const b = $("#b-publish"), label = b.textContent; b.disabled = true;
  const step = m => { b.textContent = m; };
  try {
    const next = clone(S.posts), baseMap = new Map(S.base.map(p => [p.id, p]));
    for (const p of next) if (p.status === "published") {
      if (!p.title.trim() || !p.slug || !p.body.trim()) throw new Error(`"${p.title || "Untitled"}" needs a title, slug and text before it can go live. Save it as a draft or fill them in.`);
      if (next.some(x => x !== p && x.status === "published" && x.type === p.type && x.slug === p.slug)) throw new Error(`Two live ${p.type} posts use the slug "${p.slug}". Make each slug unique.`);
      const old = baseMap.get(p.id); if (old?.status === "published" && JSON.stringify({ ...old, updated: "" }) !== JSON.stringify({ ...p, updated: "" }) && p.date !== today()) p.updated = today();
    }
    step("Checking GitHub…");
    const head = (await gh(`/repos/${S.repo}/git/ref/heads/${encodeURIComponent(S.branch)}`)).object.sha, commit = await gh(`/repos/${S.repo}/git/commits/${head}`);
    let remote = null; try { remote = (await gh(`/repos/${S.repo}/contents/content/posts.json?ref=${encodeURIComponent(S.branch)}`)).sha; } catch (e) { if (e.status !== 404) throw e; }
    if (remote !== S.sha) throw new Error("Posts changed on GitHub since you signed in (another session or a manual edit). Sign out, sign in again and re-apply your edits.");
    step("Building pages…");
    const was = buildSite(S.base).files, now = buildSite(next).files, out = { ...now, "content/posts.json": JSON.stringify({ posts: next }, null, 2) + "\n" };
    try { const hr = await fetch(`https://api.github.com/repos/${S.repo}/contents/index.html?ref=${encodeURIComponent(S.branch)}`, { headers: { Authorization: `Bearer ${S.token}`, Accept: "application/vnd.github.raw+json" } });
      if (hr.ok) { const home = await hr.text(), upd = injectHome(home, buildSite(next).published); if (upd !== home) out["index.html"] = upd; } } catch {}
    const entries = [], jobs = [...Object.entries(out).map(([path, c]) => [path, { content: c, encoding: "utf-8" }]), ...[...S.assets].map(([path, a]) => [path, { content: a.data, encoding: "base64" }])];
    let done = 0, postsSha = null;
    for (let i = 0; i < jobs.length; i += 6) await Promise.all(jobs.slice(i, i + 6).map(async ([path, blob]) => {
      const r = await gh(`/repos/${S.repo}/git/blobs`, { method: "POST", body: JSON.stringify(blob) }); entries.push({ path, mode: "100644", type: "blob", sha: r.sha }); if (path === "content/posts.json") postsSha = r.sha; step(`Uploading ${++done}/${jobs.length}…`); }));
    for (const path of Object.keys(was)) if (!(path in now)) entries.push({ path, mode: "100644", type: "blob", sha: null });
    step("Committing…");
    const tree = await gh(`/repos/${S.repo}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: commit.tree.sha, tree: entries }) });
    const changed = next.filter(p => JSON.stringify(baseMap.get(p.id)) !== JSON.stringify(p)), msg = changed.length === 1 ? `content: ${baseMap.has(changed[0].id) ? "update" : "add"} "${changed[0].title || "Untitled"}"` : `content: update ${pending()} posts`;
    const nc = await gh(`/repos/${S.repo}/git/commits`, { method: "POST", body: JSON.stringify({ message: msg, tree: tree.sha, parents: [head] }) });
    await gh(`/repos/${S.repo}/git/refs/heads/${encodeURIComponent(S.branch)}`, { method: "PATCH", body: JSON.stringify({ sha: nc.sha }) });
    S.posts = next; S.base = clone(next); S.sha = postsSha; S.assets.clear(); localStorage.removeItem(wipKey());
    say("Published. GitHub Pages updates the site in about a minute."); if (S.sel && cur()) select(S.sel); else renderList();
  } catch (e) { say(e.message); alert(e.message); }
  b.textContent = label; refresh();
}
$("#b-publish").addEventListener("click", publish);
$("#b-dup").addEventListener("click", () => { const p = cur(); if (!p) return; const c = { ...clone(p), id: crypto.randomUUID(), title: p.title + " (copy)", slug: "", status: "draft", date: today(), updated: "" }; S.posts.push(c); select(c.id); refresh(); say("Duplicated as a draft."); });
$("#b-discord").addEventListener("click", async () => { const p = cur(); if (!p) return; if (!p.slug) return say("Add a slug first."); try { await navigator.clipboard.writeText(`**${p.title}**\n${p.excerpt}\n\n${SITE.url}${postUrl(p)}`); say("Discord announcement copied."); } catch { say("Copy failed."); } });
