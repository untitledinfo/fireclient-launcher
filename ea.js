// "Add a November reminder": builds a calendar file in the browser. Date is 1 Nov 2026; the real day is announced later.
(() => {
  const btns = document.querySelectorAll("[data-ics]"); if (!btns.length) return;
  const say = m => { const t = document.getElementById("toast"); if (!t) return; t.textContent = m; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 3600); };
  btns.forEach(b => b.addEventListener("click", () => {
    const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//FireClient//Early Access//EN", "BEGIN:VEVENT", "UID:fireclient-full-version-2026@fireclient.net", "DTSTAMP:20261013T000000Z", "DTSTART;VALUE=DATE:20261101", "DTEND;VALUE=DATE:20261102", "SUMMARY:FireClient full version (planned November 2026)", "DESCRIPTION:The exact release date is still to be announced. Details: https://www.fireclient.net/early-access/", "URL:https://www.fireclient.net/early-access/", "END:VEVENT", "END:VCALENDAR"];
    const url = URL.createObjectURL(new Blob([L.join("\r\n") + "\r\n"], { type: "text/calendar" }));
    const a = document.createElement("a"); a.href = url; a.download = "fireclient-full-version.ics"; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    say("Reminder downloaded. It is set to 1 November; the exact date will be announced.");
  }));
})();
