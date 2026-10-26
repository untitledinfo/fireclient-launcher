// Finds absolute or unverifiable safety/trust claims in page text. Shared by seo-audit.mjs and test.mjs.
// A match is ignored when a negation appears shortly before it ("we do not claim...", "no guarantees").
const RULES = [
  [/100\s?%\s*(safe|secure|clean|virus|malware|trusted)/i, "absolute safety claim (100%)"],
  [/virustotal[^.<]{0,60}(clean|zero detections|0 detections|0\/\d+)/i, "VirusTotal result claim"],
  [/(zero|0|no)\s+detections/i, "antivirus detection-count claim"],
  [/\b\d{2,3}\+?\s+(antivirus\s+)?(engines|vendors)\b/i, "antivirus engine-count claim"],
  [/anti-?malware certification/i, "certification claim"],
  [/(trust and safety|safety|security) certification/i, "certification claim"],
  [/(passed|completed|independent|third-party)\s+(a\s+)?security audits?/i, "security audit claim"],
  [/hardware-(backed|tied)/i, "hardware-backed storage claim (DPAPI is tied to the Windows user account)"],
  [/\bverified publisher\b/i, "publisher verification claim"],
  [/(microsoft|mojang)[^.<]{0,40}(endorsed|approved|certified|partner)/i, "endorsement claim"],
  [/free of (malware|adware|viruses)/i, "absolute malware claim"],
  [/(safest|guaranteed safe|risk-free|100% legit)/i, "superlative safety claim"],
];
const NEGATION = /\b(not|no|never|cannot|can't|can\s?not|without|nor|isn't|aren't|doesn't|does not|do not|don't|nothing)\b|promise/i;

export function findClaims(text) {
  const hits = [];
  for (const [re, label] of RULES) {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    for (const m of text.matchAll(g)) {
      const before = text.slice(Math.max(0, m.index - 90), m.index + m[0].length);
      if (NEGATION.test(before)) continue;
      hits.push({ label, snippet: text.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30).replace(/\s+/g, " ") });
    }
  }
  return hits;
}
