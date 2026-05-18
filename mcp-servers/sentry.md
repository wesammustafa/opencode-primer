# Sentry MCP

> Pull errors, traces, and releases from your Sentry org into OpenCode. Useful when investigating a production issue or correlating a deploy with new errors.

## When to reach for it

- Investigating a production error someone pasted a link to
- Auditing recent errors after a deploy
- Correlating a release with a regression
- Tracking down the request trace for a slow endpoint

## Setup

Sentry MCP uses OAuth. OpenCode handles Dynamic Client Registration automatically.

Add to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

Restart OpenCode, then complete OAuth:

```bash
opencode mcp auth sentry
```

A browser will open. Sign in to Sentry and authorize OpenCode. The credentials are stored locally.

Verify:

```bash
opencode mcp list                # should show "sentry" as authenticated
```

## Example prompts

```text
use sentry to fetch the latest 10 errors in the production environment
```

```text
use sentry — pull the error at https://my-org.sentry.io/issues/12345/
and explain what's happening
```

```text
the user got a 500 — request ID is `req_abc123`. find the corresponding
trace in sentry and walk me through what happened
```

```text
we deployed `v2.45.0` 30 minutes ago. use sentry to compare error rates
in the last 30 minutes versus the previous hour — any new error types?
```

## What it can do

- List issues / errors with filtering (project, environment, time range, severity)
- Fetch full error context — stack trace, breadcrumbs, request data, user context
- List recent releases and their error counts
- Fetch traces and spans
- Search issues by message or stack frame

## Common pattern: error → root cause

```text
use sentry to fetch the most recent occurrence of issue PROJ-12345
- Look at the stack trace and identify the failing code
- Open the relevant file (use @ syntax)
- Explain the root cause and propose a fix
```

## What it won't do

- Resolve issues automatically (you wouldn't want it to)
- Create new releases or deploys
- Access projects you're not a member of

## Gotchas

- **OAuth scope** — the OAuth flow grants the same permissions your Sentry user has. Audit before authorizing on shared/admin accounts.
- **Re-auth periodically** — tokens expire. If queries start failing, run `opencode mcp auth sentry` again.
- **Rate limits** — Sentry's API has rate limits. Heavy querying gets throttled.

## Resources

- [Sentry MCP — endpoint and docs](https://mcp.sentry.dev/)
- [Sentry main docs](https://docs.sentry.io/)
