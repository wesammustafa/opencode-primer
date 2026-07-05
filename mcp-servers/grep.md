# Grep MCP (by Vercel)

> Code search across public GitHub. Useful for "how do real codebases use X?" research without leaving OpenCode.

## When to reach for it

- Researching idiomatic usage of an API or pattern
- Finding examples of a library you're new to
- Comparing implementations across major open-source projects
- Pre-deciding between two patterns by seeing which is more common

## Setup

No API key needed for the public endpoint.

Add to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```

Restart OpenCode. Verify:

```bash
opencode mcp list
```

## Example prompts

```text
use gh_grep to search for "useTransition" usage in React 19 codebases.
Find the 3 most common patterns and summarize when each is used.
```

```text
search github via gh_grep for examples of "drizzle-orm" with
"transaction" — show me how production codebases structure transactions
```

```text
use gh_grep to find how big public Tailwind v4 projects organize their
theme tokens. Pull 3 examples I can browse.
```

## What it can do

- Regex / literal search across public GitHub
- Filter by language, repo, file path
- Return code snippets with surrounding context
- Pagination through large result sets

## What it won't do

- Search private repos (only public)
- Replace GitHub's own search for finding *issues* or *PRs* (use the GitHub MCP for those)
- Grade code quality — you'll see code that's wrong as often as code that's right

## Patterns

### Compare two patterns

```text
use gh_grep to count occurrences of `useFormState` vs `useActionState`
in production React codebases (Next.js 15+). Report the ratio and the
top 5 examples for each.
```

### Validate an approach

```text
I'm thinking of using event sourcing for our audit log. Use gh_grep to
find production codebases doing this in TypeScript, and tell me what
patterns they share. Skip the "hello world" projects.
```

## Gotchas

- **Public only** — anything behind a private repo is invisible.
- **Quality varies** — half of GitHub is half-finished side projects. Filter by repo popularity or maintainer when possible.
- **No semantic search** — it's literal/regex, not "code that does X". Be precise in your queries.

## Resources

- [grep.app](https://grep.app/) — same backing service, web UI
- [Vercel's announcement](https://vercel.com/blog/grep-a-million-github-repositories-via-mcp) — Grep MCP launch post

> ⚠️ **Warning:** `mcp.grep.app` was intermittently unreachable when last checked (2026-07-05). If `opencode mcp list` shows the server failing to connect, that may be why — try again later.
