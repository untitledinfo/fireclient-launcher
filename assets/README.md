# Assets used by the FireClient site

All paths are relative to the site root. Nothing here is generated at runtime.

| File | Used for | Notes |
|---|---|---|
| `logo.svg` | Header/footer brand mark, SVG favicon | Red flame "F" mark from the project. |
| `icon.png` | PNG favicon, Apple touch icon | 512x512. |
| `ingame-menu.jpg` / `-960.jpg` | Hero, In-game viewer | FireClient title screen, 1.21.1. Window bar cropped off. |
| `ingame-hud.jpg` / `-960.jpg` | In-game viewer | HUD settings screen. |
| `launcher-mods.jpg` / `-960.jpg` | In-game viewer (Launcher tab) | Launcher, Mods page. |
| `og-image.png` | Open Graph / Twitter card | 1200x630. Replace with your own if you like. |

## Replacing things

- **Screenshots:** drop new files in this folder and update the `src` / `data-full` attributes in the Gallery section of `index.html`. Keep a small (~960 px) version for `src` and a large one for `data-full`.
- **Fonts:** none are loaded. The site uses system fonts (Bahnschrift / Segoe UI on Windows) so nothing can fail to download.
- **Colors:** every color lives in the `:root` block at the top of `style.css`. `--red`, `--red-hot` and `--red-deep` drive the theme.



