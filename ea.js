// Early access helpers: November reminder (.ics) and a local "will it run on my PC?" hint. Nothing is sent anywhere.
(() => {
  const say = m => { const t = document.getElementById("toast"); if (!t) return; t.textContent = m; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 3600); };
  document.querySelectorAll("[data-ics]").forEach(b => b.addEventListener("click", () => {
    const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//FireClient//Early Access//EN", "BEGIN:VEVENT", "UID:fireclient-full-version-2026@fireclient.net", "DTSTAMP:20261013T000000Z", "DTSTART;VALUE=DATE:20261101", "DTEND;VALUE=DATE:20261102", "SUMMARY:FireClient full version (planned November 2026)", "DESCRIPTION:The exact release date is still to be announced. Details: https://www.fireclient.net/early-access/", "URL:https://www.fireclient.net/early-access/", "END:VEVENT", "END:VCALENDAR"];
    const url = URL.createObjectURL(new Blob([L.join("\r\n") + "\r\n"], { type: "text/calendar" }));
    const a = document.createElement("a"); a.href = url; a.download = "fireclient-full-version.ics"; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    say("Reminder downloaded. It is set to 1 November; the exact date will be announced.");
  }));

  const pc = document.querySelector("[data-pc]");
  if (pc) {
    const ua = navigator.userAgent || "", mem = Number(navigator.deviceMemory) || 0;
    const os = /Android|iPhone|iPad|iPod/i.test(ua) ? "mobile" : /Windows/i.test(ua) ? "windows" : /Mac/i.test(ua) ? "mac" : /Linux|X11|CrOS/i.test(ua) ? "linux" : "other";
    let msg = os === "windows" ? "This looks like a Windows PC, which FireClient supports (Windows 10 or 11, 64-bit)."
      : os === "mobile" ? "FireClient is a Windows app. Open this page on a Windows PC to install it."
      : "FireClient is Windows-only for now. macOS and Linux builds are not available yet.";
    if (os === "windows" && mem) msg += mem >= 8 ? " Your browser reports 8 GB of memory or more, so 4 GB is a good starting memory setting."
      : mem >= 4 ? " Your browser reports about 4 GB of memory, so try 2 GB and close other apps." : " Your browser reports under 4 GB of memory, so keep the memory setting low.";
    pc.textContent = msg + " ";
    const a = document.createElement("a"); a.href = "/blog/minecraft-ram-allocation-guide/"; a.textContent = "Read the RAM guide"; pc.append(a);
    pc.hidden = false;
  }
})();
