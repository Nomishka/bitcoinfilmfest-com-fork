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

## Owner feedback, round 2 (2026-09-28): A chosen, refined
- Likes **A Aisle walk**. Requirements applied: no audience (heads removed everywhere, E images re-rendered empty), seats fully solid (no gaps between seats, dark backing under bases/aisles, passing rows slide off the bottom instead of fading), **max 3 rows on screen** (third row rises from behind the second), gentler motion.
- Motion is now eased (scroll progress lerp 0.09/frame, pointer lerp 0.06/frame). Defaults: Walk = 1.5 rows across the whole page, Look = 20% of the original pointer strength. Both are sliders in the lab bar so the owner can tune; carry the chosen values into production.

## Owner feedback, round 3 (2026-09-28)
- No vertical seam on seat backs (removed).
- Seats 1.3x bigger by default; **Size** slider (0.8–2x).
- **Arms** slider = armrest width = gap between seats (0–40% of seat width, default 18%). Armrest is drawn as `.seat::after` in the gap to the left of each seat; row `gap: var(--arm)`.
- Phones keep physically large seats: base seat width is W/4.2 below 700px (about 3 across at 1.3x), else max(W/7, 0.11H).
- **No row is ever revealed**: exactly 3 rows exist; walking only removes rows off the bottom. Walk slider max is 2 (then one row remains).
- Walk geometry is now in seat-height units (eye 1.83h, drop 0.49h, front row bottom at H + 0.37h), so phone and desktop compose the same.
- Tuning controls moved to a collapsible "Tune" panel (collapsed on phones).
- (Superseded by round 4 defaults below.)

## Owner feedback, round 4 (2026-09-28)
- Owner's chosen values: **Look 35%, Walk 0.75 rows, Arms 0%**, Size stays at the bigger 1.3x. Now the lab defaults.
- Added **Position** slider (-0.5 to +1 seat heights; positive = lower). Owner felt rows sat too high; default +0.20 while they test. Carry their final value into production.

## Owner feedback, round 5 (2026-09-28)
- **B "Take your seat" is wanted ONLY at the top of the homepage** (first screen of scroll). Parked: "we will come back to that later". Do not add it to other pages.
- Position chosen: **+0.30 seat on desktop, 0.00 on phones** (<700px). Stored separately (posDesk / posMob); the slider edits the current device's value.
- New seat **Colour** (picker + swatches: cinema blue #2b3a55 default, red velvet, BFF orange, charcoal, screen blue). Implemented as `--seat` on :root with color-mix shading (needs Chrome 111+/Safari 16.2+/Firefox 113+).
- New **Pattern** (upholstery) on `.seat > i`: none, pinstripe, quilted, dots, ₿ logo, orange heart, or the owner's own uploaded image (tiled/centred, FileReader data URL, not saved anywhere). Scale and Strength sliders. Owner has not yet picked colour/pattern.

## Owner feedback, round 6 (2026-09-28) — values LOCKED
- **Locked** (removed from the Tune panel, hard-coded, shown as a read-only "Locked" line): Size 1.30x, Position +0.30 desktop / 0.00 phone, Arms 0%, Walk 0.75 rows, Look 35%, **seat colour rgb(5, 18, 26) = #05121a**. Do not reintroduce sliders for these unless the owner asks.
- Pattern work continues: Scale range now 0.05–3 (default 0.25, owner wants very small patterns), new **pattern colour** picker (default #f7931a), and 18 presets in groups: Lines (pinstripe, corduroy, diagonal, grid, crosshatch, quilted), Weaves (checker, houndstooth, herringbone, chevron, waves, dots), Motifs tiled (tiny ₿, hearts, stars, rabbits, film strip), Single emblem (₿ logo, heart), plus the owner's uploaded image. Owner has not picked a pattern yet.

## Verified
- Jekyll build passes locally with the lab page (needs `LANG=C.UTF-8` in a bare container, otherwise SCSS fails on UTF-8).
- Headless Chromium screenshots of all five versions at 0/20/60% scroll: no JS errors, all render.
- Not verified: Safari/Firefox, real phones, soft navigation interaction (the lab is outside the shared shell).

## Next steps
1. Owner picks pattern, pattern colour, scale and strength (everything else is locked, see round 6). If they upload their own pattern, save that file to site/assets/images/ for production.
2. Port into `site/_layouts/default.html`: replace the `<img class="cinema-seats">` with the rows container, move the chosen CSS into `cinema-frame.css` (use tokens), move the engine into `main.js`, keep `prefers-reduced-motion` and the soft-navigation contract (seats stay mounted; recompute on `bff:navigated`/route swap).
3. Tune overlap so the rows never cover text: in A the far rows converge at ~0.8 of viewport height; D/E cover ~130 px at 1280×800.
