/*
 * FireClient changelog data — edit this file to add releases (newest first).
 * Used when no GitHub repository is configured in script.js, or as the fallback
 * if the GitHub request fails.
 *
 * Fields per release:
 *   version  string   e.g. "2.2.7"
 *   date     string   ISO date "YYYY-MM-DD", or "" if not published
 *   features string[] new things
 *   fixes    string[] bug fixes
 *   known    string[] known issues
 */
window.FIRECLIENT_CHANGELOG = [
  {
    version: "1.0",
    date: "", // Release date not recorded in the project files. Add "YYYY-MM-DD" when known.
    features: [
      "Memory setting from the launcher is passed to Java as the max heap, limited to a safe range.",
      "Saves library shows each world's own icon, last-saved date and size.",
      "Resource pack library has no delete action; packs and worlds stay on disk through updates and uninstall."
    ],
    fixes: [],
    known: [
      "The installer is unsigned, so Windows may show a security prompt.",
      "The in-game FireClient mod is built for Minecraft 1.21.1 on Fabric only. Other versions launch without it."
    ]
  }
];
