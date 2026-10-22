// Analytics consent notice. Google Analytics (see the <head> tag) starts with analytics storage OFF for visitors in the
// EEA, UK and Switzerland and only switches it on after "Accept". Elsewhere it runs as normal.
// The choice is kept in this browser only (localStorage key fc:analytics). Nothing is sent anywhere by this file.
(() => {
  const KEY = "fc:analytics";
  const T = {
    en: ["This site uses Google Analytics cookies to count visits. Accept to allow them, or decline and they stay off.", "Decline", "Accept", "Details"],
    pl: ["Ta strona używa plików cookie Google Analytics do zliczania odwiedzin. Zaakceptuj, aby je włączyć, lub odrzuć, a pozostaną wyłączone.", "Odrzuć", "Akceptuję", "Szczegóły"],
    de: ["Diese Website nutzt Google-Analytics-Cookies, um Besuche zu zählen. Akzeptieren Sie, um sie zu erlauben, oder lehnen Sie ab.", "Ablehnen", "Akzeptieren", "Details"],
    fr: ["Ce site utilise les cookies Google Analytics pour compter les visites. Acceptez pour les autoriser, ou refusez.", "Refuser", "Accepter", "Détails"],
    es: ["Este sitio usa cookies de Google Analytics para contar visitas. Acepta para permitirlas o recházalas.", "Rechazar", "Aceptar", "Detalles"],
    it: ["Questo sito usa i cookie di Google Analytics per contare le visite. Accetta per consentirli oppure rifiuta.", "Rifiuta", "Accetta", "Dettagli"],
    pt: ["Este site usa cookies do Google Analytics para contar visitas. Aceite para permitir ou recuse.", "Recusar", "Aceitar", "Detalhes"]
  };
  const get = () => { try { return localStorage.getItem(KEY) || ""; } catch (e) { return ""; } };
  const set = v => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  const apply = v => { try { if (typeof gtag === "function") gtag("consent", "update", { analytics_storage: v === "yes" ? "granted" : "denied" }); } catch (e) {} };
  // Show the notice to visitors whose browser time zone is in Europe (a close match for the regions where consent is required).
  // Google's own region rule (in the head tag) decides what is stored; this only decides who sees the notice.
  const inEurope = () => { try { return /^(Europe|Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe))/.test(Intl.DateTimeFormat().resolvedOptions().timeZone || ""); } catch (e) { return false; } };
  let bar;
  const close = () => { if (bar) { bar.remove(); bar = null; } };
  const open = () => {
    if (bar) return;
    const t = T[(document.documentElement.lang || "en").slice(0, 2).toLowerCase()] || T.en;
    bar = document.createElement("div"); bar.className = "consent"; bar.id = "consent-analytics"; bar.setAttribute("role", "dialog"); bar.setAttribute("aria-label", "Analytics cookies");
    const p = document.createElement("p"); p.append(t[0] + " ");
    const a = document.createElement("a"); a.href = "/terms-and-privacy.html"; a.textContent = t[3]; p.append(a);
    const box = document.createElement("div");
    const no = document.createElement("button"); no.type = "button"; no.className = "btn btn-ghost btn-sm"; no.textContent = t[1];
    const yes = document.createElement("button"); yes.type = "button"; yes.className = "btn btn-primary btn-sm"; yes.textContent = t[2];
    no.addEventListener("click", () => { set("no"); apply("no"); close(); });
    yes.addEventListener("click", () => { set("yes"); apply("yes"); close(); });
    box.append(no, yes); bar.append(p, box); document.body.append(bar);
  };
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-analytics-choice]"); if (b) { e.preventDefault(); open(); } });
  if (!get() && inEurope()) open();
})();
