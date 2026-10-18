// Language helper. Never redirects, so search engines and people always get the page they asked for.
// It reads the browser's language list (and the language you last picked here) and offers a link.
// Nothing is sent anywhere. The choice and any dismissal are kept in this browser only.
(() => {
  try {
    const links = [...document.querySelectorAll(".lang-picker a[hreflang]")];
    if (!links.length) return;
    const key = t => { t = String(t || "en").toLowerCase(); return t.startsWith("zh") ? (/hant|-tw|-hk|-mo/.test(t) ? "zh-hant" : "zh-hans") : t.slice(0, 2); };
    const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
    const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
    // Remember an explicit choice from the picker.
    links.forEach(a => a.addEventListener("click", () => set("fc-lang", key(a.getAttribute("hreflang")))));
    const here = location.pathname.replace(/index\.html$/, "");
    if (here !== "/" && !links.some(a => a.getAttribute("href") === here)) return;
    const cur = key(document.documentElement.lang);
    const saved = get("fc-lang");
    const prefs = [saved, ...(navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"])].filter(Boolean).map(key);
    const pick = prefs.find(p => links.some(a => key(a.getAttribute("hreflang")) === p));
    if (!pick || pick === cur || get("fc-lang-dismissed") === pick) return;
    const a = links.find(x => key(x.getAttribute("hreflang")) === pick);
    const code = a.getAttribute("hreflang");
    const bar = document.createElement("div"); bar.className = "lang-banner"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Language"); bar.lang = code;
    if (pick === "ur" || pick === "ar") bar.dir = "rtl";
    const l = document.createElement("a"); l.href = a.getAttribute("href"); l.hreflang = code; l.textContent = a.dataset.suggest || a.textContent.trim();
    l.addEventListener("click", () => set("fc-lang", pick));
    const x = document.createElement("button"); x.type = "button"; x.setAttribute("aria-label", "Close"); x.textContent = "\u00d7";
    x.addEventListener("click", () => { set("fc-lang-dismissed", pick); bar.remove(); });
    bar.append(l, x); document.body.append(bar);
  } catch (e) {}
})();
