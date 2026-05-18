---
description: Run the project test suite and triage any failures
agent: build
---

Run the project test suite and triage failures.

1. Detect the runner from the repo and run it:

!cat package.json 2>/dev/null | grep -E '"test"|"scripts"' | head -5

Pick the right command:
- `pnpm test`, `npm test`, `yarn test` for Node
- `pytest` / `python -m pytest` for Python
- `go test ./...` for Go
- `cargo test` for Rust
- Other: read the project's `AGENTS.md` for the canonical command

2. Run it and capture the output:

!{the chosen test command}

3. If everything passes, print a one-line summary and stop.

4. If there are failures:
   - Group them by file
   - For each failing test, open the relevant source and identify the root cause
   - Propose a fix (snippet) but **do not edit files yet** — wait for user approval
   - Distinguish between "test is wrong" and "code is wrong"

5. After the user confirms, apply the fixes and re-run the suite to verify.

Extra arguments (passed to the runner): `$ARGUMENTS`
