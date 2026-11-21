/** Runs before paint to apply the stored theme and avoid a flash. */
const script = `
(function(){
  try {
    var stored = localStorage.getItem('fc-theme');
    var system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    var theme = stored === 'light' || stored === 'dark' ? stored : system;
    var root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
