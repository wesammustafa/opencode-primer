---
name: git-release
description: Draft release notes from merged PRs, propose a semver bump, and emit a copy-pasteable `gh release create` command. Use when preparing a tagged GitHub release.
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## What I do

1. Read recent merged PRs since the last tag and group them:
   - **Features** (`feat:` commits)
   - **Fixes** (`fix:`)
   - **Other** (`refactor:`, `perf:`, `docs:`, `chore:`, …)
2. Propose a **semver bump** based on the diff:
   - Major if any breaking changes (look for `BREAKING CHANGE:` footers or `!:` markers)
   - Minor if any features
   - Patch otherwise
3. Emit a clean **release-notes draft** in Keep-a-Changelog format.
4. Print a ready-to-run command:

```bash
gh release create v<version> --title "<title>" --notes-file release-notes.md
```

## When to use me

When the user is preparing a tagged release. Triggers include:
- "draft release notes"
- "prepare a release"
- "what's in v1.X.Y?"

Ask the user to confirm the proposed version bump before running anything destructive (tag creation, release publish).

## What I need from the repo

- `gh` CLI must be authenticated.
- The repo should have at least one prior tag — if not, propose `v0.1.0`.
- Conventional-commit messages are ideal but not required; without them, I'll group by PR labels or fall back to plain summaries.

## What I won't do

- Push tags or publish releases without explicit confirmation.
- Edit the working tree.
- Generate fictional changelog entries — if a PR is unclear, I quote the original PR title verbatim and flag it for review.
