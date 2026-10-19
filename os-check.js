// Tells visitors whether their device can run FireClient. Reads the browser's platform only; nothing is sent anywhere.
(() => {
  const el = document.getElementById("os-note");
  if (!el) return;
  const ua = navigator.userAgent || "", p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
  const pc = document.getElementById("pc-check"), tx = document.getElementById("pc-text");
  if (pc && tx) {
    const cores = navigator.hardwareConcurrency, mem = navigator.deviceMemory, parts = [];
    if (cores) parts.push(cores + " logical CPU cores");
    if (mem) parts.push("about " + (mem >= 8 ? "8 GB or more" : mem + " GB") + " of memory (browsers round this number)");
    if (parts.length) {
      tx.textContent = "Your browser reports " + parts.join(" and ") + ". " + (mem && mem <= 4 ? "Keep the Minecraft memory setting around 2 GB and close other programs." : "A 4 GB memory setting is a good start for Minecraft 1.21.1 on Fabric.");
      pc.hidden = false;
    }
  }
  let m;
  if (/android|iphone|ipad|ipod/i.test(ua)) m = "You appear to be on a phone or tablet. FireClient runs on Windows PCs only, so open this page on your PC to install it.";
  else if (/windows/i.test(ua) || /^win/i.test(p)) m = "Windows detected. FireClient supports Windows 10 and 11 (64-bit).";
  else if (/mac|linux|cros/i.test(ua + " " + p)) m = "You appear to be on macOS or Linux. FireClient is Windows only for now.";
  else return;
  el.textContent = m; el.hidden = false;
})();
