# Bitcoin FilmFest — changelog

Short, human-readable record of public website changes. One dated entry is required for every source change that affects the website.

## 2026-09-15 — Public documentation and repository cleanup

- Reworked the root README into a branded guide for collaborators and future builders.
- Added the public-repository safety review and documented what must stay outside Git.
- Documented the cinema design system, the CSS/JavaScript split, and the FormSubmit subscription adapter.
- Added the repository description, homepage, and discovery topics on GitHub.
- Added a pull-request check that requires a dated changelog entry when website source changes.

## 2026-09-15 — FormSubmit subscription

- Connected the shared footer form on every route to FormSubmit AJAX.
- Added the `/thanks/` confirmation page, honeypot field, and cache-busting for the subscription script.
- Signups are forwarded to `mails@bitcoinfilmfest.com`; this is notification delivery, not a subscriber database.

## 2026-08-29 — GitHub Pages launch

- Published the Jekyll site through GitHub Actions and GitHub Pages.
- Established the shared cinema shell, navigation, footer, design tokens, and public builder documentation.

## How to add an entry

Add the newest date at the top, using plain language:

```markdown
## YYYY-MM-DD — Short change title

- What visitors or collaborators can now do.
- What route, component, or workflow changed.
- What was verified, if the change involved a build or deployment.
```

For detailed test output, blockers, and implementation history, use `BUILD-LOG.md` and the Git commit or pull request.
