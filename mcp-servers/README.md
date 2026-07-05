# MCP Server Walkthroughs

> Practical setup guides for MCP servers that pair well with OpenCode. New to MCP itself? Read [`docs/mcp.md`](../docs/mcp.md) first.

## Featured servers

| Server | Adds | Type | Walkthrough |
|---|---|---|---|
| **Playwright** | Browser automation — DOM, network, screenshots, accessibility | local | [playwright.md](playwright.md) |
| **Context7** | Live, version-pinned library docs piped into the prompt | remote | [context7.md](context7.md) |
| **Sentry** | Errors, traces, releases | remote (OAuth) | [sentry.md](sentry.md) |
| **Grep by Vercel** | Code search across public GitHub | remote | [grep.md](grep.md) |

## When to add an MCP server

- Your AI needs **external state** (browser, DB, ticketing, error tracker)
- You repeatedly run the same external CLI/API from within OpenCode prompts
- You want OpenCode to **act on** a system, not just describe it

If everything you need is already in local files, you probably don't need MCP yet.

> 💡 Each walkthrough below shows the `opencode.json` entry to hand-edit. To register a server interactively instead, run `opencode mcp add` and answer the prompts.

## Cost of adding a server

Every server's tool descriptions land in the model's context on every turn — a heavy server can cost thousands of tokens before you call anything. See the [token budget warning in `docs/mcp.md`](../docs/mcp.md#token-budget-warning) for the details and the `tools`-map pattern for disabling tools you don't need.

## Discovery

The [official MCP Registry](https://registry.modelcontextprotocol.io/) lists vetted servers. Search the registry or check the docs for each individual server.

For new servers, also worth checking:

- [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — reference implementations
- The provider's own docs (Sentry, Atlassian, etc. publish their own MCP guides)

## General troubleshooting

| Problem | Try |
|---|---|
| Server won't connect | `opencode mcp debug <name>` |
| OAuth flow stuck | `opencode mcp logout <name>` then `opencode mcp auth <name>` |
| Tools missing in the model surface | Check the `tools` map and the agent's `tools` override |
| Local server fails on Windows | Make sure the `command` array uses npx with `-y`, and that Node 20+ (current LTS) is on PATH |
| Timeouts | Bump `timeout` (default 5000ms) under the server's config |

> 📚 Full MCP guide in OpenCode: [opencode.ai/docs/mcp-servers](https://opencode.ai/docs/mcp-servers).
