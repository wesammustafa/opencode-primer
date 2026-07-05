# Permissions Reference

> OpenCode's permission system in one page. Verified against the [config JSON schema](https://opencode.ai/config.json) (`PermissionConfig`).

## The three values

Every permission accepts one of:

| Value | Behavior |
|---|---|
| `"allow"` | Tool runs without prompting |
| `"ask"` | User is prompted to approve each use |
| `"deny"` | Tool is blocked outright |

For `bash` (and any rule-style permission), you can also pass a **glob-pattern map** keyed by command pattern. Rules are matched in order and the **last matching rule wins**, so list the catch-all `*` first and put more specific overrides after it.

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
| `webfetch` · `websearch` | network access |
| `lsp` | language-server tools |
| `skill` | loading agent skills |
| `doom_loop` | runaway-loop safeguards |

That's the full set — **15 keys** (`read`, `edit`, `glob`, `grep`, `list`, `bash`, `task`, `external_directory`, `todowrite`, `question`, `webfetch`, `websearch`, `lsp`, `doom_loop`, `skill`), per the config schema.

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
      "*": "ask",
      "git status*": "allow",
      "git diff*": "allow",
      "pnpm test*": "allow",
      "git push --force*": "deny",
      "rm -rf*": "deny"
    }
  }
}
```

**Matching rules:**

- Rules are matched in order and the **last matching rule wins**. Put the catch-all `*` **first**, then list more specific overrides after it — a trailing `*` would override everything above it.
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
- `external_directory` and `doom_loop` default to `"ask"` — touching files outside the project root, or repeating the same tool call 3+ times, prompts for approval.
- `*.env` files are **denied by default** (`*.env.example` is allowed).

## When to lock things down

| Scenario | Recommendation |
|---|---|
| Shared repo, multiple contributors | Commit a restrictive `opencode.json` so everyone's agent has the same guardrails |
| CI / headless | Use `--auto` (auto-approves everything not explicitly denied) only after auditing what the prompt can reach |
| Working with secrets | `external_directory: "deny"` plus a plugin that blocks edits to `.env`/`secrets/` |
| First time on a repo | Set `bash: "ask"` everywhere until you trust the workflows |

> 🆕 v1.17.12 added TUI **yolo mode** — the interactive counterpart of `--auto`, auto-approving permission prompts from within the TUI. Same caveats apply.

> 📚 Live reference: [opencode.ai/docs/permissions](https://opencode.ai/docs/permissions) and [opencode.ai/docs/agents](https://opencode.ai/docs/agents).

---

*Last reviewed: 2026-07-05.*
