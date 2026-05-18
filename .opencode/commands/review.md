---
description: Run a code review on changed files (or a path you pass)
agent: plan
---

Run a code review with these inputs:

- Scope: `$ARGUMENTS` if provided, otherwise the current branch's diff vs `main`.
- Changed files (always check):

!git diff --name-only main...HEAD

For each changed file, evaluate (in this order):

1. **Correctness** — bugs, race conditions, broken control flow.
2. **Security** — input validation, auth, secrets, OWASP Top 10.
3. **Performance** — N+1 queries, blocking I/O, unbounded loops.
4. **Maintainability** — naming, duplication, missing tests.

Output one entry per finding using this format:

```
[Severity] <summary>
  Where: <file:line>
  Why:   <one sentence>
  Fix:   <concrete snippet or instruction>
```

End with a one-line verdict: `LGTM`, `Approve with comments`, or `Changes requested`.

Do **not** edit any files in this command — leave the implementation to the developer.
