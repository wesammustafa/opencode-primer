# OpenCode: Everything You Need to Know

A practical guide to [OpenCode](https://opencode.ai) — from your first prompt to custom agents, skills, plugins, and MCP integrations. Built around clear mental models and real examples, not marketing.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![OpenCode v1.15.4](https://img.shields.io/badge/OpenCode-v1.15.4-7C3AED?style=flat-square)](https://github.com/anomalyco/opencode/releases)
[![Last reviewed](https://img.shields.io/badge/last%20reviewed-May%202026-22c55e?style=flat-square)](#updates--deprecations)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4?style=flat-square)](CONTRIBUTING.md)

```bash
curl -fsSL https://opencode.ai/install | bash
```

**Who this is for:** Developers using (or about to use) [OpenCode](https://opencode.ai). Beginners get a guided path; power users get depth on Custom Commands, Skills, Plugins, MCP, and Agents.

> ⚖️ **Not affiliated with the OpenCode team.** This is a community-maintained guide. For canonical sources, check [opencode.ai/docs](https://opencode.ai/docs/) and [github.com/anomalyco/opencode](https://github.com/anomalyco/opencode).

---

## 🧭 Choose your path

| You are… | Start with | Time |
|---|---|---|
| 🚀 **New to OpenCode** | [What is it](#what-is-opencode) → [Setup](#setup) → [Prompt Engineering](#prompt-engineering) | ~15 min |
| ⚡ **Already using it** | [Custom Commands](#custom-commands) · [Skills](#agent-skills) · [Plugins](#plugins) · [MCP](#mcp-servers) | ~20 min each |
| 🧠 **Configuring or headless** | [Agents](#agents) · [Headless & CI](#headless--ci) · [Models & Providers](#models--providers) | varies |

<!-- Compatibility anchors for old internal links (auto-generated heading anchors
     handle: setup, opencode-zen, themes, agents, plugins, custom-commands,
     agent-skills, mcp-servers, prompt-engineering, tui--themes, headless--ci) -->
<a id="opencode-setup"></a>
<a id="configuring-providers"></a>
<a id="prompt-engineering-deep-dive"></a>
<a id="tui-mastery"></a>
<a id="subagents"></a>
<a id="custom-agents"></a>
<a id="model-context-protocol-mcp"></a>
<a id="when-to-use-what"></a>
<a id="whats-inside"></a>

---

## Getting started

### What is OpenCode?

OpenCode is an open-source AI coding agent — a terminal app (TUI), desktop app, and IDE extension that reads your repo, runs commands, edits files, and talks to any LLM you point it at. Maintained by [Anomaly](https://github.com/anomalyco), MIT-licensed.

**Three things it does that a chat UI can't:**

- **Reads your actual repo** — not pasted snippets. Greps your files, follows imports, grounds answers in real context using built-in `read`/`grep`/`glob` tools.
- **Edits in place and runs your stack** — diff-aware `edit`/`write`/`apply_patch`, then `bash` to run your tests, linter, or build on the spot.
- **Composes with the rest of your toolchain** — multi-provider models, custom slash commands, agent skills, JS/TS plugins, MCP servers, LSP, formatters, and an HTTP server for CI use.

**Three interfaces:**

| Surface | Command | When |
|---|---|---|
| **TUI** (default) | `opencode` | Interactive day-to-day work in your terminal |
| **CLI / headless** | `opencode run "<prompt>"` | Scripts, CI jobs, one-shot prompts |
| **Server** | `opencode serve` or `opencode web` | Headless API, web UI, or remote attach |

```bash
opencode                                       # start TUI in the current repo
opencode run "fix the failing test in src/api.test.ts"
opencode serve --port 4096                     # headless server
```

> OpenCode sits in the same space as Claude Code, Cursor, and Aider — same problem, different trade-offs. None is universally better; pick the one whose model, surface, and ecosystem fit your workflow.

> ⚠️ **AI-coding caveat:** OpenCode (like every coding agent) can produce wrong code, miss edge cases, hallucinate APIs, and over-apply patterns. **You're still the reviewer.** Read diffs before accepting, run tests, and don't auto-approve destructive operations on code you care about.

---

### When OpenCode isn't the right tool

| Limitation | Detail |
|---|---|
| **No inline editor completion** | OpenCode is a conversational agent, not Copilot-style autocomplete. For ghost-text-while-you-type, reach for [Copilot](https://github.com/features/copilot), [Cursor Tab](https://cursor.sh/), [Codeium](https://codeium.com/), or [Supermaven](https://supermaven.com/) — or alongside. |
| **Quality depends on the underlying model** | OpenCode doesn't replace the LLM's reasoning. If your task fails on Sonnet, switching to OpenCode won't fix it. |
| **Provider-agnostic ≠ provider-equivalent** | Some models tool-call better than others. A slug swap isn't free. |
| **TUI on slow SSH / minimal terminals** | The TUI uses truecolor and complex layouts. Degrades over slow connections. `opencode serve` + `attach` or `opencode run` are better for those cases. |
| **Plugins run arbitrary code** | Any plugin — local or npm — has full user permissions. Audit before installing. |
| **Free Zen models are time-limited** | The [Zen docs](https://opencode.ai/docs/zen) call them "available for a limited time." Don't build production on them. |
| **Docs lag shipping** | OpenCode moves fast. This guide and even the official docs occasionally trail the actual binary. |
| **Not a substitute for code review** | Diff-aware edits + passing tests don't guarantee correct, secure, or maintainable code. Treat AI output as a junior teammate's PR. |

**When something else fits better:**

- Want a polished single-vendor product → **Claude Code** or **Cursor**.
- Deeply embedded in VS Code workflow → **Cursor** or **GitHub Copilot**.
- Want a small Python tool you can read end-to-end → **[Aider](https://aider.chat/)**.
- Don't want to manage provider keys → a managed hosted product.

> OpenCode's trade-off: flexibility and openness over polish and single-vendor integration. Worth it for many use cases; not all.

---

### Setup

> ⏱️ **5 minutes** from zero to first AI-assisted commit.

#### 1. Install

```bash
curl -fsSL https://opencode.ai/install | bash
```

Other supported installers (pick whichever you already use):

```bash
npm i -g opencode-ai@latest         # npm / pnpm / yarn / bun all work
brew install anomalyco/tap/opencode # macOS / Linux
scoop install opencode              # Windows
choco install opencode              # Windows
sudo pacman -S opencode             # Arch
paru -S opencode-bin                # Arch (AUR)
mise use -g opencode                # mise users
nix run nixpkgs#opencode            # Nix
```

A desktop app for macOS / Windows / Linux is in beta at [opencode.ai/download](https://opencode.ai/download).

#### 2. Authenticate

```bash
opencode auth login                  # interactive provider picker
opencode auth list                   # see who you're signed in to
```

Or from inside the TUI: `/connect`. Provider options covered in the next section.

#### 3. First prompt

```bash
cd ~/your-project
opencode
```

Try one of these:

- `explain what this codebase does`
- `add a README section about installation`
- `find and fix the failing test in src/api.test.ts`

#### 4. Generate an `AGENTS.md`

```
/init
```

`/init` generates an `AGENTS.md` — your project's "house rules" that OpenCode reads every session. Commit it. More in [Prompt Engineering](#prompt-engineering).

> 📝 **Coming from Claude Code?** OpenCode reads `CLAUDE.md` as a fallback if no `AGENTS.md` exists. Disable with `OPENCODE_DISABLE_CLAUDE_CODE=1` once migrated.

#### 5. (Bonus) See a real configured project

This repo's own [`.opencode/`](.opencode/) directory is a working example:

| Path | What it does |
|---|---|
| [`.opencode/agents/`](.opencode/agents) | Custom agent definitions (markdown + YAML) |
| [`.opencode/commands/`](.opencode/commands) | Custom slash commands |
| [`.opencode/plugins/`](.opencode/plugins) | Working JS plugins (audit log, secret blocker) |
| [`.opencode/skills/`](.opencode/skills) | Agent skills with `SKILL.md` files |
| [`AGENTS.md`](AGENTS.md) | Project instructions OpenCode reads every session |
| [`opencode.json`](opencode.json) | Project config with safe defaults |

---

### Models & Providers

OpenCode is **provider-agnostic**. Three ways to plug in a model — pick whichever fits your accounts, budget, and privacy posture:

| | Best for | Trade-off |
|---|---|---|
| **Direct providers** (Anthropic, OpenAI, Google, Groq, OpenRouter, AWS Bedrock, Azure) | You already have credits with a provider | Manage one key per provider |
| **[OpenCode Zen](#opencode-zen)** — pay-as-you-go gateway | One key, curated lineup, no commitment | Pricier per token than going direct in some cases |
| **Local models** (Ollama, LM Studio, llama.cpp) | Offline, strict data-residency, hobbyist | Quality varies hugely with model and hardware |

There's no universally right answer — pick what fits.

#### Direct provider config

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "provider": {
    "anthropic": { "options": { "apiKey": "{env:ANTHROPIC_API_KEY}" } },
    "openai":    { "options": { "apiKey": "{file:~/.secrets/openai-key}" } }
  }
}
```

Variable substitution: `{env:NAME}` (environment) or `{file:./path}` (file content, absolute or relative).

Per-agent model override:

```json
{
  "agent": {
    "plan":         { "model": "anthropic/claude-haiku-4-5" },
    "deep-thinker": { "model": "openai/gpt-5", "reasoningEffort": "high" }
  }
}
```

#### OpenCode Zen

A curated, pay-as-you-go AI gateway. The OpenCode team tests and tunes models for coding-agent workloads; you get one key and a benchmarked lineup. Reference Zen models with the `opencode/<model-id>` namespace.

```bash
# 1. Sign up at https://opencode.ai/auth, add billing, copy API key
# 2. In OpenCode:
/connect            # pick "OpenCode Zen", paste key
/models             # browse the lineup
```

**Pricing snapshot** *(verified 2026-05-18; check [opencode.ai/docs/zen](https://opencode.ai/docs/zen) for current)*

| Model ID | Input / Output (per MTok) | Reach for it when… |
|---|---|---|
| `opencode/claude-opus-4-7` | $5 / $25 | Complex reasoning, large refactors |
| `opencode/claude-sonnet-4-6` | $3 / $15 | Balanced everyday coding |
| `opencode/claude-haiku-4-5` | $1 / $5 | Fast, lightweight tasks |
| `opencode/gpt-5.5` *(≤272K)* | $5 / $30 | Long-context, OpenAI ecosystem |
| `opencode/gpt-5.4-mini` | $0.75 / $4.50 | Cost-efficient frontier |
| `opencode/gemini-3.1-pro` | $2 / $12 | Multimodal, Google ecosystem |
| `opencode/qwen3.6-plus` | $0.50 / $3 | Budget-friendly heavy lifting |

**Free tier** *(rotating, time-limited, for community feedback):* `deepseek-v4-flash-free`, `minimax-m2.5-free`, `nemotron-3-super-free`, `big-pickle` *(stealth)*.

> 40+ models total — full list, cached-read/write rates, GPT 5 Codex variants, GLM, Kimi, Claude Opus 4.5/4.6/4.1, etc.: [opencode.ai/docs/zen](https://opencode.ai/docs/zen) · Deeper guide: [`docs/zen.md`](docs/zen.md).

> 💡 **Pattern: cheap explorer / strong executor.** Use a cheap model (`qwen3.6-plus`, `gpt-5.4-mini`) for `explore` and `scout` subagents that read a lot, and a stronger one (`claude-sonnet-4-6` or `claude-opus-4-7`) for the main `build` agent that does the editing.

---

## Using OpenCode

### Prompt Engineering

> **📖 Project Initialization.** Run `/init` to auto-generate an `AGENTS.md`. Treat it like any frequently-used prompt — iterate on it. Don't just dump 500 lines and forget.

#### Plan → Build cycle

Two primary agents you toggle with **Tab**:

| Agent | What changes | Use it for |
|---|---|---|
| **`plan`** | `edit` and `bash` default to `ask` — analysis without surprise writes | Reading code, designing approaches, reviewing diffs |
| **`build`** | Full tool access (default) | Implementation, refactors, running tests |

Natural workflow:

```text
[plan]  > how would you implement OAuth for this app?
       (reads, plans, proposes — no writes)
[plan]  > <Tab>
[build] > do it
       (implements, edits, runs tests)
```

> 💡 Prompts like `think hard`, `think more`, or `ultrathink` nudge reasoning depth on supported models — the same pattern in the [Anthropic prompt engineering guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview).

#### File references and shell

| Syntax | Effect | Example |
|---|---|---|
| `@<path>` | Attach file content (fuzzy resolved) | `look at @src/api/auth.ts` |
| `!<cmd>` | Run shell, inject output | `!git diff` then ask about it |

```text
> review @packages/api/src/handlers/auth.ts for missing input validation
> !pnpm test --reporter=verbose
> based on those failures, fix the auth handler
```

#### `AGENTS.md` for project rules

```markdown
# AGENTS.md

## Commands
- build: `pnpm build`
- test:  `pnpm test`
- lint:  `pnpm lint && pnpm typecheck`

## Conventions
- TypeScript strict mode, no `any`
- Prefer named exports; default exports only for React components

## Don't
- Edit anything under `vendor/`
- Run migrations without confirmation
- Push to `main` directly
```

Reads on every session. Add extra files via `instructions: ["..."]` in `opencode.json`.

---

### TUI & Themes

#### Leader key

OpenCode's TUI uses a **leader key** (default `ctrl+x`) followed by a single letter. Keeps single-keystroke editing keys free for the input box.

| Binding | Action |
|---|---|
| `ctrl+x n` | New session |
| `ctrl+x l` | List sessions |
| `ctrl+x c` | Compact session |
| `ctrl+x e` | Open external editor |
| `ctrl+x m` | Browse models |
| `ctrl+x t` | Switch theme |
| `ctrl+x u` / `ctrl+x r` | Undo / Redo |
| `ctrl+x q` | Quit |
| `ctrl+p` | Command palette |
| `Tab` | Cycle primary agents |
| `Esc` | Cancel / dismiss |

Readline shortcuts also work inside the prompt box (`ctrl+a`, `ctrl+e`, `ctrl+k`, `ctrl+u`).

#### Themes

Built-in: `system` · `tokyonight` · `everforest` · `ayu` · `catppuccin` · `catppuccin-macchiato` · `gruvbox` · `kanagawa` · `nord` · `matrix` · `one-dark`. Set via `/themes` or `tui.json`.

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "tokyonight",
  "leader_timeout": 2000,
  "keybinds": { "command_list": "ctrl+p" }
}
```

Custom themes: `.opencode/themes/<name>.json` (project) or `~/.config/opencode/themes/<name>.json` (global). Truecolor terminals required.

> 📚 Deep dive: [`docs/tui.md`](docs/tui.md) · [opencode.ai/docs/keybinds](https://opencode.ai/docs/keybinds) · [opencode.ai/docs/themes](https://opencode.ai/docs/themes).

---

### Headless & CI

Three ways to run OpenCode unattended:

```bash
# 1. One-shot prompts
opencode run "summarize the last 5 commits"
opencode run --format json "list every TODO with file and line" > todos.json
opencode run --agent plan --model anthropic/claude-haiku-4-5 \
  "audit src/ for missing input validation"

# 2. Headless server / web UI
opencode serve --port 4096 --hostname 0.0.0.0
opencode web   --port 4096

# 3. GitHub agent
opencode github install     # add a workflow file to your repo
opencode pr 123             # check out PR #123 and start a session
```

Useful `run` flags: `--continue` / `--session <id>` (resume), `--share` (publish), `--format json` (machine-readable), `--file <path>` (attach), `--dangerously-skip-permissions` (auto-approve everything not `deny` — **CI only**).

Sessions, stats, sharing:

```bash
opencode session list                  # past sessions
opencode stats --days 30 --models      # token & cost by model
opencode export <id> --sanitize        # JSON dump (with redaction)
opencode import session.json           # restore from JSON or share URL
```

> 📚 Full CLI reference: [`docs/reference/cli.md`](docs/reference/cli.md). CI recipes (GitHub Actions, GitLab CI): [`docs/workflows.md`](docs/workflows.md).

---

### Sharing

`/share` generates a public link to the current session (`opncd.ai/s/<id>`). Three modes via `opencode.json`:

```json
{ "share": "manual" }     // default — only when you ask
{ "share": "auto" }       // every new session is shared
{ "share": "disabled" }   // forbid sharing entirely
```

`/unshare` revokes the link. Enterprise builds can enforce `"disabled"` via managed config.

> ⚠️ **Privacy:** Shared conversations live on OpenCode's servers until you unshare. Don't share sessions with secrets, proprietary code, or confidential data.

---

## Extending OpenCode

OpenCode has **five extension points**. Pick by trigger and surface:

```mermaid
flowchart TD
    Start([Repeatable task you want<br/>OpenCode to do]) --> Q1{How does it trigger?}
    Q1 -->|User types /name| Q2{Just a prompt template,<br/>or a full role<br/>with permissions?}
    Q1 -->|Model auto-discovers<br/>from a description| AS[Agent Skill<br/>.opencode/skills/NAME/SKILL.md]
    Q1 -->|Event in OpenCode<br/>itself| Q3{Local code or<br/>external system?}
    Q2 -->|Prompt template| CC[Custom Command<br/>.opencode/commands/NAME.md]
    Q2 -->|Full role| CA[Custom Agent<br/>.opencode/agents/NAME.md]
    Q3 -->|Local JS/TS| PL[Plugin<br/>.opencode/plugins/NAME.js]
    Q3 -->|External tool| MCP[MCP Server<br/>opencode.json → mcp]
```

| Extension | Triggered by | Lives in |
|---|---|---|
| [Custom Commands](#custom-commands) | User typing `/<name>` | `.opencode/commands/*.md` |
| [Agent Skills](#agent-skills) | Model auto-discovery (description match) | `.opencode/skills/<name>/SKILL.md` |
| [Plugins](#plugins) | Lifecycle events (tool calls, file edits, sessions) | `.opencode/plugins/*.{js,ts}` |
| [Agents](#agents) | Tab key or `@<name>` mention | `.opencode/agents/<name>.md` |
| [MCP Servers](#mcp-servers) | Prompt-driven external tool use | `opencode.json` → `mcp` |

> 💡 These five compose. Most polished workflows combine 2–3.

---

### Slash Commands

OpenCode ships a set of built-in slash commands plus everything you write yourself.

| Command | What it does |
|---|---|
| `/init` | Guided generation of `AGENTS.md` |
| `/help` | Show the help dialog |
| `/new` *(`/clear`)* | New session |
| `/sessions` *(`/resume`, `/continue`)* | List and switch sessions |
| `/models` | Browse models |
| `/connect` | Add a provider |
| `/themes` | Switch theme |
| `/compact` *(`/summarize`)* | Compact session to save tokens |
| `/share` · `/unshare` | Public link control |
| `/export` | Export to markdown |
| `/undo` · `/redo` | Walk edit history |
| `/editor` | Open `$EDITOR` |
| `/details` · `/thinking` | Toggle visibility of tool / reasoning blocks |
| `/exit` *(`/quit`, `/q`)* | Exit |

Custom commands can override built-ins with the same name.

> 📚 Full reference: [`docs/reference/slash-commands.md`](docs/reference/slash-commands.md).

---

### Custom Commands

> **Mental model:** A custom command is a prompt template you've named. Save as `.opencode/commands/<name>.md`, invoke as `/<name>` in the TUI — with `$ARGUMENTS`, `@file`, and `!shell` interpolated at invocation time.

Minimal example:

```markdown
---
description: Run tests and triage failures
agent: build
---

!pnpm test --reporter=verbose

If any tests failed above, open the failing files and propose precise fixes.
Otherwise, summarize the coverage.
```

Save as `.opencode/commands/test.md` → invoke with `/test`.

| Frontmatter key | Purpose |
|---|---|
| `description` (required) | Shown in the slash-command palette |
| `agent` | Which agent runs it (`build`, `plan`, or custom) |
| `model` | Override the model just for this command |
| `subtask` | `true` runs as a subagent (isolated child session) |

| Body placeholder | Substitutes |
|---|---|
| `$ARGUMENTS` / `$1` / `$2` | Text after the command name |
| `@<path>` | File content (fuzzy resolved) |
| `` `!<cmd>` `` | Shell stdout |

This repo ships four examples in [`.opencode/commands/`](.opencode/commands/): `/review`, `/pr`, `/test`, `/optimize`.

> 📚 Deep dive: [`docs/commands.md`](docs/commands.md) · [opencode.ai/docs/commands](https://opencode.ai/docs/commands).

---

### Agent Skills

> **Mental model:** A skill is a **discoverable** workflow. The agent sees the skill's `name` and `description` and decides on its own to load it when the task matches. You don't have to remember to invoke — the model does.

OpenCode uses Claude Code-compatible Agent Skill folders. Lookup paths (project → global → Claude-compat → Agent-compat):

```
.opencode/skills/<name>/SKILL.md
~/.config/opencode/skills/<name>/SKILL.md
.claude/skills/<name>/SKILL.md
.agents/skills/<name>/SKILL.md
```

Each `SKILL.md` needs YAML frontmatter with a `name` (lowercase-kebab, ≤64 chars) and a `description` (1–1024 chars). **The description is the discovery signal** — write it like a trigger sentence the agent will recognize.

**Command vs. skill, in one line:** commands are user-invoked (`/<name>`), skills are model-invoked (description match). Write both for the same workflow if you want both surfaces.

This repo ships one example: [`.opencode/skills/git-release/SKILL.md`](.opencode/skills/git-release/SKILL.md).

> 📚 Deep dive: [`docs/skills.md`](docs/skills.md) · [opencode.ai/docs/skills](https://opencode.ai/docs/skills).

---

### Plugins

> **Mental model:** Plugins are OpenCode's **event-driven extension surface** — small JavaScript or TypeScript modules that subscribe to lifecycle events (tool calls, file edits, session state) and run code automatically. `husky` for your AI session.

Two locations:

```
.opencode/plugins/<name>.{js,ts}                    # project
~/.config/opencode/plugins/<name>.{js,ts}           # global
```

Plus npm packages via the `plugin` array in `opencode.json`:

```json
{ "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"] }
```

Auto-installed via Bun, cached under `~/.cache/opencode/node_modules/`.

Plugins receive `{ project, directory, worktree, client, $ }` and return event handlers. `$` is the Bun shell. Events span tools, files, sessions, messages, permissions, LSP, TUI — ~25 total.

This repo ships two working examples in [`.opencode/plugins/`](.opencode/plugins/):

| File | What it does |
|---|---|
| [`protect-secrets.js`](.opencode/plugins/protect-secrets.js) | Blocks any tool call touching `.env*`, `secrets/`, SSH keys |
| [`audit-log.js`](.opencode/plugins/audit-log.js) | Appends every successful tool call to `.opencode/audit.jsonl` |

> ⚠️ **Security:** Plugins run arbitrary code with your user permissions. Read every third-party plugin before installing — exactly like reviewing a shell script before sourcing.

> 📚 Deep dive: [`docs/plugins.md`](docs/plugins.md) · [opencode.ai/docs/plugins](https://opencode.ai/docs/plugins).

---

### Agents

OpenCode ships five built-in agents, and you can define your own as markdown files.

#### Built-in

| Agent | Mode | Tools | Reach for it when… |
|---|---|---|---|
| `build` | primary (default) | All | Default daily-driver — implementation, refactors |
| `plan` | primary | `edit` and `bash` default to `ask` | Read-only-ish analysis, exploration |
| `general` | subagent | All minus `todowrite` | Multi-step tasks isolated from main session |
| `explore` | subagent | `read`, `grep`, `glob`, `list` | "Where is X?" code search |
| `scout` | subagent | `webfetch`, `websearch`, + read tools | External docs and dependency research |

`Tab` cycles primaries. `@<name>` invokes a subagent.

#### Custom

Drop a markdown file in `.opencode/agents/`:

```markdown
---
description: Senior frontend engineer — Tailwind + React + TypeScript
mode: all
model: anthropic/claude-sonnet-4-5
permission:
  edit: allow
  bash:
    "*": "ask"
    "pnpm test*": "allow"
    "git status*": "allow"
---

You're a senior frontend engineer working on a React/Tailwind codebase…
```

Filename → agent name. `frontend-engineer.md` → `@frontend-engineer` (subagent) or in the Tab cycle (primary). The `mode` value picks the surface:

| `mode` | Where it appears |
|---|---|
| `primary` | Tab cycle alongside `build` / `plan` |
| `subagent` | `@<name>` mentions only (runs in a child session) |
| `all` | Both |

Bash permissions accept a **glob-pattern map** (`{"*": "ask", "git status*": "allow", "rm -rf*": "deny"}`) — most-specific match wins.

> 📐 This repo ships **drop-in specialist prompts** in [`specialized-agents/`](specialized-agents/) — backend, frontend, code reviewer, security reviewer, tech lead, database, UX. Copy any of them into `.opencode/agents/<name>.md` to use.

> 📚 Deep dive — full frontmatter key list, all 17 permission keys, JSON-form alternative: [`docs/agents.md`](docs/agents.md) · [`docs/reference/permissions.md`](docs/reference/permissions.md).

---

### MCP Servers

> MCP is the universal connector that lets OpenCode talk to **external tools** — browsers, databases, search engines, ticketing systems — through one open protocol. USB-C for AI integrations.

Declare servers in the `mcp` section of `opencode.json`. Local servers spawn a subprocess; remote servers hit an HTTPS endpoint with automatic OAuth via Dynamic Client Registration (RFC 7591).

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "playwright": {
      "type": "local",
      "command": ["npx", "-y", "@playwright/mcp@latest"]
    },
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": { "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}" }
    },
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

Manage from the CLI: `opencode mcp add | list | auth <name> | logout <name> | debug <name>`. Reference a server's tools in a prompt with `use <server-name>`.

Featured walkthroughs in [`mcp-servers/`](./mcp-servers/):

| Server | What it adds |
|---|---|
| [Playwright](./mcp-servers/playwright.md) | Browser automation — DOM, network, screenshots, accessibility |
| [Context7](./mcp-servers/context7.md) | Live, version-pinned library docs piped into the prompt |
| [Sentry](./mcp-servers/sentry.md) | Errors, traces, releases |
| [Grep by Vercel](./mcp-servers/grep.md) | Code search across GitHub |

> ⚠️ **Token budget:** MCP tools land in the model's tool surface every turn — heavy servers can easily eat 10K+ tokens of context. Disable noisy tools with the `tools` map (e.g. `"github_*": false`).

> 📚 Deep dive: [`docs/mcp.md`](docs/mcp.md) · [opencode.ai/docs/mcp-servers](https://opencode.ai/docs/mcp-servers) · [Registry](https://registry.modelcontextprotocol.io/).

---

## Reference

### FAQ

*[→ Full FAQ in `docs/reference/faq.md`](docs/reference/faq.md)*

**Is OpenCode free?**
The software is open source (MIT). You pay for whichever LLM provider you use. [OpenCode Zen](#opencode-zen) is pay-as-you-go starting at fractions of a cent per request; BYOK works for direct providers.

**Does OpenCode work without an internet connection?**
Yes, with a local model (Ollama, LM Studio, llama.cpp). Network is needed for hosted providers, remote MCP servers, sharing, and updates.

**Can I migrate from Claude Code?**
Most concepts map cleanly but a few fields and file paths differ. OpenCode reads `CLAUDE.md` and `.claude/skills/` as fallbacks. Slash commands move from `.claude/commands/` → `.opencode/commands/`; Python hooks become JS/TS plugins; agent frontmatter uses different keys (`name` gone, `mode` new, `tools` becomes `permission`). See [the full migration guide](docs/migration.md).

**Custom commands vs. skills — which should I write?**
Both. Commands are **explicit** (user types `/<name>`); skills are **discoverable** (model picks them up). Use commands for workflows the user owns, skills for expertise the agent should reach for. Comparison in [`docs/commands.md`](docs/commands.md#when-to-use-a-command-vs-a-skill-vs-an-agent).

**How do I keep OpenCode from running risky shell commands?**
Set `bash` permission to `"ask"` at the project level, or use the glob form to whitelist only safe patterns. Full mechanism in [`docs/reference/permissions.md`](docs/reference/permissions.md).

**Where do I see my token usage?**
`opencode stats` for a multi-day breakdown by model and project. The TUI also surfaces per-session totals in the footer.

---

### Updates & Deprecations

*[→ Full changelog in `docs/reference/changelog.md`](docs/reference/changelog.md)*

**Current release:** **v1.15.4** *(2026-05-17)*. Run `opencode upgrade` to get it.

**Recent highlights:**

- 🆕 **Agent Skills compatibility** — auto-discoverable workflows via `SKILL.md` (Claude Code-compatible).
- 🆕 **Glob-pattern bash permissions** — fine-grained allow/ask/deny per command pattern.
- 🆕 **Remote MCP with auto-OAuth** — Dynamic Client Registration handled out of the box.
- 🆕 **Desktop app (beta)** — macOS, Windows, Linux at [opencode.ai/download](https://opencode.ai/download).
- 🆕 **ACP server (`opencode acp`)** — Agent Client Protocol for editor integrations.
- 🆕 **Managed configs** — macOS `/Library/Application Support/opencode/`, Linux `/etc/opencode/`, Windows `%ProgramData%\opencode`, plus macOS MDM preferences.
- 📝 **AGENTS.md** is canonical; `CLAUDE.md` is now a fallback only.

> 💡 Source of truth: [GitHub releases](https://github.com/anomalyco/opencode/releases).

---

### References

*[→ Full reading list in `docs/reference/further-reading.md`](docs/reference/further-reading.md)*

**Most-clicked starting points:**

- [OpenCode docs (official)](https://opencode.ai/docs/)
- [OpenCode on GitHub](https://github.com/anomalyco/opencode)
- [OpenCode Zen](https://opencode.ai/docs/zen)
- [Config schema](https://opencode.ai/config.json) · [TUI schema](https://opencode.ai/tui.json)
- [Official MCP registry](https://registry.modelcontextprotocol.io/) · [Protocol spec](https://modelcontextprotocol.io/)

---

**Reading tips:** Anchor links work natively on GitHub — tap the table-of-contents button at the top of the file view. On a phone, stick to [Choose your path](#-choose-your-path); wider tables read best on desktop.

> Features, pricing, and availability change frequently. Always check the [official OpenCode documentation](https://opencode.ai/docs/) for the most current information.

*Last reviewed 2026-05-18 · OpenCode v1.15.4 · Spotted something stale? [Open an issue](../../issues) or send a PR — see [`CONTRIBUTING.md`](CONTRIBUTING.md).*
