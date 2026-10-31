# Performance notes (measured 30 Oct 2026)

Lab method: headless Chromium, mobile viewport 390 px, 4x CPU slowdown, slow-4G network (1.6 Mbps, 150 ms), gzip on (Vercel also serves brotli).
These are **lab** numbers, not Google's field data. Check real users in PageSpeed Insights (the "Discover what your real users experience" box) and Search Console > Core Web Vitals.

| Page | Before | After |
|---|---|---|
| Home: LCP | 1,596 ms | 1,136 ms |
| Home: main-thread blocking (long tasks) | 520 ms (one 525 ms task) | 153 ms (longest 166 ms) |
| Home: transfer | 140 KB (images 89 KB) | 84 KB (images 32 KB) |
| Article: transfer | 131 KB | 58 KB |
| Layout shift (CLS), scrolling the whole home page | 0 | 0 |

## What changed
1. `assets/logo.svg` was an 18.7 KB file that was really a PNG inside an SVG, loaded on every page. Now a 2.8 KB lossless-looking WebP in the same wrapper.
2. Markdown images and the home gallery now use `<picture>` + WebP. Before, the same screenshot was downloaded twice (JPG and WebP).
3. In-game WebP images compressed harder (gameplay 85 KB -> 68 KB). UI screenshots keep higher quality so text stays sharp.
4. Google Analytics now loads after the page is idle (the consent default and queued `config` still run first), so it no longer competes with first paint.
5. `content-visibility: auto` on page sections: the browser skips layout/paint of sections far below the fold. Anchor links and `/#hash` URLs render everything once so they land exactly (tested for 9 sections x 2 widths x click and direct load).
6. The hero ember animation fully stops its frame loop when scrolled off-screen.
7. CSS/JS cache: 1 day + 1 week stale-while-revalidate. Files are not fingerprinted, so a longer lifetime would risk stale code.

## Not done on purpose
- 480 px image variants: a 390 px phone at 3x density needs ~1,100 px, so it would never pick them.
- Merging or minifying CSS/JS: total is ~12 KB CSS and ~23 KB JS gzipped, so the gain is tiny next to the readability cost.
- Next.js or a framework: would add JavaScript and slow this page down.
- Lighthouse itself was not run (the sandbox has no network). Run https://pagespeed.web.dev/ on `/`, `/download/` and one article after deploying.
