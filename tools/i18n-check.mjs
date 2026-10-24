// Checks every language in lib/locales.mjs. Run:  node tools/i18n-check.mjs
// Exit code 1 means something must be fixed before building. Warnings are advice only.
import { LOCALES } from "../lib/locales.mjs";
const ref = LOCALES.pl, errors = [], warns = [];
const STR = ["code", "locale", "name", "flag", "crumb", "home", "suggest", "share", "title", "desc", "h1", "lede", "dlh", "dllede", "btn", "thanks", "direct", "warn", "fh", "rh", "gh", "qh", "ih", "sth", "sfh"];
const UI = ["nav_download", "nav_blog", "nav_faq", "nav_get", "lang_label", "foot_notaff", "menu_open"];
const LEN = { feats: 6, reqs: 4, guides: 4, faq: 4, steps: 5, stat: 3, safe: 3, faq2: 4 };
const codes = new Set(), hls = new Set();
for (const [key, L] of Object.entries(LOCALES)) {
  const e = m => errors.push(`${key}: ${m}`), w = m => warns.push(`${key}: ${m}`);
  if (L.code !== key) e(`code "${L.code}" must equal its key`);
  if (!/^[a-z]{2}(-[a-z]{2})?$/.test(key)) e("key must look like xx or xx-yy (lower case)");
  const hl = L.hl || L.code; if (hls.has(hl)) e(`duplicate hreflang ${hl}`); hls.add(hl); codes.add(L.code);
  for (const f of STR) if (typeof L[f] !== "string" || !L[f].trim()) e(`missing or empty "${f}"`);
  for (const f of UI) if (!L.ui || typeof L.ui[f] !== "string" || !L.ui[f].trim()) e(`missing ui.${f}`);
  for (const [f, n] of Object.entries(LEN)) if (!Array.isArray(L[f]) || L[f].length !== n) e(`"${f}" must have ${n} items`);
  (L.guides || []).forEach((g, i) => { if (g[0] !== ref.guides[i][0]) e(`guides[${i}] link must be ${ref.guides[i][0]}`); if (!g[1]) e(`guides[${i}] needs a title`); });
  (L.faq || []).concat(L.faq2 || []).forEach((q, i) => { if (!q[0] || !q[1]) e(`faq[${i}] needs a question and an answer`); });
  if (["ar", "ur", "fa", "he"].includes(L.code) && L.dir !== "rtl") e('right-to-left language needs dir: "rtl"');
  if (L.title && L.title.length > 70) w(`title is ${L.title.length} characters (Google may cut it near 60)`);
  if (L.desc && L.desc.length > 175) w(`desc is ${L.desc.length} characters (Google may cut it near 155)`);
  if (L.title && !/FireClient/.test(L.title)) w("title does not contain FireClient");
  if (!/1\.21\.1/.test(L.desc || "")) w("desc does not mention 1.21.1");
}
console.log(`${Object.keys(LOCALES).length} languages checked: ${[...codes].join(", ")}`);
warns.forEach(m => console.log("warning:", m));
errors.forEach(m => console.log("ERROR:  ", m));
console.log(errors.length ? `${errors.length} error(s)` : "No errors.");
process.exit(errors.length ? 1 : 0);
