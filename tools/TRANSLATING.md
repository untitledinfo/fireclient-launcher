# Translating FireClient

All languages live in one file: `lib/locales.mjs`. Each language is one entry. The key is also the folder in the URL, so `pl` becomes `/pl/`.

## Add a language

1. Open `lib/locales.mjs` and copy an existing entry (for example `it`).
2. Change the key and `code` (lower case, for example `nl`) and set `locale` (`nl_NL`), `name` (the language's own name), `flag` and `crumb`.
3. Translate every value. Keep the keys and keep these as they are: `FireClient`, `1.21.1`, `Fabric`, `Modrinth`, `Paper`, `Java 21`, `SHA-256`, `Discord`.
4. For right-to-left languages (Arabic, Urdu, Persian, Hebrew) add `"dir": "rtl"`.
5. For regional variants add `"hl"`, the Google language tag (for example `"hl": "zh-Hant"`).
6. Run `node tools/i18n-check.mjs`. Fix every ERROR. Warnings about long titles or descriptions are advice.
7. Run `node tools/build.mjs`, then deploy. The language page, the language picker, the sitemap and the hreflang tags update by themselves.

## Fields

- `title` and `desc`: the search result title and description. Aim for about 60 and 155 characters.
- `h1`, `lede`: page heading and intro.
- `dlh`, `dllede`, `btn`, `thanks`, `direct`, `warn`: the download block.
- `feats` (6 items), `reqs` (4 items), `faq` (4 questions and answers): keep the number of items.
- `ih` + `steps` (5 items): the install steps. `sth` + `stat` (3): what works today, what is planned, release timing. `sfh` + `safe` (3): official sources and the file check. `faq2` (4 questions and answers): worlds, affiliation, opening the menu, getting help.
- `guides`: keep each link; translate only the title. The guides themselves are English.
- `suggest`: the sentence in the "view this page in your language?" banner.
- `share`: the label of the Share button.
- `ui`: navigation, footer and menu labels.

## Rules for translators

- Do not add claims. Only translate what the English page says: FireClient is free, Windows only, early access, unsigned installer, needs the player's own Minecraft Java Edition account, not affiliated with Mojang or Microsoft.
- Do not translate the facts into promises (for example, do not say "best" or "fastest").
- Ask a native speaker to review before you promote a page.

## Not translated yet

The home page, the blog posts and the FAQ page are English only. The language pages link to them and mark the links as English.
