<p align="center">
  <img src="site/assets/images/brand/bff-logo-white.png" alt="Bitcoin FilmFest" width="180">
</p>

<h1 align="center">Bitcoin FilmFest — the heart of Bitcoin Cinema</h1>

<p align="center">
  <strong>A cinematic, editorial website for films, filmmakers, festivals, and the culture around Bitcoin.</strong>
</p>

<p align="center">
  <a href="https://itstomekk.github.io/bitcoinfilmfest-com/">Live site</a> ·
  <a href="https://github.com/itstomekk/bitcoinfilmfest-com/actions">Build status</a> ·
  <a href="https://bitcoinfilmfest.com">Future canonical domain</a>
</p>

---

## What this repository is

This is the public source repository for [bitcoinfilmfest.com](https://bitcoinfilmfest.com). It contains the Jekyll source, editorial content, design system, image assets, and GitHub Actions deployment workflow.

The site is intentionally static:

```text
Markdown + YAML + local media
            ↓
Jekyll layouts, includes, CSS, and JavaScript
            ↓
GitHub Actions builds site/_site
            ↓
GitHub Pages publishes the website
```

The current public preview is:

https://itstomekk.github.io/bitcoinfilmfest-com/

The custom domain is deliberately not connected yet. Do not add a `CNAME` file or change DNS until the domain cutover checklist is approved.

## The BFF experience

Bitcoin FilmFest is not a generic conference landing page. The site is built as a cinema room:

- **blue screen** for the homepage and festival editions;
- **warm paper** for readable articles, newsletters, and catalogue pages;
- a persistent bezel, theatre seats, rabbit mark, and shared footer;
- editorial routes for the festival archive and the wider Bitcoin Cinema ecosystem;
- a shared subscription form that sends signups to the festival inbox through FormSubmit.

The visual rules live in [`site/design.md`](site/design.md), while reusable values live in [`site/tokens.css`](site/tokens.css).

## Start here

| Goal | Read or edit |
| --- | --- |
| Make a normal page | [`site/README.md`](site/README.md) |
| Add a newsletter | [`site/_newsletters/`](site/_newsletters/) |
| Edit navigation | [`site/_data/navigation.yml`](site/_data/navigation.yml) |
| Edit credits | [`site/_data/credits.json`](site/_data/credits.json) |
| Change the shared footer | [`site/_includes/footer.html`](site/_includes/footer.html) |
| Change the shared page shell | [`site/_layouts/default.html`](site/_layouts/default.html) |
| Change visual tokens | [`site/tokens.css`](site/tokens.css) |
| Add component styling | [`site/assets/css/cinema-frame.css`](site/assets/css/cinema-frame.css) |
| Change interactive behavior | [`site/assets/js/`](site/assets/js/) |
| Understand the migration plan | [`REBUILD-PHASES.md`](REBUILD-PHASES.md) |
| Understand current handoff and ownership | [`BUILDER-GUIDE.md`](BUILDER-GUIDE.md) |
| See verified milestones | [`BUILD-LOG.md`](BUILD-LOG.md) |
| Review public/private boundaries | [`docs/PUBLIC-REPO-SAFETY.md`](docs/PUBLIC-REPO-SAFETY.md) |

## Local development on Windows

The verified local toolchain is RubyInstaller Ruby 3.3.12, Bundler 2.5.22, GitHub Pages 232, and Jekyll 3.10.0.

```bash
cd site
C:/Ruby33-x64/bin/bundle.bat install
C:/Ruby33-x64/bin/bundle.bat exec jekyll build --trace
C:/Ruby33-x64/bin/jekyll.bat serve --host 127.0.0.1 --port 4000 --trace
```

Open `http://127.0.0.1:4000/` for the local preview.

## Contribution workflow

1. Start from an up-to-date `main` branch.
2. Create one focused branch for one change.
3. Edit the smallest responsible source file.
4. Add a short comment when the code has a non-obvious reason, boundary, fallback, or future replacement point. Do not comment obvious syntax.
5. Run the Jekyll build and inspect the affected route at desktop and mobile widths.
6. Run `git diff --check` and the public-repository safety check.
7. Commit with an honest message such as `Add BFF25 newsletter route` or `Fix mobile cinema navigation`.
8. Open a pull request. A push to `main` triggers GitHub Pages deployment.
9. Verify the public URL and the green Actions run before calling the work complete.

### How decisions are logged

- **Code comments** explain local implementation choices and safety boundaries.
- **`CHANGELOG.md`** records short, dated public changes; CI requires an entry when website source changes.
- **`BUILD-LOG.md`** records detailed verified milestones, tests, deployment results, and known gaps.
- **`BUILDER-GUIDE.md`** records ownership and non-regression rules.
- **`HANDOFF-CURRENT.md`** records the current operational state.
- **Git commit messages and pull requests** record the change history.
- **`docs/`** holds durable research and public/private data-boundary guidance.

Do not put private conversations, credentials, raw contact lists, or unverified claims into comments or commit messages.

## Why the CSS is large

The CSS is not a framework dump. It is the implementation of the site’s single shared cinema system:

- theatre frame, bezel, screen surfaces, and fixed seats;
- responsive navigation and disclosure states;
- homepage, edition, catalogue, newsletter, credits, footer, and form components;
- typography, focus states, reduced-motion behavior, and mobile layouts;
- film-grain and projector details that create the BFF atmosphere.

The repository currently has roughly **2,316 lines of CSS**, compared with about **434 lines of JavaScript**. That is expected for a design-led static site: the browser needs explicit rules for every responsive visual state, while the JavaScript is deliberately small and limited to navigation, progressive enhancement, credits motion, and subscription submission.

The important split is:

- `site/tokens.css` — canonical colours, typography, spacing, motion, and layering values;
- `site/assets/css/cinema-frame.css` — layout and component rules;
- `site/design.md` — the human-readable design contract.

Prefer changing a token or shared component over adding a one-off page rule.

## Public repository safety

This repository is public. Anything committed here is readable by anyone, even if Jekyll does not publish it as a web page.

Never commit:

- passwords, API keys, private keys, cookies, or access tokens;
- mailing-list exports or private contact databases;
- film contracts, licensing documents, or private production notes;
- `.env` files, backups, local databases, or private cloud links;
- information that is only safe because a page is currently unlinked.

The repository includes a dependency-free safety check in [`scripts/check-public-repo.py`](scripts/check-public-repo.py). It runs in pull-request checks and scans tracked files for forbidden paths and common credential patterns. See [`docs/PUBLIC-REPO-SAFETY.md`](docs/PUBLIC-REPO-SAFETY.md) for the audit and the current known review items.

## Project structure

```text
site/                       Jekyll website source
site/_includes/             Shared navigation, footer, and head fragments
site/_layouts/              Shared page structures
site/_data/                 Navigation, credits, and builder data
site/_films/                Public film records
site/_companies/            Public company/ecosystem records
site/_chronicle/            Builder/editorial chronology
site/_newsletters/          Published newsletter records
site/assets/css/            Cinema-frame component styling
site/assets/js/             Progressive-enhancement behavior
site/assets/images/         Local production media
.github/workflows/          Build and GitHub Pages deployment
scripts/                    Repository safety checks

docs/                       Durable research and safety guidance
BUILD-LOG.md                Verified project record
BUILDER-GUIDE.md            Ownership and builder rules
HANDOFF-CURRENT.md          Current project handoff
```

## License and content use

The repository is a collaboration and publishing source for Bitcoin FilmFest. Code and content may have different rights. Do not reuse festival logos, photography, film stills, contributor names, or third-party editorial material without checking the relevant permission and source notes.
