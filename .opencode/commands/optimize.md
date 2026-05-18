---
description: Suggest concrete performance improvements for the given file or directory
agent: plan
---

Analyze the target for performance issues: `$ARGUMENTS` *(or the current branch's changes if empty)*.

Cover these dimensions in this order:

1. **Algorithmic** — wrong data structure, O(n²) where O(n) is possible, repeated work.
2. **I/O** — N+1 queries, missing indexes, sync calls on hot paths, unbatched network requests.
3. **Memory** — unbounded growth, leaks, large in-memory snapshots that could stream.
4. **Frontend (if applicable)** — re-render cascades, large bundles, unmemoized expensive renders, blocking main-thread work.
5. **Micro-optimizations** — only if (1)–(4) are clean and the call site is genuinely hot.

For each suggestion, output:

```
[Impact] <summary>
  Where:  <file:line>
  Before: <snippet>
  After:  <snippet>
  Why:    <one sentence — what's faster and roughly by how much>
```

Impact tiers: **High** (>10× or removes the bottleneck) · **Medium** (2–10×) · **Low** (small constant factor).

**Don't** make the changes yet. End by asking which suggestions to apply.

Optional flag — pass `--apply` in arguments to skip the discussion and implement the High-impact suggestions directly.
