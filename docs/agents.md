# Agents — Custom Agents & Subagents

> Custom agents let you bake a role, model choice, and permission profile into a markdown file. They show up in the Tab cycle (primary) or as `@mentions` (subagent).

## The agent zoo

Five OpenCode-built-in agents you should know:

| Name | Mode | Tools | Reach for it when… |
|---|---|---|---|
| `build` | primary (default) | All | Default daily-driver — implementation, refactors |
| `plan` | primary | `edit` & `bash` set to `"ask"` | Read-only-ish analysis — exploration, design |
| `general` | subagent | All minus `todowrite` | Big sub-tasks you want isolated from main context |
| `explore` | subagent | `read`, `grep`, `glob`, `list` | "Where is X?" code search |
| `scout` | subagent | `webfetch`, `websearch`, + read tools | External docs and dependency research |

Hit **Tab** to cycle primaries. Use `@<name>` in your prompt to invoke a subagent.

## Custom agents — file format

Two locations, same format:

| Scope | Path |
|---|---|
| Project | `.opencode/agents/<name>.md` |
| Global | `~/.config/opencode/agents/<name>.md` |

```markdown
---
description: Senior frontend engineer — Tailwind + React + TypeScript expert
mode: all
model: anthropic/claude-sonnet-4-5
temperature: 0.2
permission:
  edit: allow
  bash:
    "*": "ask"
    "pnpm test*": "allow"
    "pnpm lint*": "allow"
    "git status*": "allow"
  webfetch: deny
tools:
  websearch: false
---

You are a senior frontend engineer. Specifics:
- Use Tailwind for styling. Reach for CSS modules only when Tailwind can't express it.
- Components are TypeScript with named exports and explicit Props types.
- Tests use Vitest + @testing-library/react.
- Match existing patterns in `src/components/Button/` for new components.
```

### Frontmatter keys

Verified against the [config JSON schema's `AgentConfig`](https://opencode.ai/config.json):

| Key | Type | Purpose |
|---|---|---|
| `description` | string | Shown in `/agents` and surfaced to the LLM |
| `mode` | `primary` \| `subagent` \| `all` | How the agent can be invoked |
| `model` | `provider/model-id` | Per-agent model override |
| `temperature` · `top_p` | number | Sampling controls |
| `permission` | object | Per-tool `allow`/`ask`/`deny` (see below) |
| `tools` | object | Boolean per tool — `{"websearch": false}` |
| `prompt` *(JSON form only)* | string | System prompt; alternative to markdown body |
| `maxSteps` | number | Hard cap on agent steps in one invocation |
| `steps` | array | Scripted step sequence (advanced) |
| `disable` | boolean | Disable an agent entirely |
| `hidden` | boolean | Hide from the UI but keep available |
| `color` | string | UI accent color |
| `variant` · `options` | string · object | Model variant + per-provider options |

Only `description` and `mode` are required.

### Filename → agent name

The filename (minus `.md`) becomes the agent name. `security-auditor.md` → `@security-auditor`.

Naming rules: lowercase, alphanumeric, hyphens. No spaces, no underscores.

## Mode reference

| `mode` | Where it appears | Use when |
|---|---|---|
| `primary` | Tab cycle alongside `build`/`plan` | A persistent role you'll inhabit for hours |
| `subagent` | `@<name>` mentions, `task` tool | A focused helper for a specific sub-task |
| `all` | Both | You want flexibility (most custom agents) |

## Permission model

Permission keys (verified against `PermissionConfig` in the [config JSON schema](https://opencode.ai/config.json)):

| Key | Tools / behavior gated |
|---|---|
| `read` | `read` tool |
| `edit` | `write`, `edit`, `apply_patch` |
| `bash` | shell — supports glob-pattern overrides |
| `glob` · `grep` · `list` | search and listing |
| `task` | spawning subagents |
| `todowrite` | the in-session todo list |
| `question` | the `question` tool |
| `external_directory` | files outside the project root |
| `repo_clone` · `repo_overview` | repo-level operations |
| `webfetch` · `websearch` | network access |
| `lsp` | language server tools |
| `skill` | agent skill loading |
| `doom_loop` | runaway-loop safeguards |

Three values everywhere: `"allow"` (no prompt) · `"ask"` (prompt user) · `"deny"` (block).

### Glob-pattern bash

The `bash` key can be a single value or a glob-map. **Order matters**: most specific patterns first.

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

Use this to keep an agent productive (no constant prompting for safe reads) while still gating destructive commands.

## Choosing a model per agent

```json
{
  "agent": {
    "explore":      { "model": "opencode/qwen3.6-plus" },
    "scout":        { "model": "opencode/qwen3.6-plus" },
    "plan":         { "model": "opencode/claude-opus-4-7" },
    "build":        { "model": "opencode/claude-sonnet-4-6" },
    "deep-thinker": { "model": "openai/gpt-5", "reasoningEffort": "high" }
  }
}
```

If unspecified:

- Primary agents inherit the global `model`.
- Subagents inherit the model from whatever agent invoked them.

## Tools per agent

The `tools` map enables/disables individual tools by name, including MCP tools (use glob patterns):

```json
{
  "agent": {
    "doc-writer": {
      "tools": {
        "bash": false,
        "edit": true,
        "websearch": false,
        "github_*": false
      }
    }
  }
}
```

Note: `tools` is independent from `permission`. A tool can be enabled but still require `"ask"` per the permission map.

## Patterns

### Read-only reviewer

A subagent that reviews diffs but never writes. See [`specialized-agents/system-prompts/code-reviewer-prompt.md`](../specialized-agents/system-prompts/code-reviewer-prompt.md) for the full prompt.

```markdown
---
description: Reviews code without modifying files
mode: subagent
permission:
  edit: deny
  bash:
    "*": "ask"
    "git diff*": "allow"
---
```

### Specialist primary

A daily-driver agent with a baked-in role. Different model, different prompt, different defaults.

```markdown
---
description: Backend engineer — TypeScript, Postgres, REST
mode: primary
model: anthropic/claude-sonnet-4-5
permission:
  bash:
    "*": "ask"
    "pnpm test*": "allow"
    "pnpm typecheck*": "allow"
    "psql*": "deny"
---

You're a backend engineer working on this monorepo's API…
```

### Cheap research subagent

Read-only, cheap model — `@scout`-replacement scoped to a specific knowledge area.

```markdown
---
description: Looks up React Router v7 patterns and idioms
mode: subagent
model: opencode/qwen3.6-plus
permission:
  edit: deny
  bash: deny
---
```

## Drop-in specialists

This repo ships 10 production-ready prompts in [`specialized-agents/`](../specialized-agents/). Copy any of them to `.opencode/agents/<name>.md` to use as a starting point.

> 📚 Full agent reference: [opencode.ai/docs/agents](https://opencode.ai/docs/agents).
