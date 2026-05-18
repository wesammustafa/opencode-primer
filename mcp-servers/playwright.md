# Playwright MCP

> Drive a real browser from OpenCode — open pages, click elements, fill forms, take screenshots, capture network requests, inspect accessibility trees.

## When to reach for it

- Visual iteration: implement a UI, take a screenshot, refine
- E2E test scaffolding
- Reading documentation from sites that aren't well-indexed
- Reproducing a bug a user reported with a URL

## Setup

Add to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "playwright": {
      "type": "local",
      "command": ["npx", "-y", "@playwright/mcp@latest"],
      "enabled": true,
      "environment": {
        "BROWSER_TYPE": "chromium"
      }
    }
  }
}
```

Restart OpenCode. Verify:

```bash
opencode mcp list
```

You should see `playwright` in the list.

## Example prompts

```text
use playwright to open https://example.com and screenshot the navbar
```

```text
use playwright to visit our staging site at https://staging.example.com,
log in with the credentials in @.dev/staging-creds.json, and
verify the dashboard renders without console errors
```

```text
the user reports a bug at https://app.example.com/billing — use playwright to
reproduce: log in, navigate to billing, click "upgrade plan", and report what
happens
```

## Visual-iteration loop

```text
[plan]  > here's a mock: [drag mock.png in]
        > sketch the HTML/CSS structure that matches
[build] > <Tab>
[build] > implement it under src/components/Dashboard/
[build] > use playwright to render the new component at http://localhost:5173/dashboard
        > and screenshot it; compare to the mock
[build] > refine until the screenshot matches
```

Two-three iteration rounds usually closes the gap.

## What it can do

- Open URLs, navigate, fill forms, click, hover, drag
- Take screenshots (full page, viewport, or element-scoped)
- Read DOM (CSS selectors, XPath, ARIA roles)
- Capture network requests/responses
- Inspect console messages
- Run JavaScript in the page context
- Read the accessibility tree

## What it won't do

- Persist browser state across sessions by default (use `--user-data-dir` if you need this)
- Bypass strong bot detection (Cloudflare, etc.)
- Replace a real E2E test suite (use the screenshots and traces to *write* the tests)

## Gotchas

- **First run is slow** — Playwright downloads a browser the first time you invoke it.
- **Headless by default** — you don't see the browser. Pass `BROWSER_HEADED=1` in `environment` to watch it run (useful for debugging).
- **Cross-origin / authenticated flows** — use Playwright's auth-state file pattern; see the upstream docs.

## Resources

- [Source: @playwright/mcp on npm](https://www.npmjs.com/package/@playwright/mcp)
- [Playwright docs](https://playwright.dev/)
- [Visual regression patterns](https://playwright.dev/docs/test-snapshots)
