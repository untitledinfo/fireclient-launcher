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

## Blog, news and admin panel

- `/blog/` and `/news/` are prerendered static pages (one HTML file per post, with canonical, Open Graph, JSON-LD, sitemap and RSS), so search engines read them without running JavaScript.
- Posts live in `content/posts.json`. `lib/render.mjs` turns them into pages. `node tools/build.mjs` rebuilds everything locally.
- `/admin/` is a no-server editor. Sign in with the repository name and a fine-grained GitHub token (Contents: Read and write). **Publish** commits the posts, generated pages, `sitemap.xml`, `feed.xml` and any uploaded images in one commit; Vercel then redeploys automatically (the Vercel project must be connected to this repository).
- Only the repository owner can sign in (`admin/config.js` can list other GitHub usernames). This check runs in the browser, so the real lock is still GitHub: only people whose token can write to the repo can publish. Do not add collaborators you do not trust. The token lives in the tab only, and the admin signs out after 30 idle minutes.
- The token is the only lock on the admin. Keep it private, set an expiry, and limit it to this repository.

## Run locally

```
python -m http.server 8000
```

Open http://localhost:8000. Download, Discord and release settings are in the `CONFIG` block at the top of `script.js`.

## License

All rights reserved. Cloning, copying or reusing this website is not allowed without written permission. See [LICENSE](LICENSE).

Created by FirePDX and Sajjad Ahmed. Not affiliated with Mojang or Microsoft.
