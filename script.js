/* ==========================================================================
   FireClient website — vanilla JS, no dependencies
   ==========================================================================
   EDIT THIS BLOCK to change download links, release info, Discord and social
   links. Nothing else in this file needs to change for a normal release.
   ========================================================================== */
const CONFIG = {
  // Windows installer. A relative path (served from this site) or a full https URL.
  // Leave `url` empty ("") to show "Download Coming Soon".
  windows: {
    url: "https://github.com/untitledinfo/fireclient-launcher/releases/download/v1.0/FireClient-Setup.exe",
    version: "1.0",
    date: "",                 // "YYYY-MM-DD" or "" if not published
    sizeBytes: 0,             // exact file size in bytes, or 0 if unknown
    sha256: ""                // add the SHA-256 of FireClient-Setup.exe if you want it shown
  },

  // Optional. Leave url empty to show "Not available".
  macos: { url: "" },
  linux: { url: "" },

  // Optional GitHub Releases integration. Set repo to "owner/name" to read the
  // latest release (installer .exe asset + changelog) from the public GitHub API.
  // If the request fails, the page falls back to the values above and changelog.js.
  github: {
    repo: "untitledinfo/fireclient-launcher",
    includePrereleases: true,
    assetPattern: "\\.exe$",          // regex source used to pick the Windows asset
    cacheMinutes: 10
  },

  // Optional "view releases" page when no repo is set (e.g. a GitHub releases URL).
  releasesUrl: "",

  // Live Discord numbers. Uses the public invite API, so you only need the invite code
  // (the part after discord.gg/). The invite must be permanent (never expires).
  // If the request fails, the numbers are simply hidden. Nothing is faked.
  discord: {
    invite: "pmGNwQBPC",
    refreshSeconds: 60
  },

  // Community and social links. Empty strings are hidden.
  social: {
    discord: "https://discord.gg/pmGNwQBPC",
    github: "https://github.com/untitledinfo/fireclient-launcher",
    youtube: "",
    x: ""
  }
};

/* ==========================================================================
   Helpers
   ========================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const weakDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
                   (navigator.deviceMemory && navigator.deviceMemory <= 4);

document.documentElement.classList.add("js");

function formatBytes(n) {
  if (!n || n < 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return (i === 0 ? n : n.toFixed(1)) + " " + units[i];
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// Returns a safe absolute href or "" (http, https and file only; remote data must be https).
function safeUrl(value, { httpsOnly = false } = {}) {
  if (!value) return "";
  try {
    const u = new URL(value, window.location.href);
    if (httpsOnly) return u.protocol === "https:" ? u.href : "";
    return ["http:", "https:", "file:"].includes(u.protocol) ? u.href : "";
  } catch { return ""; }
}

let toastTimer;
function toast(message) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

/* Small safe cache (localStorage can throw in private modes) */
const cache = {
  get(key, maxAgeMs) {
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      if (raw && Date.now() - raw.t < maxAgeMs) return raw.v;
    } catch { /* ignore */ }
    return null;
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value })); } catch { /* ignore */ }
  }
};

/* ==========================================================================
   Navigation: header state, mobile menu, active section
   ========================================================================== */
function initNav() {
  const header = $("#site-header");
  const toggle = $(".menu-toggle");
  const nav = $("#site-nav");
  if (!header || !toggle || !nav) return;

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setOpen = open => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    nav.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });

  const links = $$("[data-nav]", nav).filter(a => a.getAttribute("href").startsWith("#") && !a.classList.contains("btn"));
  const map = new Map();
  links.forEach(a => { const s = $(a.getAttribute("href")); if (s) map.set(s, a); });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(l => l.removeAttribute("aria-current"));
        map.get(en.target).setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, section) => io.observe(section));
  }
}

/* ==========================================================================
   Embers: square sparks like the in-game title screen (decorative, cheap)
   ========================================================================== */
