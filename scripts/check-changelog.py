#!/usr/bin/env python3
"""Require a dated human-readable changelog entry for website changes.

The check is deliberately small and dependency-free. It prevents a source
change from reaching a PR or Pages deployment without an easy-to-read note.
It does not try to write prose automatically: a person must describe the
change so the log remains useful to future collaborators.
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys

parser = argparse.ArgumentParser()
parser.add_argument("--base", help="base commit to compare against")
parser.add_argument("--head", default="HEAD", help="head commit to compare")
args = parser.parse_args()

if not args.base:
    print("Changelog check skipped: no comparison base was provided.")
    raise SystemExit(0)

try:
    changed = subprocess.check_output(
        ["git", "diff", "--name-only", args.base, args.head], text=True
    ).splitlines()
except subprocess.CalledProcessError as error:
    print(f"Changelog check could not compare {args.base} to {args.head}: {error}")
    raise SystemExit(1)

website_changes = [path for path in changed if path.startswith("site/")]
if not website_changes:
    print("Changelog check passed: no website-source files changed.")
    raise SystemExit(0)

if "CHANGELOG.md" not in changed and "BUILD-LOG.md" not in changed:
    print("Changelog check failed: website source changed without a log update.")
    print("Add a dated entry to CHANGELOG.md. Use BUILD-LOG.md for detailed verification notes.")
    print("Changed website files:")
    print("\n".join(f"- {path}" for path in website_changes))
    raise SystemExit(1)

try:
    changelog = open("CHANGELOG.md", encoding="utf-8").read()
except OSError:
    print("Changelog check failed: CHANGELOG.md is missing.")
    raise SystemExit(1)

if not re.search(r"^##\s+\d{4}-\d{2}-\d{2}\s+—", changelog, re.MULTILINE):
    print("Changelog check failed: add a dated heading like '## 2026-09-15 — Change'.")
    raise SystemExit(1)

print("Changelog check passed: website source changed and a dated log exists.")
