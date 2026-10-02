# Bitcoin FilmFest route reconciliation

This is the builder-safe route inventory for the current Jekyll source. It replaces the older 64/66-route migration estimate, which mixed legacy source URLs with pages that now belong inside the Cinema and Reel hubs.

## Current build counts (verified 2026-09-30)

- Generated HTML routes: 176
- Public/indexable routes: 157
- Shared/core pages: 21 (including this generated sitemap)
- Compatibility redirect outputs: 16
- Film profiles: 64
- Company profiles: 7
- Newsletter detail pages: 0
- Reel detail pages: 30
- Press room pages: 34 (`/26/press/`, EN/PL hub, info-base and article pages)
- Press kit page: 1 (`/presskit/`)
- Builder/lab routes excluded from indexing: 2 (`/effect-lab/`, `/lab/seats/`)
- Legacy-only routes still requiring a decision: 48 planned rows

The generated-route count includes the root route, `/sitemap/`, and the generated `/404.html`; the indexable count excludes all 16 compatibility redirects, both noindex builder/lab pages, and the 404 page. The 10 `_chronicle/` files have `output: false` and produce no routes. Counts were verified against the production-config build on 2026-09-30. The human-readable `/sitemap/` is generated from Jekyll's pages and collections; do not copy counts into its template.

## Current public routes

### Shared core and compatibility output (21 + 16 redirects)

| Route | Source | State |
|---|---|---|
| `/` | `site/index.md` | implemented |
| `/about/` | `site/about.md` | implemented |
| `/23/` | `site/23.md` | implemented |
| `/24/` | `site/24.md` | implemented |
| `/25/` | `site/bff25.md` | implemented, canonical BFF'25 |
| `/26/` | `site/26.md` | implemented |
| `/27/` | `site/27.md` | implemented |
| `/awards/` | `site/awards.md` | implemented |
| `/cinema/` | `site/cinema.md` | implemented, Cinema hub |
| `/cinema/films/` | `site/cinema-films.md` | implemented, film hub |
| `/cinema/companies/` | `site/cinema-companies.md` | implemented, company hub |
| `/credits/` | `site/credits.md` | implemented |
| `/festivals/roadshows/` | `site/festivals-roadshows.md` | implemented |
| `/join/` | `site/join.md` | implemented |
| `/reel/` | `site/reel.md` | implemented, unified Reel archive |
| `/presskit/` | `site/presskit/index.html` | implemented, branding book and downloadable logo/laurel assets |
| `/26/press/` | `site/26/press/index.html` | implemented, restored BFF’26 press room hub |
| `/thanks/` | `site/thanks.md` | implemented |
| `/sitemap/` | `site/sitemap.md` | generated human-readable public route index |
| `/bff23/`, `/bff24/`, `/bff25/`, `/bff26/`, `/bff2024/` | `site/*-legacy.md` | compatibility redirects to canonical edition pages |
| 10 migrated Reel legacy routes | `site/legacy-redirects/` | noindex compatibility redirects |

The 16 compatibility outputs and `/sitemap/` are listed separately so the indexable-page count remains auditable. The 10 `_chronicle/` source notes have `output: false`; they create no routes.

### Collection routes

- 64 film details under `/cinema/films/<slug>/`, from `site/_films/`.
- 7 company details under `/cinema/companies/<slug>/`, from `site/_companies/`.
- 30 Reel details under `/reel/<slug>/`, from `site/_reel/`; interviews, guest posts, and festival coverage share this collection.
- 34 BFF’26 press-room pages under `/26/press/`, including the EN/PL hub, info-base, press articles and article stylesheet.
- 1 standalone `/presskit/` branding book with 14 copied public download assets from the verified local `logos-page` source.
- 10 legacy article routes redirect to their corresponding Reel detail; five edition aliases and `/webmail/` account for the other six compatibility outputs.

## Builder-only routes

- `/effect-lab/` is a local effect comparison tool. It is deliberately `noindex, nofollow`, should not be promoted in navigation, and must not be treated as public content or a migration target.
- `/lab/seats/` is a local design/effect experiment. It is `noindex` and excluded from the public sitemap.

## Legacy reconciliation

The legacy map's 48 planned rows are not 48 new top-level pages. Use these destinations when migrating public-safe material:

### Fold into existing hubs or edition pages

| Legacy routes | Destination |
|---|---|
| `/bff24-event-coverage-bitesize-media-may-2024/`, `/bff24-official-selection-freedom-themed-films/` | `/24/` or a Reel entry linked from `/24/` |
| `/26/laurels/` | `/presskit/` |
| `/festival-flashbacks/` | `/reel/` archive, with edition links where relevant |
| `/bff-rabits/`, `/press-and-media/` | `/26/press/` for the restored BFF’26 press room; `/presskit/` for logos and brand downloads |
| `/cinema-digest-monthly-content/`, `/cinematic-hub/`, `/blog/`, `/cinema-digest/`, `/bff-interviews/` | `/cinema/` and/or `/reel/` |
| `/part-one-official-selection-feature-films-at-bff25/`, `/part-two-official-selection-experimental-shorts-at-bff25/` | `/25/` |
| `/wall/`, `/qr/`, `/linktree/`, `/bitcoin-filmfest-2024-european-halving-party-🐇/`, `/european-halving-party-thankyou/`, `/europeanhalvingparty/` | `/24/` |
| `/pow/` | `/awards/` |
| `/26/wintrezor/` | `/26/` |
| `/unique-bitcoin-video-ads/` | `/reel/` |

These are folds, not permission to copy private notes or recreate campaign microsites.

### Separate public pages worth migrating

- Newsletter entries: preserve the original legacy URL as redirect metadata, but publish the content as ordinary Reel entries under `/reel/<slug>/` unless it is explicitly retained as a newsletter detail.
- Individual interviews and features: the first 10 are now ordinary Reel entries under `/reel/<slug>/`; `/bff-interviews/` remains a hub concept, not a second collection.
- `/privacy-policy/`: keep as a separate legal page when verified and public-safe.
- `/authors/tomek-k/`: only create if an author archive is needed after Reel content exists; otherwise fold author links into Reel metadata.

### Redirects

- `/bff25/` -> `/25/`, `/bff26/` -> `/26/`, `/bff2024/` -> `/24/`, `/bff23/` -> `/23/`, and `/bff24/` -> `/24/` (all implemented compatibility redirects; never duplicate the canonical edition page).
- Legacy individual article, interview, and newsletter URLs should redirect to their Reel entry after migration. Do not create duplicate top-level pages for them.

## Source boundaries and next step

Only reviewed Markdown under `site/` is public source. `_chronicle/` is non-output working material, and private KB/Drive material must stay outside the public repository. The first 10 public-safe Reel entries are now built under `site/_reel/`, with 10 `noindex, follow` compatibility routes preserving their original public URLs.
