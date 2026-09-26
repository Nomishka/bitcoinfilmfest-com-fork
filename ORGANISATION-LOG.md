# Organisation log — Bitcoin FilmFest website

Running, dated record of what is happening on the website work: who did what, which PR, what is open, who acts next. Newest entry first.

This file is **public**. Write no private contacts, CRM notes, credentials, private links, or unverified claims. The private organisation log on the team's own drive stays the place for private detail.

Entry template:

```text
## YYYY-MM-DD — Short title
- Who: person or agent
- Done: what changed
- PR: link
- Open / next: what is left and who acts next
```

---

## 2026-09-26 — Cloudflare check failing on PR 5

- Who: Claude (agent), asked by Nomishka.
- Done: Looked into the red check on https://github.com/Nomishka/bitcoinfilmfest-com-fork/pull/5. The failing check is `Workers Builds` (Cloudflare Workers Git integration). It fails right away, before building anything. The repo's own `Public-safe Pages preview build` check passes. No code change fixes it; the problem is a setting in the Cloudflare dashboard.
- PR: https://github.com/Nomishka/bitcoinfilmfest-com-fork/pull/5 (explanation posted as a PR comment).
- Open / next: Nomishka either disconnects the repo in Cloudflare, or sets it up as Cloudflare Pages (root `site`, build `bundle exec jekyll build`, output `_site`). PR 5 can be merged either way.

## 2026-09-23 — Agent working rules and GitHub guide

- Who: Claude (agent), requested by Nomishka.
- Done: Read the knowledge base (README, BUILDER-GUIDE, HANDOFF-CURRENT, COLLABORATION, CHANGELOG, BUILD-LOG, roadmap, PR checks). Added `CLAUDE.md` (rules every agent follows: read the KB, work via PRs, log and hand off, guide Nomishka), this organisation log, and `docs/GITHUB-GUIDE-NOMISHKA.md` (step-by-step GitHub process). No website pages changed.
- PR: into `Nomishka/bitcoinfilmfest-com-fork` `main` from `claude/adoring-hawking-54yiw3`.
- Open / next: Nomishka reviews and merges the PR in the fork, then decides whether to send these process files upstream to Tomek. Website state is unchanged from `HANDOFF-CURRENT.md` (next up: Phase 2 content programme).
