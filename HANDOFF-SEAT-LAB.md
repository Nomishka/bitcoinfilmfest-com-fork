# Handoff — Seat Lab (scroll-driven cinema seats)

Updated: 2026-09-28 · branch `claude/gifted-wozniak-wcnif9`

## Why
Owner wants the site to feel like sitting in a cinema: the screen in the middle, the dark room around it, and rows of seats in front that move and create depth as you scroll. The current shared seats (`site/assets/images/cinema-seats.png`, animated in `site/assets/css/cinema-frame.css` `.cinema-seats` + fallback in `site/assets/js/main.js`) *do* animate, but only `scale(1 → 1.11)` spread across the whole page height on one flat strip, so visitors read it as static. Verified in Chromium: transform goes 1 → 1.055 → 1.11 at 0/50/100% scroll.

## What exists
- `site/lab/seats/index.html` — self-contained prototype (inline CSS/JS, no Jekyll layout, noindex, `sitemap: false`). Five versions, switch with the tab bar, keys 1–5, or `#a`…`#e`:
  - **A Aisle walk**: 11 CSS rows (34 seats, 2 aisles with step lights) in a hand-rolled pinhole projection (`walk(k)`); whole page scroll = walking 4 rows forward.
  - **B Take your seat**: first 0.9 viewport of scroll pins and scales the screen from 0.56 → 1, room lights fade, rows pass (3), then the page scrolls normally. Uses `translateY(pin) scale()` + `clip-path` on `<main>` and adds `margin-bottom` equal to the intro length.
  - **C Raked floor**: one element, `perspective() rotateX(50deg)`, gradient seats, `--fy` = scrollY × 0.5.
  - **D Parallax stack**: 3 CSS rows, each with its own scale/translate per scroll progress.
  - **E Image rows**: 3 PNG rows (`site/lab/seats/rows/seats-{back,mid,front}.png`), animated independently; you advance exactly one row across the page. Replace the PNGs with AI/photo art of the same names to restyle (keep transparent background, same perspective, bottoms aligned).
- Toggles: Audience (heads, incl. one Mr. Rabbit), Look around (pointer parallax), Motion (respects `prefers-reduced-motion` by default).
- `scripts/seat-rows/` — renderer for the E images (Playwright; see header of `render.js`).
- Published preview (owner's private artifact): https://claude.ai/artifact/Sptff4DHa3bEcM5sBWaZNV

## Verified
- Jekyll build passes locally with the lab page (needs `LANG=C.UTF-8` in a bare container, otherwise SCSS fails on UTF-8).
- Headless Chromium screenshots of all five versions at 0/20/60% scroll: no JS errors, all render.
- Not verified: Safari/Firefox, real phones, soft navigation interaction (the lab is outside the shared shell).

## Next steps
1. Owner picks a version (suggested: D or E site-wide, B only on the homepage).
2. Port into `site/_layouts/default.html`: replace the `<img class="cinema-seats">` with the rows container, move the chosen CSS into `cinema-frame.css` (use tokens), move the engine into `main.js`, keep `prefers-reduced-motion` and the soft-navigation contract (seats stay mounted; recompute on `bff:navigated`/route swap).
3. Tune overlap so the rows never cover text: in A the far rows converge at ~0.8 of viewport height; D/E cover ~130 px at 1280×800.
