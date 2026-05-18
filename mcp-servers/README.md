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

## Cost of adding a server

MCP tools land in the model's tool surface every turn. A heavy server (say, a full GitHub integration with 40 tools) can eat 10K+ tokens of context **just to describe the available tools**. Don't add a server you won't use, and disable tools you don't need with the `tools` map:

```json
{
  "tools": {
    "github_*": false,
    "slack_*": false
  },
  "agent": {
    "issue-triager": {
      "tools": {
        "github_get_issue": true,
        "github_list_issues": true
      }
    }
  }
}
```

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
| Local server fails on Windows | Make sure the `command` array uses npx with `-y`, and that Node 18+ is on PATH |
| Timeouts | Bump `timeout` (default 5000ms) under the server's config |

> 📚 Full MCP guide in OpenCode: [opencode.ai/docs/mcp-servers](https://opencode.ai/docs/mcp-servers).
