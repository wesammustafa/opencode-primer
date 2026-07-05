---
description: Open a pull request from the current branch with a generated title and summary
agent: build
---

Create a pull request from the current branch:

1. Read the current state:

!`git status --short`
!`git log main..HEAD --oneline`
!`git diff main...HEAD --stat`

2. Decide on a PR title:
   - Match the repo's conventional-commits style (`feat:`, `fix:`, `refactor:`, `docs:`, …)
   - One short sentence, under ~70 chars
   - Imperative voice ("Add X" not "Added X")

3. Write the PR body using this template:

```
## Summary
<1–3 bullets — what changed and why, not how>

## Test plan
- [ ] <verifiable step>
- [ ] <verifiable step>
```

4. Push the branch if it's not yet on the remote, then create the PR:

```bash
git push -u origin HEAD       # only if needed
gh pr create --title "<title>" --body "<body>"
```

5. Print the resulting PR URL when done.

Extra context (optional, from the user): `$ARGUMENTS`

**Don't** force-push, amend pushed commits, or rebase main into the branch unless explicitly asked.