function initEmbers() {
  const canvas = $("#embers");
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const count = weakDevice ? 22 : 46;
  let w = 0, h = 0, dpr = 1, running = true, parts = [];

  const spawn = (initial) => ({
    x: Math.random() * w,
    y: initial ? Math.random() * h : h + 10,
    s: 2 + Math.random() * 3,
    v: 14 + Math.random() * 30,
    d: (Math.random() - .5) * 10,
    a: .25 + Math.random() * .6,
    hue: Math.random() < .25 ? "255,122,114" : "232,51,63"
  });
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    parts = Array.from({ length: count }, () => spawn(true));
  };
  resize();
  window.addEventListener("resize", resize);

  let last = performance.now();
  const frame = now => {
    const dt = Math.min((now - last) / 1000, .05); last = now;
    if (running) {
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p, i) => {
        p.y -= p.v * dt; p.x += p.d * dt;
        if (p.y < -10) parts[i] = spawn(false);
        ctx.fillStyle = `rgba(${p.hue},${p.a})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      });
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => { running = en.isIntersecting; }).observe(canvas);
  }
}

/* ==========================================================================
   FAQ accordion
   ========================================================================== */
function initFaq() {
  $$(".faq-q").forEach(btn => btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    btn.closest(".faq-item").classList.toggle("open", !open);
  }));
}

/* ==========================================================================
   In-game viewer: tabs + lightbox
   ========================================================================== */
function initViewer() {
  const viewer = $("#viewer");
  if (!viewer) return;
  const tabs = $$('[role="tab"]', viewer);
  const panels = tabs.map(t => $("#" + t.getAttribute("aria-controls")));
  const shots = $$(".shot", viewer);
  const title = $("#viewer-title");

  const select = (i, focus) => {
    tabs.forEach((t, n) => {
      const on = n === i;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[n].hidden = !on;
      shots[n].classList.toggle("is-active", on);
    });
    if (title) title.textContent = shots[i].dataset.title || "FireClient";
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i));
    t.addEventListener("keydown", e => {
      const k = e.key;
      if (k === "ArrowRight" || k === "ArrowDown") { e.preventDefault(); select((i + 1) % tabs.length, true); }
      else if (k === "ArrowLeft" || k === "ArrowUp") { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      else if (k === "Home") { e.preventDefault(); select(0, true); }
      else if (k === "End") { e.preventDefault(); select(tabs.length - 1, true); }
    });
  });

  // Lightbox
  const box = $("#lightbox");
  const stage = $("#lb-stage");
  const caption = $("#lb-caption");
  let index = 0, opener = null;

  const show = i => {
    index = (i + shots.length) % shots.length;
    const s = shots[index];
    const img = document.createElement("img");
    img.src = s.dataset.full;
    img.alt = $("img", s).alt;
    stage.replaceChildren(img);
    caption.textContent = s.dataset.caption || "";
    select(index);
  };
  const open = i => {
    opener = document.activeElement;
    box.hidden = false;
    document.body.classList.add("lb-open");
    show(i);
    $(".lb-close", box).focus();
  };
  const close = () => {
    box.hidden = true;
    document.body.classList.remove("lb-open");
    stage.replaceChildren();
    if (opener && opener.focus) opener.focus();
  };
  shots.forEach((s, i) => s.addEventListener("click", () => open(i)));
  $(".lb-close", box).addEventListener("click", close);
  $(".lb-prev", box).addEventListener("click", () => show(index - 1));
  $(".lb-next", box).addEventListener("click", () => show(index + 1));
  box.addEventListener("click", e => { if (e.target === box || e.target === stage) close(); });
  document.addEventListener("keydown", e => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(index - 1);
    else if (e.key === "ArrowRight") show(index + 1);
    else if (e.key === "Tab") {
      const f = $$("button", box);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ==========================================================================
   Discord: live online and member counts from the public invite API
   ========================================================================== */
function animateNumber(el, to) {
  const fmt = n => n.toLocaleString();
  const from = Number((el.dataset.value || "0"));
  el.dataset.value = String(to);
  if (reduceMotion || from === to) { el.textContent = fmt(to); return; }
  const start = performance.now(), dur = 700;
  const step = now => {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(Math.round(from + (to - from) * eased));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initDiscord() {
  const code = (CONFIG.discord.invite || "").trim();
  if (!/^[\w-]{2,32}$/.test(code)) return;
  const url = `https://discord.com/api/v10/invites/${code}?with_counts=true`;
  const key = `fc:discord:${code}`;
  const live = $("[data-discord-live]");
  const stats = $("[data-discord-stats]");
  const card = $("#discord-card");

  const render = d => {
    $$('[data-discord="online"]').forEach(el => animateNumber(el, d.online));
    $$('[data-discord="members"]').forEach(el => animateNumber(el, d.members));
    const name = $('[data-discord="name"]');
    if (name && d.name) { name.textContent = d.name; name.hidden = false; }
    if (live) live.hidden = false;
    if (stats) stats.hidden = false;
    if (card) card.dataset.state = "live";
  };

  const load = async () => {
    const hit = cache.get(key, 45000);
    if (hit) { render(hit); return; }
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const online = Number(data.approximate_presence_count);
      const members = Number(data.approximate_member_count);
      if (!Number.isFinite(online) || !Number.isFinite(members)) throw new Error("bad data");
      const d = { online, members, name: data.guild && data.guild.name ? String(data.guild.name) : "" };
      cache.set(key, d);
      render(d);
    } catch {
      // Keep whatever is already on screen; if nothing was shown, the blocks stay hidden.
    }
  };
  load();
  const every = Math.max(30, Number(CONFIG.discord.refreshSeconds) || 60) * 1000;
  setInterval(() => { if (!document.hidden) load(); }, every);
}

