// Language suggestion. Never redirects (so search engines and people always get the page they asked for).
// Reads the browser language list only; nothing is sent anywhere. Dismissal is remembered in this browser.
(() => {
  try {
    const links = [...document.querySelectorAll(".lang-picker a[hreflang]")];
    if (!links.length || localStorage.getItem("fc-lang-dismissed")) return;
    const here = location.pathname.replace(/index\.html$/, "");
    if (here !== "/" && !links.some(a => a.getAttribute("href") === here)) return;
    const cur = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    const prefs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"]).map(l => String(l).slice(0, 2).toLowerCase());
    const pick = prefs.find(p => links.some(a => a.getAttribute("hreflang") === p));
    if (!pick || pick === cur) return;
    const a = links.find(x => x.getAttribute("hreflang") === pick);
    const bar = document.createElement("div"); bar.className = "lang-banner"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Language"); bar.lang = pick;
    if (pick === "ur" || pick === "ar") bar.dir = "rtl";
    const l = document.createElement("a"); l.href = a.getAttribute("href"); l.hreflang = pick; l.textContent = a.dataset.suggest || a.textContent.trim();
    const x = document.createElement("button"); x.type = "button"; x.setAttribute("aria-label", "Close"); x.textContent = "\u00d7";
    x.addEventListener("click", () => { try { localStorage.setItem("fc-lang-dismissed", "1"); } catch (e) {} bar.remove(); });
    bar.append(l, x); document.body.append(bar);
  } catch (e) {}
})();
