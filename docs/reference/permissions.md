# Permissions Reference

> OpenCode's permission system in one page. Verified against the [config JSON schema](https://opencode.ai/config.json) (`PermissionConfig`).

## The three values

Every permission accepts one of:

| Value | Behavior |
|---|---|
| `"allow"` | Tool runs without prompting |
| `"ask"` | User is prompted to approve each use |
| `"deny"` | Tool is blocked outright |

For `bash` (and any rule-style permission), you can also pass a **glob-pattern map** keyed by command pattern — most-specific wins, `*` is the catch-all.

## Permission keys → what they gate

| Key | Gates |
|---|---|
| `read` | `read` |
| `edit` | `write`, `edit`, `apply_patch` |
| `bash` | shell — supports glob-pattern overrides |
| `glob` · `grep` · `list` | search and listing tools |
| `task` | spawning subagents |
| `todowrite` | in-session todo list |
| `question` | the `question` tool |
| `external_directory` | files outside the project root |
| `repo_clone` | cloning dependency repos into OpenCode's cache (used by `scout`) |
| `repo_overview` | repo-summary operations |
| `webfetch` · `websearch` | network access |
| `lsp` | language-server tools |
| `skill` | loading agent skills |
| `doom_loop` | runaway-loop safeguards |

> Note: `write` and `apply_patch` are both gated under the `edit` key, not separately.

## Built-in tool list

| Tool | Purpose | Gated by |
|---|---|---|
| `bash` | Run shell commands | `bash` |
| `read` | Read file contents | `read` |
| `write` | Create / overwrite a file | `edit` |
| `edit` | String-replace edits | `edit` |
| `apply_patch` | Apply a unified diff | `edit` |
| `grep` | Regex search in files | `grep` |
| `glob` | File pattern matching | `glob` |
| `lsp` | LSP queries *(experimental — needs `OPENCODE_EXPERIMENTAL_LSP_TOOL=true`)* | `lsp` |
| `skill` | Load a skill file's content | `skill` |
| `todowrite` | Manage in-session todo list | `todowrite` |
| `webfetch` | Fetch a web URL | `webfetch` |
| `websearch` | Web search *(needs OpenCode provider or `OPENCODE_EXPERIMENTAL_EXA=1` to use Exa)* | `websearch` |
| `question` | Ask the user something mid-execution | `question` |

## Setting permissions

### Project-wide (`opencode.json`)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "ask",
    "bash": {
      "*": "ask",
      "git status*": "allow",
      "git diff*": "allow",
      "pnpm test*": "allow",
      "rm -rf*": "deny"
    },
    "webfetch": "allow",
    "websearch": "allow"
  }
}
```

You can also use a top-level string (`"permission": "ask"`) to set the same value for every permission at once.

### Per-agent (`opencode.json`)

Per-agent settings override project-level for that agent:

```json
{
  "agent": {
    "plan": {
      "permission": {
        "edit": "deny",
        "bash": "ask"
      }
    }
  }
}
```

### Per-agent (markdown frontmatter)

```markdown
---
description: Read-only reviewer
mode: subagent
permission:
  edit: deny
  bash:
    "*": "ask"
    "git diff*": "allow"
---
```

## Glob-pattern bash

The `bash` key accepts a glob-pattern map. Patterns are matched against the full command line.

```json
{
  "permission": {
    "bash": {
      "rm -rf*": "deny",
      "git push --force*": "deny",
      "git status*": "allow",
      "git diff*": "allow",
      "pnpm test*": "allow",
      "*": "ask"
    }
  }
}
```

**Matching rules:**

- Patterns are evaluated by specificity — most specific match wins; `*` is the catch-all.
- `*` matches zero or more characters (including spaces).
- `?` matches exactly one character.
- Literal text matches exactly.

## Tool-level on/off (`tools`)

`tools` is independent from `permission`. It enables/disables a tool entirely.

```json
{
  "tools": { "websearch": false },
  "agent": {
    "research-agent": {
      "tools": { "websearch": true }
    }
  }
}
```

Glob patterns work too — useful for MCP tools:

```json
{
  "tools": {
    "github_*": false,
    "slack_*": false
  }
}
```

## Defaults

- All tools are **enabled by default**.
- Most permissions default to `"allow"` for the `build` agent.
- The built-in `plan` agent sets `edit` and `bash` to `"ask"` so analysis sessions can't surprise-write files.
- `external_directory` is **opt-in** — files outside the project root require explicit `"allow"`.

## When to lock things down

| Scenario | Recommendation |
|---|---|
| Shared repo, multiple contributors | Commit a restrictive `opencode.json` so everyone's agent has the same guardrails |
| CI / headless | Use `--dangerously-skip-permissions` only after auditing what the prompt can reach |
| Working with secrets | `external_directory: "deny"` plus a plugin that blocks edits to `.env`/`secrets/` |
| First time on a repo | Set `bash: "ask"` everywhere until you trust the workflows |

> 📚 Live reference: [opencode.ai/docs/permissions](https://opencode.ai/docs/permissions) and [opencode.ai/docs/agents](https://opencode.ai/docs/agents).
