# Release data, checksums and trust wording

How the website decides what to show about the installer, and how to keep it honest.

## Where the numbers come from
- **Version, date, size, SHA-256** come from the GitHub release `untitledinfo/verifed-fireclient` (GitHub's `digest` field for the asset).
  `/api/latest` (api/latest.js) reads it and, if the release has a `verification-report.json`, cross-checks it.
  If the browser cannot reach `/api/latest` it asks GitHub directly. Shared logic: `release-core.js`.
- Nothing is typed in by hand. `CONFIG.windows.sizeBytes`/`sha256` in `script.js` stay empty on purpose.
- If GitHub published no digest: the page says "Not published for this release yet."
- If the report and GitHub disagree: no hash is shown and the page says the sources disagree.
- If several `.exe` files are attached and none is `FireClient-Setup.exe`, nothing is picked.

## Check it against the real release (needs internet)
    node tools/check-release.mjs        # set GITHUB_TOKEN to avoid rate limits
It lists the assets, which one the site would use, whether size and digest exist, whether the default
`releases/latest/download/FireClient-Setup.exe` link resolves, and whether the report hash agrees.

## Release checklist (owner)
1. Attach the installer named exactly `FireClient-Setup.exe`.
2. Make sure GitHub shows a digest for the asset. Older uploads may have none; `node tools/check-release.mjs` tells you. If it is missing, re-upload the asset or attach `verification-report.json`.
3. Optionally attach `verification-report.json`; the site links to it and cross-checks the hash.
4. Run `node tools/check-release.mjs`, then deploy the site, then `node tools/check-live.mjs`.

## Wording rules
- No "100% safe", no antivirus result or engine counts, no audit/certification/endorsement claims unless a
  dated, linkable record exists. `node tools/seo-audit.mjs` and `node --test tools/test.mjs` fail on these phrases.
- The beta installer is unsigned: keep the warning until a signed release is verified with a real test.
- Search Console / Bing verification proves site ownership only. It is not a publisher or safety badge.
- Update `lm()`/`CHANGED` in `lib/render.mjs` when a page's content really changes, so sitemap `lastmod` stays true.

## Code signing
The site shows the installer's signature status from `content/signing.json` (default: not signed). See `SIGNING.md` for how to sign and when to update the file. The site never says "verified".

## Tests
    node tools/build.mjs && node tools/seo-audit.mjs && node tools/i18n-check.mjs && node --test tools/test.mjs
