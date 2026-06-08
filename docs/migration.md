# Migration Guide

> Switching from another AI coding tool to OpenCode. Concrete mappings, no marketing.

> Before reading this, a fair note: **none of the tools below is universally better.** This guide is about migrating *to* OpenCode, which makes sense if its trade-offs (open source, multi-provider, terminal-first, configurable) line up with what you want. If you're happy on Claude Code, Cursor, Copilot, or Aider, those are good tools — keep using them.

## From Claude Code

OpenCode has **shape compatibility** with Claude Code — similar concepts, similar file layouts, fallback support for `CLAUDE.md` and `.claude/skills/` — but it isn't a literal drop-in. Frontmatter keys differ on agents, hooks become JS/TS plugins, and the CLI surface is its own. Plan to spend ~30 minutes adapting a non-trivial Claude Code project.

### What Claude Code does better

- **Tighter Anthropic integration.** First-party support for Claude-specific features (extended thinking, prompt caching tuning, etc.) lands in Claude Code first and is more battle-tested there.
- **Single-vendor polish.** One company owns the model, the CLI, and the docs — fewer rough edges where layers meet.
- **Subscription pricing** can be more predictable than pay-as-you-go if you're a heavy user.

If those matter more to you than multi-provider flexibility or full open source, staying on Claude Code is reasonable.

### What's the same

- Terminal-first interaction model
- `@<path>` for file references
- `!<cmd>` for shell injection
- Slash commands (`/init`, `/help`, `/share`, `/export`, etc.)
- Custom commands as markdown files
- Agent Skills (`SKILL.md` folders)
- MCP server support (same protocol)

### What's different

| Claude Code | OpenCode |
|---|---|
| Anthropic models only | Any provider (Anthropic, OpenAI, Google, Groq, Bedrock, local…) via Zen or direct config |
| Subscription pricing (Pro/Max) | Pay-as-you-go via Zen, or your own provider's billing |
| `CLAUDE.md` for project rules | `AGENTS.md` (falls back to `CLAUDE.md` for compatibility) |
| `.claude/commands/<name>.md` | `.opencode/commands/<name>.md` |
| `.claude/skills/<name>/SKILL.md` | `.opencode/skills/<name>/SKILL.md` *(but also reads from `.claude/skills/`)* |
| `.claude/settings.json` hooks (Python scripts on lifecycle events) | `.opencode/plugins/<name>.{js,ts}` (JS/TS modules on events) |
| `.claude/agents/<name>.md` | `.opencode/agents/<name>.md` (similar markdown+YAML format, different fields) |
| `claude` CLI | `opencode` CLI |
| `/auth login` | `opencode auth login` or `/connect` |

### Migration steps

```bash
# 1. Install
curl -fsSL https://opencode.ai/install | bash

# 2. Authenticate
opencode auth login         # pick a provider (Anthropic, Zen, OpenAI, etc.)

# 3. Move project config
git mv .claude/commands     .opencode/commands         # if you had commands
git mv .claude/skills       .opencode/skills           # if you had skills
git mv .claude/agents       .opencode/agents           # but see agent format note below
mv CLAUDE.md AGENTS.md       # rename — OpenCode prefers AGENTS.md

# 4. Disable the Claude fallback once migrated
export OPENCODE_DISABLE_CLAUDE_CODE=1
# Or, if you only want to disable one half of the fallback:
export OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1     # ignore CLAUDE.md
export OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1     # ignore .claude/skills/
```

### Agent format differences

Claude Code subagents and OpenCode agents are conceptually the same but use different frontmatter keys. Claude Code uses:

```yaml
---
name: code-reviewer
description: ...
tools: Read, Grep, Glob, Bash
model: sonnet
---
```

OpenCode uses:

```yaml
---
description: ...
mode: subagent
model: anthropic/claude-sonnet-4-5
permission:
  edit: deny
  bash: ask
---
```

Key changes:

- No `name` field — filename is the name.
- `tools` becomes either the `tools` map (`{"bash": true}`) or the `permission` map (`{"bash": "allow"}`).
- `model` is `provider/model-id`, not a shorthand.
- Add `mode: subagent` (or `primary` / `all`).

### Hooks → Plugins

Claude Code uses Python scripts triggered by `.claude/settings.json`. OpenCode uses JS/TS modules in `.opencode/plugins/`. Behaviorally similar, syntactically different.

Claude Code `pre_tool_use.py`:

```python
import json, sys
event = json.load(sys.stdin)
if event["tool_name"] == "Write" and ".env" in event["tool_input"]["path"]:
    print("Blocked: cannot write .env", file=sys.stderr)
    sys.exit(2)
```

OpenCode equivalent (`.opencode/plugins/protect-env.js`):

