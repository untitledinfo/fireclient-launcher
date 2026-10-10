# FireClient website

The official website for **FireClient**, a Minecraft Java launcher with a Fabric in-game client.

- Website: https://fireclient.net
- Launcher and releases: https://github.com/untitledinfo/fireclient-launcher
- Download (v1.0, Windows): https://github.com/untitledinfo/fireclient-launcher/releases/download/v1.0/FireClient-Setup.exe

## About FireClient

FireClient is a Windows launcher for Minecraft Java Edition with a Fabric in-game mod, so you manage the game and shape your HUD in one install.

- **Launcher:** install versions, find and install mods from Modrinth, add your own jars, curated packs (Performance, Visuals, Utility, PvP), worlds library, resource packs, screenshots, offline skin, Paper server hosting, memory setting.
- **In-game client (Minecraft 1.21.1, Fabric, Java 21):** menu on `Right Shift`, draggable HUD (watermark, FPS, coordinates, ping, direction, memory, clock, keystrokes, armor, effects, CPS), sprint toggle and accent themes.
- **Local by design:** worlds and resource packs stay on disk through updates and uninstall.

Planned, not built yet: crosshair editor and cosmetics.

Created by FirePDX and Sajjad Ahmed. FireClient is independent and not affiliated with Mojang or Microsoft.

## About this repository

The site is plain HTML, CSS and vanilla JavaScript. No build step and no dependencies.

```
index.html              main page
terms-and-privacy.html  terms and privacy notice
404.html                not-found page
style.css               all styling (palette in :root)
script.js               behavior and CONFIG block
changelog.js            release notes fallback
robots.txt, sitemap.xml search engine files
assets/                 logo, icon, screenshots, Open Graph image
CNAME                   custom domain for GitHub Pages
```

### Run locally

```
python -m http.server 8000
```

Then open http://localhost:8000.

### Configure

Edit the `CONFIG` block at the top of `script.js`:

- `windows` — fallback installer URL, version, date, size and SHA-256.
- `github.repo` — `untitledinfo/fireclient-launcher`. The page reads the latest release, installer size, SHA-256 and notes from the GitHub API and falls back to `windows` and `changelog.js` if that fails.
- `discord.invite` — invite code for live online and member counts (public invite API, no key). Use a permanent invite. If Discord can't be reached the numbers are hidden.
- `social` — Discord, GitHub and other links. Empty entries are hidden.

When you ship a new release: publish it on GitHub with the installer attached and add a matching entry to `changelog.js`.

### Deploy

- **GitHub Pages:** Settings, Pages, deploy from the `main` branch, root folder. `CNAME` already contains `fireclient.net`; point your domain's DNS at GitHub Pages.
- **Cloudflare Pages / Netlify / any static host:** no build command, publish the repository root.

### Screenshots

`assets/ingame-menu.jpg`, `ingame-hud.jpg` and `launcher-mods.jpg` have `-960` copies used on the page. Replace a file and keep its name to update it.

## License

All rights reserved. See [LICENSE](LICENSE). The launcher and mod are covered separately in the launcher repository.
