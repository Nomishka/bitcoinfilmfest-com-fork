---
name: seat-lab
description: Iterate on the Seat Lab prototype (scroll-driven 3D cinema seats) at site/lab/seats/ for bitcoinfilmfest.com, or port the chosen seat effect into the shared layout. Use when the owner asks to change seat size, position, colour, pattern, motion, rows, or to ship the seats.
---

# Seat Lab

Read `HANDOFF-SEAT-LAB.md` first: it holds every owner decision so far (chosen values, rules such as "max 3 rows, never reveal new rows", "no audience", "B only on the homepage").

## Production (live since 2026-09-28)
- `site/assets/css/cinema-seats.css`, `site/assets/js/cinema-seats.js`; settings are data attributes on `.seat-rows` in `_layouts/default.html` AND in the 35 standalone pages (`26/press/*.html`, `presskit/index.html`). Change all of them together (a python loop over the files replacing the attribute block works).
- Check production after a change: build, serve the build output with `python3 -m http.server`, and in Playwright assert `html.seat-rows-live` and 3 `.sr-row` on /, /cinema/, /26/press/, /presskit/.
- Shell gotcha: always quote heredocs (`<<'EOF'`) when the text contains backticks.

## Files
- `site/lab/seats/index.html`: the lab. Jekyll front matter + a wrapper, then a self-contained fragment (inline CSS/JS). The same fragment (without the wrapper) is published as the owner's Claude artifact.
- `site/lab/seats/rows/*.png` + `scripts/seat-rows/`: version E images and their renderer.

## Iteration loop (worked smoothly 5 rounds)
1. Edit the fragment (everything between `<body>` and `</body>` in the lab file). Prefer small python `str.replace` edits with an `assert` that the old text exists.
2. Check once: serve a copy with a `<meta charset="utf-8">` head (without it the text garbles) via `python3 -m http.server`, screenshot with Playwright (`require($(npm root -g)/playwright)`) at 1280x800 and 390x844, wait ~1.5s after scrolling because motion is eased. A new page per version: a hash change alone does not reload.
3. Build: `cd site && LANG=C.UTF-8 LC_ALL=C.UTF-8 bundle exec ruby $(bundle exec ruby -e 'print Gem.bin_path("jekyll","jekyll")') build -d /tmp/bff`. (`bundle exec jekyll` is not on PATH in the cloud container; without UTF-8 locale SCSS fails.)
4. `python3 scripts/check-public-repo.py`, add a line to the dated CHANGELOG entry, update HANDOFF-SEAT-LAB.md with the owner's new decisions, commit, push the feature branch.
5. Republish the artifact from the same file path (same URL).

## Gotchas
- Layers are `display:none` when inactive: measure row sizes with the layer temporarily shown (see `measure()`).
- Walk geometry is in seat-height units so phone and desktop compose the same; don't reintroduce viewport-height constants.
- Clip-path for version B is in element coordinates after the pin translate: `inset(0 0 elH - visH 0)`.