```javascript
export const ProtectEnv = async () => {
  return {
    // `tool.execute.before` is a top-level hook: (input, output). `input.tool`
    // names the tool; `output.args` holds its arguments. Throw to block.
    "tool.execute.before": async (input, output) => {
      if (input.tool === "edit" || input.tool === "write") {
        if ((output?.args?.filePath ?? "").includes(".env")) {
          throw new Error("Plugin blocked: cannot write .env");
        }
      }
    },
  };
};
```

## From Cursor

Cursor and OpenCode have different surfaces (IDE-embedded vs. terminal-first) but similar AI capabilities.

### What's the same

- AI-assisted edits with project context
- File-mention syntax (`@`)
- Custom rules / project conventions

### What's different

| | Cursor | OpenCode |
|---|---|---|
| **Surface** | VS Code fork (full IDE) | TUI, desktop, or IDE extension — bring your own editor |
| **Rules** | `.cursor/rules/*.md` | `AGENTS.md` + `instructions: ["..."]` in `opencode.json` |
| **Workflow** | Cursor Composer / Cursor Tab inline | TUI + custom commands |
| **Pricing** | Subscription | Pay-as-you-go or BYOK |
| **Source** | Proprietary | MIT open source |

### What Cursor does better

- **Inline tab-completion** is Cursor's bread and butter and is genuinely excellent — OpenCode doesn't have an equivalent.
- **Native IDE integration** — diff views, refactor previews, multi-file edits live in your editor, no terminal context-switch.
- **Onboarding** is faster — install the app, sign in, you're productive.

If you write code primarily in a GUI editor and want the AI right there, Cursor is hard to beat.

### Importing Cursor rules

You can keep your `.cursor/rules/` and reference them from OpenCode:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [".cursor/rules/*.md", "AGENTS.md"]
}
```

OpenCode glob-expands the patterns and concatenates the content into the system prompt.

## From GitHub Copilot

Copilot is autocompletion-first; OpenCode is conversation-first. They serve different (overlapping) jobs.

### Mental model shift

| Copilot | OpenCode |
|---|---|
| Inline ghost-text completion in your editor | Full conversation in the terminal |
| Single-file scope by default | Whole-repo grounding by default |
| Code generation | Code generation + reading + editing + running tests + git ops |
| Subscription, IDE-locked | Provider-agnostic, terminal/desktop/IDE |

OpenCode replaces Copilot's *kind* of help only partially. For inline completion you'd still want Copilot, Cursor Tab, Codeium, or Supermaven. OpenCode is better suited to multi-file edits, refactors, and "do the thing" prompts where the agent runs the loop — but Copilot covers a high-frequency use case (every keystroke) that OpenCode doesn't try to.

Most teams that adopt agent tools run them **alongside** an autocomplete tool, not instead.

### Migration

There's no config to migrate. Install OpenCode alongside Copilot — they don't conflict.

```bash
curl -fsSL https://opencode.ai/install | bash
opencode auth login
cd ~/your-project && opencode
```

## From Aider

[Aider](https://aider.chat/) was an early terminal-AI tool and is still actively maintained. The two tools target the same space with different priorities.

### What Aider does better

- **Smaller surface area.** Aider is a focused Python tool you can read end-to-end. OpenCode has substantially more moving parts.
- **Strong git integration.** Aider's automatic commit-per-change and git-aware editing workflow is mature.
- **Lower setup overhead** for users who just want "edit my files with an LLM."

OpenCode adds skills, plugins, MCP, subagents, themes, a desktop app, and a headless server. Whether that's an upgrade or scope creep depends on what you actually need.

### Mapping

| Aider | OpenCode |
|---|---|
| `.aider.conf.yml` | `opencode.json` |
| `.aider.chat.history.md` | OpenCode session persistence (`/sessions`) |
| Aider's `/run` | OpenCode's `!cmd` prefix or `bash` tool |
| Aider's `--edit-format` modes | OpenCode's `edit` / `write` / `apply_patch` tools |
| Aider's `--read` files | OpenCode's `@<path>` references |

Migration is mostly muscle-memory adjustment, not config porting.

## After migration

1. Run `/init` to refresh your `AGENTS.md` — OpenCode reads it slightly differently and `/init` will populate the canonical sections (commands, conventions, repo layout).
2. Browse this repo's [`.opencode/`](../.opencode/) for example agent, command, and skill formats.
3. Audit your old hooks/scripts for things that should become **plugins** versus things that should become **agent permission rules** (a lot of "block X" hooks are simpler as `bash: { "X*": "deny" }`).
4. Set `OPENCODE_DISABLE_CLAUDE_CODE=1` to stop the `CLAUDE.md` fallback once you've fully renamed to `AGENTS.md`.

---

*Last reviewed: 2026-06-08 · Canonical source: [opencode.ai/docs](https://opencode.ai/docs/).*