/* ==========================================================================
   Release data: GitHub Releases (optional) or the local configuration
   ========================================================================== */
const releaseState = { release: null, releases: [], error: "" };

async function fetchGithubReleases(force) {
  const gh = CONFIG.github;
  if (!gh.repo || !/^[\w.-]+\/[\w.-]+$/.test(gh.repo)) return null;
  const key = `fc:releases:${gh.repo}`;
  if (!force) {
    const hit = cache.get(key, gh.cacheMinutes * 60000);
    if (hit) return hit;
  }
  const res = await fetch(`https://api.github.com/repos/${gh.repo}/releases?per_page=10`, {
    headers: { Accept: "application/vnd.github+json" }
  });
  if (!res.ok) throw new Error(res.status === 403 ? "GitHub rate limit reached. Try again later." : `GitHub returned ${res.status}.`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Unexpected response from GitHub.");
  const releases = data
    .filter(r => !r.draft && (gh.includePrereleases || !r.prerelease))
    .map(r => ({
      version: String(r.tag_name || r.name || "").replace(/^v/i, ""),
      date: r.published_at ? r.published_at.slice(0, 10) : "",
      body: typeof r.body === "string" ? r.body : "",
      url: r.html_url,
      assets: (r.assets || []).map(a => ({
        name: a.name, size: a.size, url: a.browser_download_url,
        sha256: typeof a.digest === "string" && a.digest.startsWith("sha256:") ? a.digest.slice(7) : ""
      }))
    }));
  cache.set(key, releases);
  return releases;
}

function pickWindowsAsset(release) {
  let re;
  try { re = new RegExp(CONFIG.github.assetPattern, "i"); } catch { re = /\.exe$/i; }
  return release.assets.find(a => re.test(a.name)) || null;
}

async function resolveRelease(force = false) {
  releaseState.error = "";
  const cfg = CONFIG.windows;
  const releasesUrl = CONFIG.github.repo ? `https://github.com/${CONFIG.github.repo}/releases` : CONFIG.releasesUrl;

  // 1) GitHub
  if (CONFIG.github.repo) {
    try {
      const releases = await fetchGithubReleases(force);
      releaseState.releases = releases || [];
      const latest = releaseState.releases[0];
      if (latest) {
        const asset = pickWindowsAsset(latest);
        if (asset && safeUrl(asset.url, { httpsOnly: true })) {
          return { state: "ready", source: "github", version: latest.version, date: latest.date,
                   size: asset.size, sha256: asset.sha256, url: safeUrl(asset.url, { httpsOnly: true }), releasesUrl };
        }
        return { state: "unavailable", source: "github", version: latest.version, date: latest.date,
                 reason: "The latest release has no Windows installer attached yet.", releasesUrl };
      }
      return { state: "unavailable", source: "github", reason: "No releases have been published yet.", releasesUrl };
    } catch (err) {
      releaseState.error = err && err.message ? err.message : "Could not reach GitHub.";
      // fall through to the local configuration
    }
  }

  // 2) Local configuration
  const url = safeUrl(cfg.url);
  if (!url) {
    return { state: releaseState.error ? "error" : "unavailable", source: "config",
             reason: releaseState.error || "No installer is configured for this site yet.", releasesUrl };
  }
  const base = { source: "config", version: cfg.version, date: cfg.date, size: cfg.sizeBytes, sha256: cfg.sha256, url, releasesUrl };

  // Confirm the file exists when served over http(s). Opened from disk, it cannot be checked.
  const sameOrigin = (() => { try { return new URL(url).origin === location.origin; } catch { return false; } })();
  if (!sameOrigin) return { ...base, state: "ready" };
  if (location.protocol === "http:" || location.protocol === "https:") {
    try {
      const res = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (!res.ok) return { ...base, state: "unavailable", url: "", reason: `The installer file was not found on this server (${res.status}).` };
      return { ...base, state: "ready" };
    } catch {
      return { ...base, state: "error", reason: "Could not check the installer. Check your connection and retry." };
    }
  }
  return { ...base, state: "ready", unverified: true };
}

/* ==========================================================================
   Download UI
   ========================================================================== */
function renderDownload(info) {
  const card = $("#dl-card");
  const state = info.state;
  card.dataset.state = state;

  const stateEl = $("#dl-state");
  const button = $("#dl-button");
  const retry = $("#dl-retry");
  const releases = $("#dl-releases");
  const ready = state === "ready";

  // Facts
  const sizeText = formatBytes(info.size);
  const dateText = formatDate(info.date);
  $$('[data-bind="version"]').forEach(el => { el.textContent = info.version ? "v" + info.version : "—"; });
  $$('[data-bind="size"]').forEach(el => { el.textContent = sizeText || "—"; });
  $$('[data-bind="date"]').forEach(el => { el.textContent = dateText || "Not published"; });
  const sizeWrap = $('[data-bind-wrap="size"]');
  if (sizeWrap) sizeWrap.hidden = !(ready && sizeText);
  const winChip = $("[data-win-chip]");
  if (winChip) winChip.hidden = !ready;

  // Status message
  if (state === "ready") {
    stateEl.textContent = info.unverified
      ? "Installer configured. (The file cannot be checked when this page is opened from disk.)"
      : (info.source === "github" ? "Latest release from GitHub." : "Installer available.");
  } else if (state === "error") {
    stateEl.textContent = info.reason || "Could not load release information.";
  } else {
    stateEl.textContent = info.reason || "Not available yet.";
  }

  // Download links (hero + download card)
  $$("[data-download-link]").forEach(a => {
    const label = $("[data-download-label]", a);
    if (ready) {
      a.href = info.url;
      a.setAttribute("download", "");
      a.rel = "nofollow noopener";
      a.removeAttribute("aria-disabled");
      if (label) label.textContent = a === button ? "Download for Windows" : "Download FireClient";
    } else {
      a.removeAttribute("download");
      a.href = "#download";
      if (label) label.textContent = state === "loading" ? "Download FireClient" : "Download Coming Soon";
      if (a === button) a.setAttribute("aria-disabled", "true");
    }
  });

  // Releases link and retry
  const relUrl = safeUrl(info.releasesUrl, { httpsOnly: true });
  releases.hidden = !relUrl || ready;
  if (relUrl) releases.href = relUrl;
  retry.hidden = state !== "error";

  // Hash
  const hashBox = $("#hash-box");
  hashBox.hidden = !(ready && info.sha256);
  if (info.sha256) $("#sha-value").textContent = info.sha256;

  // OS list
  const win = $("#os-win");
  win.textContent = ready ? "Available" : (state === "loading" ? "Checking…" : (state === "error" ? "Check failed" : "Coming soon"));
  win.className = "badge " + (ready ? "badge-ok" : "badge-soon");
  [["#os-mac", CONFIG.macos.url], ["#os-linux", CONFIG.linux.url]].forEach(([sel, url]) => {
    const el = $(sel);
    const href = safeUrl(url);
    if (href && !el.querySelector("a")) {
      el.className = "badge badge-ok";
      el.textContent = "";
      const a = document.createElement("a");
      a.href = href; a.textContent = "Download"; a.setAttribute("download", "");
      el.appendChild(a);
    }
  });
}

function initDownload() {
  const load = async force => {
    renderDownload({ state: "loading", reason: "Checking release…" });
    const info = await resolveRelease(force);
    renderDownload(info);
    renderChangelog();
  };
  $("#dl-retry").addEventListener("click", () => load(true));
  $("#changelog-retry").addEventListener("click", () => load(true));

  $$("[data-download-link]").forEach(a => a.addEventListener("click", e => {
    if (a.getAttribute("aria-disabled") === "true") { e.preventDefault(); return; }
    if (a.hasAttribute("download")) {
      const t = $("#dl-thanks"); if (t) t.hidden = false;
      toast("Thanks for downloading FireClient! Run the installer when it finishes.");
    }
  }));

  $("#copy-hash").addEventListener("click", async e => {
    const btn = e.currentTarget;
    const text = $("#sha-value").textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Copied";
    } catch {
      const range = document.createRange();
      range.selectNodeContents($("#sha-value"));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      btn.textContent = "Press Ctrl+C";
    }
    setTimeout(() => { btn.textContent = "Copy"; }, 1800);
  });

  load(false);
}

