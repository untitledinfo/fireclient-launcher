// FireClient tools. Everything runs in your browser. Nothing you paste or select is uploaded.
(() => {
  const CLASS_TO_JAVA = { 52: 8, 53: 9, 54: 10, 55: 11, 56: 12, 57: 13, 58: 14, 59: 15, 60: 16, 61: 17, 62: 18, 63: 19, 64: 20, 65: 21, 66: 22, 67: 23 };
  const G = { java: "/blog/install-java-21-for-minecraft-1-21-1/", ram: "/blog/minecraft-ram-allocation-guide/", crash: "/blog/fix-minecraft-crash-fabric-1-21-1/", mods: "/blog/install-fabric-mods-modrinth-minecraft-1-21-1/", fps: "/blog/boost-fps-minecraft-1-21-1-fabric/", net: "/blog/fix-minecraft-connection-timed-out/", safe: "/blog/is-fireclient-safe/", pvp: "/blog/best-minecraft-pvp-settings-1-21-1/" };

  // ---- RAM ----
  function ramRec({ total, base, shaders, server }) {
    const want = base + (shaders ? 1 : 0) + (server ? 2 : 0), cap = Math.max(1, Math.floor(total / 2));
    return { want, cap, rec: Math.max(1, Math.min(Math.round(want), cap)), limited: want > cap };
  }
  // ---- Video settings ----
  const LV = { low: { rd: [6, 8, 10], sd: [5, 6, 8], ed: ["50%", "75%", "100%"] }, mid: { rd: [10, 12, 14], sd: [6, 8, 10], ed: ["75%", "100%", "100%"] }, high: { rd: [14, 18, 24], sd: [8, 10, 12], ed: ["100%", "125%", "150%"] } };
  function settingsFor(level, goal) {
    const g = { fps: 0, balanced: 1, looks: 2 }[goal], t = LV[level], low = level === "low";
    return [["Render distance", t.rd[g] + " chunks"], ["Simulation distance", t.sd[g] + " chunks"], ["Graphics", g === 0 || (g === 1 && low) ? "Fast" : "Fancy"],
      ["Particles", ["Minimal", "Decreased", low ? "Decreased" : "All"][g]], ["Clouds", ["Off", "Fast", low ? "Fast" : "Fancy"][g]], ["Biome blend", ["Low", "Low", "Medium"][g]],
      ["Entity distance", t.ed[g]], ["Entity shadows", g === 0 ? "Off" : "On"], ["Max framerate", "Unlimited, or your monitor's refresh rate"], ["VSync", "Off for the lowest delay. Turn on only if you see screen tearing."]];
  }
  // ---- Java ----
  function javaCheck(text) {
    const m = String(text || "").match(/version\s+"?(\d+)(?:\.(\d+))?/i);
    if (!m) return { status: "unknown" };
    let major = +m[1]; if (major === 1 && m[2]) major = +m[2];
    const bit = /64-Bit/i.test(text) ? 64 : (/32-Bit|Client VM/i.test(text) ? 32 : null);
    const vendor = (/Temurin/i.test(text) && "Eclipse Temurin") || (/Microsoft/i.test(text) && "Microsoft Build of OpenJDK") || (/Corretto/i.test(text) && "Amazon Corretto") || (/Zulu/i.test(text) && "Azul Zulu") || (/GraalVM/i.test(text) && "GraalVM") || (/Java\(TM\)/i.test(text) && "Oracle Java") || (/OpenJDK/i.test(text) && "OpenJDK") || null;
    return { status: major === 21 ? "ok" : major > 21 ? "newer" : "old", major, bit, vendor };
  }
  // ---- Crash report ----
  function crashAnalyze(text) {
    const t = String(text || ""), f = [], info = [];
    const one = (re, i = 1) => { const m = t.match(re); return m ? m[i].trim() : ""; };
    const mc = one(/Minecraft Version:\s*(.+)/i), jv = one(/Java Version:\s*(.+)/i), desc = one(/Description:\s*(.+)/i);
    if (mc) info.push("Minecraft " + mc); if (jv) info.push("Java " + jv); if (desc) info.push("Crash description: " + desc);
    const cv = [...t.matchAll(/(?:class file version|major version)\s+(\d+)\.\d/gi)].map(m => +m[1]);
    if (/UnsupportedClassVersionError/i.test(t) || cv.length) { const need = cv.length ? CLASS_TO_JAVA[Math.max(...cv)] : null;
      f.push({ title: "A Java version problem", detail: need ? `Something in the game or a mod was built for Java ${need}, and the Java you are using is older. Minecraft 1.21.1 needs Java 21.` : "A class was built for a newer Java than the one you are using. Minecraft 1.21.1 needs Java 21.", links: [[G.java, "Install Java 21"]] }); }
    if (/OutOfMemoryError|Java heap space|Could not reserve enough space|GC overhead limit/i.test(t))
      f.push({ title: "A memory problem", detail: "The game ran out of memory, or the memory setting is more than the PC can give. Try a value between 3 and 6 GB, keep it at or below half of your RAM and remove heavy mods.", links: [[G.ram, "RAM guide"], ["/tools/minecraft-ram-calculator/", "RAM calculator"]] });
    const dep = [...new Set([...t.matchAll(/^.*(?:requires|depends on|Unmet dependency|Missing mandatory|Incompatible mods found).*$/gim)].map(m => m[0].trim().slice(0, 200)))].slice(0, 5);
    if (dep.length) f.push({ title: "A missing or wrong mod dependency", detail: "A mod needs another mod, or a different version of one. Fabric API is the most common one to be missing. Lines that mention it: " + dep.join(" | "), links: [[G.mods, "Install mods the right way"]] });
    const mix = [...new Set([...t.matchAll(/([a-z0-9_\-]+)\.mixins?\.json/gi)].map(m => m[1]))].slice(0, 6);
    if (/Mixin apply failed|MixinApplyError|InvalidInjectionException|Mixin transformation|MixinTransformerError/i.test(t))
      f.push({ title: "A mod conflict or wrong mod version", detail: "A mod could not change the game, usually because it is for another Minecraft version or clashes with another mod." + (mix.length ? " Mod names seen in the report: " + mix.join(", ") + "." : ""), links: [[G.crash, "Crash checklist"], [G.mods, "Check versions on Modrinth"]] });
    if (/NoSuchMethodError|NoSuchFieldError|ClassNotFoundException|NoClassDefFoundError/i.test(t)) { const c = one(/(?:NoClassDefFoundError|ClassNotFoundException)[:\s]+([\w./$]+)/i);
      f.push({ title: "A mod does not match the game or another mod", detail: "A piece of code a mod expected was not found" + (c ? " (" + c + ")" : "") + ". This usually means a wrong version.", links: [[G.mods, "Check versions on Modrinth"], [G.crash, "Crash checklist"]] }); }
    if (/GLFW error|WGL:|OpenGL|driver does not appear to support|GLFW_API_UNAVAILABLE/i.test(t))
      f.push({ title: "A graphics driver problem", detail: "The game could not start graphics properly. Update your graphics driver from the maker's website and restart. If you use overlays or recording software, try turning them off.", links: [[G.crash, "Crash checklist"]] });
    if (/Connection refused|Connection timed out|UnknownHostException|Failed to connect/i.test(t))
      f.push({ title: "A network or server problem", detail: "The game could not reach a server. Check the address, your connection and any VPN or firewall.", links: [[G.net, "Connection timed out checklist"]] });
    if (/SSLHandshakeException|PKIX path|Failed to download/i.test(t))
      f.push({ title: "A download or security problem", detail: "A download failed. Check that your PC clock is right, turn off VPN or proxy and check whether security software is blocking Java.", links: [[G.crash, "Crash checklist"]] });
    const code = one(/exit code[:\s]+(-?\d+)/i);
    if (code && code !== "0") f.push({ title: "Exit code " + code, detail: "An exit code only says the game stopped. Look for the lines that start with Caused by, or use the other results here, to find the reason.", links: [[G.crash, "Crash checklist"]] });
    const cb = [...t.matchAll(/^\s*Caused by:\s*(.+)$/gim)].map(m => m[1].trim().slice(0, 220));
    if (cb.length) f.push({ title: "Where it started", detail: "First cause: " + cb[0] + (cb.length > 1 ? " | Last cause: " + cb[cb.length - 1] : ""), links: [] });
    const sus = one(/Suspected Mods?:\s*([\s\S]{0,400}?)(?:\n\s*\n|Stacktrace|$)/i);
    if (sus && !/^none/i.test(sus)) f.push({ title: "Suspected mods", detail: sus.replace(/\s+/g, " ").slice(0, 300), links: [[G.mods, "Check versions on Modrinth"]] });
    if (!f.length) f.push({ title: "No clear cause found", detail: "Nothing in this text matched a common problem. Try the full crash report from the crash-reports folder, work through the checklist, or ask in the Discord and share only the relevant lines.", links: [[G.crash, "Crash checklist"]] });
    return { info, findings: f };
  }
  const api = { ramRec, settingsFor, javaCheck, crashAnalyze };
  if (typeof globalThis !== "undefined") globalThis.FCTools = api;
  if (typeof document === "undefined") return;

  // ---- DOM ----
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const links = arr => { const p = el("p", "links"); arr.forEach(([h, l]) => { const a = el("a", "", l); a.href = h; p.append(a, " "); }); return p; };
  const ram = $('[data-tool="ram"]');
  if (ram) {
    const out = $("#ram-out"), run = () => {
      const r = ramRec({ total: +$("#ram-total").value, base: +$("#ram-setup").value, shaders: $("#ram-shaders").checked, server: $("#ram-server").checked });
      out.replaceChildren(el("p", "big", `Suggested memory: ${r.rec} GB`), el("p", "", `Java argument: -Xmx${r.rec}G`));
      if (r.limited) out.append(el("p", "warn", `Your setup would like about ${Math.round(r.want)} GB, but a PC with this much RAM should keep Minecraft at or below ${r.cap} GB so Windows has room. Use fewer mods or add RAM.`));
      out.append(el("p", "", "Keep at least half of your RAM free. More is not always faster, so raise it in small steps only if you see stutters or out-of-memory errors."), links([[G.ram, "RAM guide"], [G.fps, "FPS guide"]]));
    };
    ram.addEventListener("input", run); run();
  }
  const st = $('[data-tool="settings"]');
  if (st) {
    const out = $("#set-out"), run = () => { const dl = el("dl", "kv"); settingsFor($("#set-level").value, $("#set-goal").value).forEach(([k, v]) => { dl.append(el("dt", "", k), el("dd", "", v)); });
      out.replaceChildren(dl, el("p", "", "These are starting points. Turn on an FPS counter, change one setting at a time and keep what works for your PC."), links([[G.fps, "FPS guide"], [G.pvp, "PvP settings"]])); };
    st.addEventListener("input", run); run();
  }
  const jv = $('[data-tool="java"]');
  if (jv) $("#java-go").addEventListener("click", () => {
    const r = javaCheck($("#java-in").value), out = $("#java-out"); out.replaceChildren();
    if (r.status === "unknown") { out.append(el("p", "warn", "I could not find a Java version in that text. Open Command Prompt, run java -version and paste everything it prints."), links([[G.java, "Install Java 21"]])); return; }
    const head = r.status === "ok" ? "You have Java 21. That is what Minecraft 1.21.1 needs." : r.status === "newer" ? `You have Java ${r.major}, which is newer than 21. Minecraft 1.21.1 targets Java 21. If you see Java errors, install Java 21.` : `You have Java ${r.major}, which is too old. Minecraft 1.21.1 needs Java 21.`;
    out.append(el("p", r.status === "ok" ? "big" : "warn", head));
    if (r.vendor) out.append(el("p", "", "Build: " + r.vendor));
    if (r.bit === 32) out.append(el("p", "warn", "This looks like a 32-bit Java. Install a 64-bit Java 21 so Minecraft can use enough memory."));
    else if (r.bit === 64) out.append(el("p", "", "It is a 64-bit Java, which is what you want."));
    if (r.status !== "ok") out.append(links([[G.java, "How to install Java 21"]]));
  });
  const cr = $('[data-tool="crash"]');
  if (cr) {
    const out = $("#crash-out");
    $("#crash-go").addEventListener("click", () => { const r = crashAnalyze($("#crash-in").value); out.replaceChildren();
      if (r.info.length) out.append(el("p", "info", r.info.join(" | ")));
      r.findings.forEach(x => { const d = el("div", "finding"); d.append(el("h3", "", x.title), el("p", "", x.detail)); if (x.links.length) d.append(links(x.links)); out.append(d); });
      out.append(el("p", "note", "This reads common patterns and can be wrong. Treat it as a pointer, not a diagnosis.")); });
    $("#crash-clear").addEventListener("click", () => { $("#crash-in").value = ""; out.replaceChildren(); });
  }
  const vf = $('[data-tool="verify"]');
  if (vf) {
    const out = $("#v-out"), note = $("#v-note"), bar = $("#v-progress"), cancelBtn = $("#v-cancel");
    const H = () => window.FCHash, R = () => window.FCRelease;
    let have = "", ctl = null, published = { hash: "", name: "" };
    const say = (cls, text) => out.append(el("p", cls, text));
    if (!H() && !window.crypto) { /* checked again on use */ }
    const compare = (file) => {
      out.replaceChildren();
      say("", `${file.name} (${(file.size / 1048576).toFixed(1)} MB)`);
      say("mono", "SHA-256: " + have);
      const want = H().normalizeHash($("#v-hash").value);
      if (!want) say("note", "Paste the published SHA-256 above, or use the button to fetch the one GitHub lists, to compare.");
      else if (!H().isSha256(want)) say("warn", "That does not look like a SHA-256. It should be 64 characters using 0-9 and a-f.");
      else if (want === have) say("big", "Match. This file is identical to the one the hash was published for.");
      else say("warn", "No match. Do not run this file. Delete it and download it again from the official download page.");
      if (published.name && published.name.toLowerCase() !== file.name.toLowerCase() && want === published.hash)
        say("note", `Note: the published hash is for ${published.name}, but this file is named ${file.name}.`);
      say("note", "Everything here ran in your browser; the file was not uploaded. A match only shows the file was not changed after it was published. It does not prove the file is free of malware, and it is only as trustworthy as the place you got the hash from.");
    };
    const busy = on => { cancelBtn.hidden = !on; bar.hidden = !on; $("#v-file").disabled = on; if (!on) bar.value = 0; };
    $("#v-file").addEventListener("change", async () => {
      const file = $("#v-file").files[0]; have = ""; out.replaceChildren();
      if (!file) return;
      if (!H() || !file.slice || !file.arrayBuffer) { say("warn", "This browser cannot check files here. Use Get-FileHash in PowerShell instead."); return; }
      ctl = new AbortController(); busy(true); say("", `Calculating the SHA-256 of ${file.name}…`);
      try {
        have = await H().hashFile(file, { signal: ctl.signal, onProgress: f => { bar.value = f; bar.setAttribute("aria-valuenow", Math.round(f * 100)); } });
        busy(false); compare(file);
      } catch (e) {
        busy(false); out.replaceChildren();
        if (e && e.name === "AbortError") say("note", "Cancelled. Nothing was calculated.");
        else say("warn", "Your browser could not read or hash this file (it may be too large for this device). Use Get-FileHash in PowerShell instead.");
      } finally { ctl = null; $("#v-file").value = ""; }
    });
    cancelBtn.addEventListener("click", () => { if (ctl) ctl.abort(); });
    $("#v-hash").addEventListener("input", () => { const f = $("#v-file").files[0]; if (have && f) compare(f); else if (have) compare({ name: "(selected file)", size: 0 }); });
    $("#v-fill").addEventListener("click", async () => {
      note.textContent = "Looking up the latest release…";
      try {
        let s = null;
        try { const r = await fetch("/api/latest", { headers: { Accept: "application/json" } }); if (r.ok) { const j = await r.json(); if (j && j.ok) s = j; } } catch (e) { /* fall back */ }
        if (!s) { const r = await fetch("https://api.github.com/repos/untitledinfo/verifed-fireclient/releases?per_page=10", { headers: { Accept: "application/vnd.github+json" } }); if (!r.ok) throw new Error("lookup"); s = R().summarize(await r.json(), { includePrereleases: true }); }
        if (!s || !s.installer) { note.textContent = "The latest release has no single, clearly identified installer, so no hash was filled in. Paste the hash from the release page instead."; return; }
        if (s.hashConflict) { note.textContent = "Two sources listed for this release disagree about the checksum, so none was filled in. Do not rely on a checksum for this release until that is resolved."; return; }
        if (!s.installer.sha256) { note.textContent = `GitHub has not published a SHA-256 for ${s.installer.name} (${s.tag || "latest release"}), so there is nothing to compare against yet.`; return; }
        published = { hash: s.installer.sha256, name: s.installer.name };
        $("#v-hash").value = s.installer.sha256;
        note.textContent = `Filled with the SHA-256 listed for ${s.installer.name} (${s.tag || "latest release"}). This comes from GitHub, the same place you download from, so it checks the transfer, not the maker.`;
        $("#v-hash").dispatchEvent(new Event("input"));
      } catch (e) { note.textContent = "Could not look up the latest release (network error, rate limit, or the request was blocked). Paste the hash from the release page instead."; }
    });
  }
  const hf = $("#help-pick");
  if (hf) { const groups = [...document.querySelectorAll("[data-help]")]; hf.hidden = false;
    hf.addEventListener("change", () => groups.forEach(g => { g.hidden = hf.value !== "all" && g.dataset.help !== hf.value; })); }
})();
