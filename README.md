# FireClient Website

Website for **FireClient**, a Minecraft Java launcher with a Fabric in-game client.

**Website:** https://fireclient.net
**Launcher and downloads:** https://github.com/untitledinfo/fireclient-launcher

## About

FireClient is a Windows launcher for Minecraft Java Edition with an in-game mod for Minecraft 1.21.1 (Fabric). It manages versions, mods, worlds and resource packs, and adds a draggable HUD and menu in game.

This repository is the source of the website: plain HTML, CSS and JavaScript with no build step.

## Files

- `index.html`, `terms-and-privacy.html`, `404.html` — pages
- `style.css`, `script.js`, `changelog.js` — styling, behavior and release notes
- `assets/` — logo, icon and screenshots
- `robots.txt`, `sitemap.xml`, `CNAME` — search engines and domain

## Run locally

```
python -m http.server 8000
```

Open http://localhost:8000. Download, Discord and release settings are in the `CONFIG` block at the top of `script.js`.

## License

All rights reserved. Cloning, copying or reusing this website is not allowed without written permission. See [LICENSE](LICENSE).

Created by FirePDX and Sajjad Ahmed. Not affiliated with Mojang or Microsoft.