/* ==========================================================================
   Changelog (GitHub if configured and reachable, otherwise changelog.js)
   ========================================================================== */
function releaseCard(r) {
  const card = document.createElement("article");
  card.className = "card release";
  const head = document.createElement("div");
  head.className = "release-head";
  const h3 = document.createElement("h3");
  h3.textContent = r.version ? "v" + r.version : "Release";
  const date = document.createElement("span");
  date.className = "release-date";
  date.textContent = formatDate(r.date) || "Date not published";
  head.append(h3, date);
  card.appendChild(head);

  const section = (title, list) => {
    if (!list || !list.length) return;
    const h4 = document.createElement("h4");
    h4.textContent = title;
    const ul = document.createElement("ul");
    list.forEach(t => { const li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
    card.append(h4, ul);
  };
  section("New", r.features);
  section("Fixes", r.fixes);
  section("Known issues", r.known);
  if (r.notes) section("Notes", r.notes);
  if (!r.features?.length && !r.fixes?.length && !r.known?.length && !r.notes?.length) {
    const p = document.createElement("p");
    p.className = "release-date";
    p.textContent = "No notes were published for this release.";
    card.appendChild(p);
  }
  return card;
}

function githubNotes(body) {
  // Plain text only: strip markdown markers, never inject HTML.
  return body.split(/\r?\n/).map(l => l.replace(/^[#>*\-\s]+/, "").replace(/[*_`]/g, "").trim()).filter(Boolean).slice(0, 20);
}

function renderChangelog() {
  const list = $("#changelog-list");
  const source = $("#changelog-source");
  const retry = $("#changelog-retry");
  list.replaceChildren();
  retry.hidden = true;

  let entries = [];
  if (releaseState.releases.length) {
    entries = releaseState.releases.map(r => ({ version: r.version, date: r.date, notes: githubNotes(r.body) }));
    source.textContent = "Loaded from GitHub Releases.";
  } else {
    entries = Array.isArray(window.FIRECLIENT_CHANGELOG) ? window.FIRECLIENT_CHANGELOG : [];
    source.textContent = releaseState.error
      ? `Showing the local changelog. GitHub could not be reached: ${releaseState.error}`
      : "Release notes are kept in changelog.js.";
    retry.hidden = !releaseState.error;
  }

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "changelog-empty";
    empty.textContent = "No releases have been published yet.";
    list.appendChild(empty);
  } else {
    entries.forEach(r => list.appendChild(releaseCard(r)));
  }
  list.setAttribute("aria-busy", "false");
}

/* ==========================================================================
   Community links
   ========================================================================== */
function initCommunity() {
  const wrap = $("#community-links");
  const labels = { discord: "Join Discord", github: "GitHub", youtube: "YouTube", x: "X / Twitter" };
  const discord = safeUrl(CONFIG.social.discord, { httpsOnly: true });
  const main = $("#link-discord");
  if (discord) main.href = discord; else main.remove();

  Object.entries(CONFIG.social).forEach(([key, value]) => {
    if (key === "discord") return;
    const href = safeUrl(value, { httpsOnly: true });
    if (!href) return;
    const a = document.createElement("a");
    a.className = "btn btn-ghost btn-lg";
    a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.textContent = labels[key] || key;
    wrap.appendChild(a);
  });
  // The hero Discord pill and the Discord card use the same invite link.
  $$("[data-discord-live] a").forEach(a => { if (discord) a.href = "#community"; });
}

/* ==========================================================================
   Boot
   ========================================================================== */
function boot() {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
  initNav();
  initEmbers();
  initFaq();
  initViewer();
  initCommunity();
  initDiscord();
  initDownload();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
