/* Accent themes. Single source of truth: loaded in <head> so a saved choice is applied before first paint
   (no flash of the wrong colour), and read by the picker in features.js. Each theme sets the same variables:
   --btn-1/2/3 + --on-btn are chosen so button text has at least 4.5:1 contrast (WCAG AA) in every theme. */
(function () {
  var A = {
    ember: { "--red": "#e0313f", "--red-hot": "#ff4a55", "--red-deep": "#7d1521", "--ember": "#ff7a72", "--line-red": "rgba(224, 49, 63, .38)", "--red-rgb": "224 49 63", "--hot-rgb": "255 74 85", "--ember-rgb": "255 122 114", "--deep-rgb": "125 21 33", "--btn-1": "#e13f4c", "--btn-2": "#db2230", "--btn-3": "#b81d28", "--on-btn": "#ffffff" },
    ocean: { "--red": "#2f7de0", "--red-hot": "#4aa0ff", "--red-deep": "#153d7d", "--ember": "#72b6ff", "--line-red": "rgba(47, 125, 224, .38)", "--red-rgb": "47 125 224", "--hot-rgb": "74 160 255", "--ember-rgb": "114 182 255", "--deep-rgb": "21 61 125", "--btn-1": "#3983e0", "--btn-2": "#2170d5", "--btn-3": "#1c5db2", "--on-btn": "#ffffff" },
    lime: { "--red": "#3fae4a", "--red-hot": "#5fd36a", "--red-deep": "#17621f", "--ember": "#8be39a", "--line-red": "rgba(63, 174, 74, .38)", "--red-rgb": "63 174 74", "--hot-rgb": "95 211 106", "--ember-rgb": "139 227 154", "--deep-rgb": "23 98 31", "--btn-1": "#51c05c", "--btn-2": "#3fae4a", "--btn-3": "#34903d", "--on-btn": "#07210c" }
  };
  // Runs before first layout: if the URL has a #hash, render all sections (see "cv-off" in style.css) so the browser's initial
  // scroll to the anchor is exact. script.js removes the class again shortly after load.
  try { if (location.hash) document.documentElement.classList.add("cv-off"); } catch (e) { /* ignore */ }
  window.FCAccents = A;
  try {
    var k = localStorage.getItem("fc-accent"), a = A[k];
    if (a && k !== "ember") { var s = document.documentElement.style; for (var p in a) s.setProperty(p, a[p]); }
  } catch (e) { /* storage blocked: default theme */ }
})();
