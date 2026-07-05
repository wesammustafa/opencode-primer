# Context7 MCP

> Live, version-pinned library documentation piped into the prompt. Grounds OpenCode's answers in **current** API surfaces — not training-data approximations.

## Why this matters

LLMs hallucinate APIs that don't exist or use APIs that were deprecated three versions ago. Context7 fetches real documentation for the libraries you're using at the **version** you're using, and surfaces it to the model.

## When to reach for it

- Working with a library you don't know well
- Working with a library that's recently changed (new React versions, framework migrations)
- Debugging "this function should exist but it doesn't" confusion
- Writing code for SDKs/APIs the model's training data doesn't cover well

## Setup

An API key is optional — the server works without one, but signing up at [context7.com](https://context7.com) for a free key is recommended for higher rate limits.

Add to `opencode.json` (drop the `headers` block if you're going keyless):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

If you use a key, set the env var in your shell:

```bash
export CONTEXT7_API_KEY=ctx7_...
```

Restart OpenCode. Verify:

```bash
opencode mcp list
```

## Example prompts

```text
use context7 to look up the React Router v7 docs for `loader` functions —
specifically how to handle redirects from a loader
```

```text
I'm migrating from Next.js 15 to 16. Use context7 to find the breaking
changes in the App Router and surface the ones that affect our project.
```

```text
use context7 to check the latest Stripe API for the recommended way to
handle webhook signature verification with raw bodies
```

## Resolve before you query

Context7 resolves a library name + version before fetching docs. Patterns that work:

```text
context7: resolve "next.js" v15 — then look up streaming rendering
context7: resolve "tailwindcss" v4 — show me the breaking changes from v3
```

You can also just name the library; Context7 will resolve to the latest version it knows.

## What it covers

Thousands of libraries — React, Next.js, Vue, Angular, Svelte, Tailwind, TanStack, Prisma, Drizzle, Hono, Fastify, Express, Django, FastAPI, Spring, Rails, etc. — plus most major SaaS SDKs (Stripe, Twilio, Sentry, etc.).

## What it won't do

- Cover your **private** code or internal docs (use Memory MCP or a custom internal MCP for that)
- Replace reading the actual codebase (it grounds in *docs*, not your usage)
- Cover obscure libraries with no real documentation

## Gotchas

- **Rate limits without a key** — the keyless endpoint works but is rate-limited more aggressively. A free API key raises the limits.
- **Token budget** — Context7 returns chunks of docs; very chatty queries can push past your context window. Be specific in what you ask for.
- **Version drift** — pin the version explicitly when your repo's `package.json` is behind latest.

## Resources

- [Context7 website](https://context7.com)
- [GitHub: upstash/context7](https://github.com/upstash/context7)
- [List of supported libraries](https://context7.com/libraries) *(check website for current list)*
