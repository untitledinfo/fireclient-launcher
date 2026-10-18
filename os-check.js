// Tells visitors whether their device can run FireClient. Reads the browser's platform only; nothing is sent anywhere.
(() => {
  const el = document.getElementById("os-note");
  if (!el) return;
  const ua = navigator.userAgent || "", p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
  let m;
  if (/android|iphone|ipad|ipod/i.test(ua)) m = "You appear to be on a phone or tablet. FireClient runs on Windows PCs only, so open this page on your PC to install it.";
  else if (/windows/i.test(ua) || /^win/i.test(p)) m = "Windows detected. FireClient supports Windows 10 and 11 (64-bit).";
  else if (/mac|linux|cros/i.test(ua + " " + p)) m = "You appear to be on macOS or Linux. FireClient is Windows only for now.";
  else return;
  el.textContent = m; el.hidden = false;
})();
