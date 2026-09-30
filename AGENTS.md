# AGENTS.md

Entry point for any agent working on the Bitcoin FilmFest site
(`github.com/itstomekk/bitcoinfilmfest-com`, live at https://bitcoinfilmfest.com).

Read this first, then `site/README.md` for editing and `site/design.md` for the visual
system. `BUILDER-GUIDE.md` is the human-facing index. When documents disagree with the
source files, the source files win.

## What this is

A Jekyll 3.10.0 static site deployed to GitHub Pages. Source in `site/`. There is no
database, no API, and no server-side code: content is Markdown + front matter, rendered
by Liquid templates.

| I want to change | Edit | Do not duplicate |
| --- | --- | --- |
| a normal page | `site/<slug>.md` | nav, footer, or frame markup |
| a menu link | `site/_data/navigation.yml` | hard-coded links in pages |
| a film record | `site/_films/<slug>.md` | film schema markup in the template |
| the shared frame | `site/_layouts/default.html`, `site/_includes/` | per-page shells |
| palette, type, spacing, motion | `site/tokens.css` then `site/design.md` | one-off colors or fonts |
| component styling | `site/assets/css/cinema-frame.css` | new color literals |

## Working copy can be stale

`C:\Users\Lenovo\OneDrive\Bitcoin FilmFest\website\rebuild-jekyll` has previously been
20+ commits behind `origin/main`. `git fetch` and diff before auditing or editing, or
build a fresh worktree. Auditing a stale checkout wastes an entire session.

## Build

```bash
# exactly what deploy runs
bundle exec jekyll build --trace --config _config.yml

# what the PR preview job runs (adds the github.io url + /bitcoinfilmfest-com baseurl)
bundle exec jekyll build --trace --config _config.yml,_config.github-pages.yml
```

`.github/workflows/deploy-pages.yml` builds with `_config.yml` **only** and publishes on
every push to `main`. `pr-check.yml` runs the preview build plus the safety scan.
`BUILDER-GUIDE.md` still claims the custom domain is "deliberately deferred" and lists
the github.io URL as live; that text is stale, the domain is live.

## Gates that must pass before a PR

```bash
python scripts/check-public-repo.py            # secret + forbidden-path scan
python scripts/check-changelog.py --base origin/main --head HEAD
python -m unittest discover -s scripts -p "test_*.py"
python scripts/check_bff27_page.py --root <NATIVE> --built <_site>/27/index.html
python scripts/check_bff25_page.py --root <NATIVE>
python scripts/check_archive_pages.py --root <NATIVE> 23 24
python scripts/check_bff26_page.py --source site/26.md --built <_site>/26/index.html --assets <_site>/26/26-assets
```

**Pass `C:/Users/...` native paths, not MSYS `/c/Users/...`.** These are native Windows
Python invocations; MSYS paths get rewritten to `C:\c\Users\...` and every check reports a
false "missing source".

`check-changelog.py` requires a `## YYYY-MM-DD — ...` heading (em dash - the script
enforces it) for any change touching `site/`. Add the entry in the same commit.

Never commit `__pycache__`: `git add -A` after running the unit tests picks it up, and the
repo has no ignore rule for it.

## The traps

These have each already caused a shipped bug. They are not style preferences.

### `entry.url` on a collection document is not your front matter

Jekyll reserves `url` on a collection document for the document's own generated route, and
it shadows a front-matter `url:` key. `_chronicle` is `output: false`, so that route is
never written and every link built from `entry.url` 404s. Name the key something else
(`link:`) and read that. Ten dead links on `/reel/` came from exactly this.

### `.cinema-hero` pulls itself up under the fixed nav

`margin-block-start: calc(var(--nav-height) * -1)` paid back as `padding-block-start`. That
is correct only when the hero is the first element in the content flow. On a film profile
the `← All films` back link comes first, so the pull-up covered the link and made it
unclickable on the 38 profiles that render a poster hero. Any new element added above a
`.cinema-hero` re-introduces this.

### `.cinema-hero` is defined more than once

`site/assets/css/cinema-frame.css` styles `.cinema-hero` in two top-level blocks plus a
media block. The last one wins on every conflicting property, so `/cinema/`'s hero is
really a flex box with a 55vh min-height even though the earlier block describes a grid.
Editing one silently changes both pages. This is a known wart, not intent: if you touch it,
worth splitting into two class names first.

### `_films/` mostly does not declare `layout:`

64 files, only 12 with an explicit `layout: film` - the rest inherit it from `_config.yml`
collection defaults. Grepping for `layout:` undercounts the collection badly.

### Test that a link is clickable, not just present

The `← All films` bug looked perfectly fine: the text rendered legibly on the light paper
strip. It was only detectable from `document.elementFromPoint` (which returned the hero)
and from `page.click()` timing out. Never conclude a control works because the HTML and CSS
look right.

## Verifying a change

Build, then compare against a pristine `origin/main` build. Eyeballing is not verification.

1. Serve both `_site` trees on different ports (`python -m http.server`).
2. Screenshot with Playwright at `reduced_motion="reduce"` plus injected
   `animation:none; transition:none; transform:none`.
3. **Scroll the full page height before capturing** and wait for `networkidle`. `/cinema/`
   has 559 lazy images; skip this and the page height swings by thousands of pixels and
   looks like a regression that is purely load-timing noise.
4. Diff with `PIL.ImageChops.difference`. The bar is identical size and zero differing
   pixels. Schema, meta, and footer-field edits must come out pixel-identical; if they do
   not, the difference is real.

Sites like this also reward a static sweep: crawl the built `_site`, collect every
`href`/`src`, and assert each target exists. That is how the 12 dead links were found.

## Reserved code: do not delete because it looks unused

The page is live at `/sitemap/` and linked from the shared footer (not the primary nav).
Its current-page groups are generated from Jekyll pages/collections; legacy migration rows
come from `site/_data/sitemap.json`. Keep counts out of the template and update the source
inventory only when status changes.

- **`.edition-masthead`, `.edition-year`, `.edition-date`, `.edition-intro`,
  `.edition-actions`** - referenced in the edition handoff docs.
- **`.bff26 .friends-grid`, `.friends-fw`, `.friends-tier-label`, `.prague-teaser`,
  `.trezor-mark`** - older edition furniture, referenced in docs.
- **`.cinema-poster`, `.footer-links`, `.bff25-event-record`, `.bff23-uncertainty`,
  `.hero-when`, `.warsaw-eats-head`** - appear in no markup and no plan doc. These are the
  genuine dead-code candidates.

## Content model

Film records in `site/_films/` already carry everything needed for rich results: `title`,
`description`, `synopsis`, `year`, `runtime`, `director`, `cast`, `studio`, `country`,
`poster`, `poster_alt`, `poster_credit`, `poster_source_url`, `type`, `status`, `stills`.
`site/_includes/head-meta.html` publishes a `Movie` node from them.

`type` is `Feature`, `Documentary`, or `Short`. Only `Documentary` is a genre; the others
are release forms, so only `Documentary` is emitted as `genre`. Do not "fix" that by
mapping all three.

Two records (`bitcoin-cowboys-wyoming`, `bond-to-unbind`) have `director: null` and no
`cast`. The schema omits absent fields rather than inventing them. That is a content gap to
fill in the record, not a template bug.

Legacy edition URLs follow a fixed pattern: `site/*-legacy.md` with a `permalink`,
`robots: noindex, follow`, `sitemap: false`, a canonical link, and a meta refresh to the
canonical archive. Applied to `/bff23/ /bff24/ /bff2024/ /bff25/ /bff26/`.

## Known open work

- **Image weight is the largest win available.** `/23/` loads ~105 MB, `/cinema/` ~25 MB,
  `/cinema/films/` ~23 MB. 2067 `<img>` tags, zero `srcset`, zero `<picture>`, no
  WebP/AVIF, and 1241 of 1704 images lack `width`/`height`. Needs its own pipeline change.
- **CSS is one 159 KB unminified file** with no cache busting, served on every page.
- 24 pages share one generic meta description; 33 titles exceed 60 characters.
- `/festival-flashbacks/` is listed in `site/_data/sitemap.json` but has no route. Internal
  links now point at the canonical `/24/`.
