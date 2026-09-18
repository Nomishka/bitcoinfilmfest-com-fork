# Public repository safety review

This repository is public. The rule is simple: if a value would be harmful to publish, it does not belong in Git — even if the file is outside `site/` or is not linked from the website.

## Audit performed

The tracked repository was checked for:

- private key blocks;
- GitHub, AWS, and generic token patterns;
- `.env`, credential, database, backup, and private-directory paths;
- obvious passwords and API-key assignments;
- private-data boundaries in the public documentation.

The repository currently contains **no detected credentials or private-key material**. The existing automated check is [`scripts/check-public-repo.py`](../scripts/check-public-repo.py); it scans tracked files only and intentionally does not read local ignored files or developer credentials.

This is a pattern check, not proof that every public fact is safe. Human review is still required before publishing new research, assets, or operational notes.

## Public by design

These are public-facing values and are expected to be visible:

- festival contact addresses such as `hello@bitcoinfilmfest.com`;
- the subscription destination `mails@bitcoinfilmfest.com` in the shared form endpoint;
- official social links, Telegram links, and the festival Nostr public identifier;
- public GitHub and GitHub Pages URLs;
- public film, company, festival, and newsletter records.

A Nostr **npub** is a public identifier, not a private key. Never commit a seed phrase, nsec, signing key, cookie, or wallet credential.

## Items that need editorial review, not credential rotation

The repository also contains historical research references and operational planning material:

- `docs/context/` contains Notion page URLs used as historical sources;
- `site/_data/sitemap.json` contains builder route inventory and source-path notes;
- handoff and planning files describe migration status, future work, and old hosting sources;
- some archived content includes public contact details and event links.

These are not detected secrets, but they can reveal project history or private-workspace structure. Before adding more material, ask whether the information is needed by a public collaborator. Move genuinely private research to a private repository or private workspace instead of trying to hide it with an unlinked path.

## Never commit

- `.env` files or copied environment variables;
- API keys, OAuth tokens, passwords, cookies, session files, or private keys;
- mailing-list exports, signup logs, ticket lists, or volunteer spreadsheets;
- private film permissions, contracts, unreleased cuts, or licensing correspondence;
- private Google Drive, OneDrive, Notion, or Dropbox links;
- raw backups, database files, or server configuration exports.

The `.gitignore` covers common local credential and build-artifact paths, but `.gitignore` is not a security boundary. It cannot remove something already committed.

## If a secret is ever committed

1. Stop using it immediately.
2. Revoke or rotate it at the provider.
3. Remove it from the working tree and Git history according to the provider’s incident procedure.
4. Check forks, Actions logs, releases, and cached artifacts.
5. Record the remediation without copying the secret into an issue, commit, or handoff.

Deleting a line from the latest commit is not enough if the value existed in an earlier public commit.

## Logging rule

Use comments for code-level reasons, not private context. Use commit messages for concise, factual change history. Use `BUILD-LOG.md` for verified build/deployment results. Use this document for reusable public/private boundaries. Private operational details belong outside this public repository.
