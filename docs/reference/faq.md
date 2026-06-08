# FAQ & Troubleshooting

## Getting started

### Q: Is OpenCode free?

The software is free and open-source (MIT). You pay for whichever LLM provider you use:

- **OpenCode Zen** — pay-as-you-go, fractions of a cent per request. Free models available for learning.
- **Direct providers** — your own Anthropic/OpenAI/Google/etc. account; pricing is whatever they charge.
- **Local models** — free if you're running Ollama/LM Studio/llama.cpp on your own hardware.

### Q: What's the difference between OpenCode and Claude Code?

Briefly: OpenCode is **provider-agnostic and open source**; Claude Code is **Anthropic-only and proprietary**.

| | OpenCode | Claude Code |
|---|---|---|
| License | MIT | Proprietary |
| Models | Any provider | Anthropic only |
| Pricing | Pay-as-you-go or BYOK | Subscription |
| Config | `opencode.json` + `.opencode/` | `.claude/settings.json` + `.claude/` |
| Hooks | JS/TS plugins | Python scripts |

OpenCode reads `CLAUDE.md` and `.claude/skills/` as fallbacks for easier migration.

### Q: Does OpenCode work offline?

Yes, if you point it at a local model (Ollama, LM Studio, llama.cpp). Internet access is needed for hosted providers, remote MCP servers, sharing, and updates.

### Q: Which model should I use?

Honest answer: **try a few on your actual workload.** Benchmarks generalize poorly to specific codebases. Below are starting suggestions, not a ranking — different teams report different winners.

| Task | Reasonable options |
|---|---|
| Day-to-day coding | Claude Sonnet (4.5 direct or 4.6 via Zen), GPT-5.4, Gemini 3.1 Pro |
| Complex multi-file refactors | Claude Opus 4.7, GPT-5.5, GPT-5.5 Pro |
| Fast, lightweight tasks | Claude Haiku 4.5, GPT-5.4 Mini, GPT-5.4 Nano, GLM/Kimi |
| Long-context (>200K tokens) | GPT-5.5 (272K), Claude Sonnet 4.5/4 (>200K tier) |
| Budget-friendly | Qwen3.6 Plus, GPT-5.4 Nano, Qwen3.5 Plus, MiniMax M2.7 |
| Local / offline | Ollama or LM Studio with a coding-tuned model that fits your hardware (Qwen 2.5 Coder, DeepSeek Coder, CodeLlama — quality varies hugely with model size and quantization) |

Use a cheaper model for `explore`/`scout` subagents — they read a lot but don't need to write. See [`../zen.md`](../zen.md) for full pricing and the cheap-explorer / strong-executor pattern.

> No single model wins every benchmark, and benchmarks don't predict your code. If a model feels wrong, switch — model identity matters more than people often think.

---

## Configuration

### Q: Where does OpenCode store config?

| Type | Path |
|---|---|
| User config | `~/.config/opencode/opencode.json` |
| Project config | `opencode.json` in project root |
| Project assets | `.opencode/` in project root |
| Sessions / cache | `~/.local/share/opencode/` (Linux/macOS) |
| Logs | `~/.local/share/opencode/log/` |
| Custom path | Set `OPENCODE_CONFIG=<path>` |

Configs merge from low to high priority: remote `.well-known/opencode` → global → custom path → project → `.opencode/` → inline env var → managed → macOS MDM.

### Q: How do I share config across a team?

Commit `opencode.json`, `AGENTS.md`, `.opencode/agents/`, `.opencode/commands/`, `.opencode/skills/`, and `.opencode/plugins/` to your repo. Every contributor's OpenCode picks them up.

For org-wide defaults, use **managed configs** (`/Library/Application Support/opencode/` on macOS, `/etc/opencode/` on Linux, `%ProgramData%\opencode` on Windows) — they override user config but lose to MDM-pushed configs.

### Q: How do I use a remote config endpoint?

Configure your domain's `.well-known/opencode` to return JSON. OpenCode fetches it as the lowest-priority config layer — useful for org-wide defaults that users can override.

---

## Commands & skills

### Q: Custom command vs. skill vs. agent — which should I write?

| You want… | Reach for… |
|---|---|
| A `/<name>` the user types | **Custom command** in `.opencode/commands/` |
| Workflow the agent **discovers** when the description matches | **Skill** in `.opencode/skills/<name>/SKILL.md` |
| A persistent role with its own model and permissions | **Agent** in `.opencode/agents/<name>.md` |

See [`../commands.md`](../commands.md), [`../skills.md`](../skills.md), [`../agents.md`](../agents.md).

### Q: My skill isn't being discovered. Why?

Almost always the `description` is too vague. Skills load when the model decides the description matches the task. Rewrite the description to:

- Start with what it does (verb-first)
- Name the output concretely
- Include a trigger phrase ("Use when…")

Bad: `Helps with releases`
Good: `Draft release notes from merged PRs, propose a semver bump, emit a gh release create command. Use when preparing a tagged release.`

### Q: Why is my agent slow?

Most common culprits:

1. **Too many MCP tools loaded** → run `opencode mcp list`, disable noisy ones in `tools`.
2. **Big context** → `/compact` aggressively.
3. **Slow model** → switch to a faster one with `/models`.
4. **Watcher choking on large repo** → add ignore patterns under `watcher.ignore` in `opencode.json`.

---

## CLI & headless

### Q: How do I run OpenCode in CI?

```bash
curl -fsSL https://opencode.ai/install | bash
opencode run --agent plan --format json "audit src/ for security issues" > findings.json
```

For unattended runs, `--dangerously-skip-permissions` auto-approves anything that isn't explicitly denied — only after auditing what your prompt and tools can do.

### Q: Can I attach a remote OpenCode server?

Yes:

```bash
# Server side
opencode serve --port 4096 --hostname 0.0.0.0

# Client side
opencode attach http://server.local:4096
```

The TUI talks to the remote server. Add `--username` / `--password` for basic auth.

### Q: How do I track token cost?

```bash
opencode stats --days 30 --models     # by model
opencode stats --days 30 --tools      # by tool
opencode stats --days 30 --project myrepo
```

---

## Migration

### Q: I'm coming from Claude Code. What changes?

See [`../migration.md`](../migration.md) for the full guide. Quick version:

- Rename `CLAUDE.md` → `AGENTS.md`
- Move `.claude/commands/` → `.opencode/commands/`
- Move `.claude/skills/` → `.opencode/skills/`
- Rewrite Python hooks as JS/TS plugins in `.opencode/plugins/`
- Update agent frontmatter — different field names

### Q: Do my Cursor rules work?

Yes — reference them from `opencode.json`:

```json
{
  "instructions": [".cursor/rules/*.md", "AGENTS.md"]
}
```

---

## Privacy & data

### Q: Where does my code go?

- **Local models** — nowhere. Code stays on your machine.
- **Direct providers** — the prompt and edited files go to whichever provider you authenticated with, subject to their policy.
- **Zen** — Zen is a gateway; the underlying provider's policy still applies, plus Zen's policy for billing/routing. Check [opencode.ai/docs/zen](https://opencode.ai/docs/zen) for the current statement.
- **Sharing** (`/share`) — opt-in. Shared conversations live on OpenCode's servers until you unshare them.

### Q: How do I disable sharing entirely?

```json
{ "share": "disabled" }
```

Commit this to `opencode.json` to enforce it across the team. Enterprise builds can also push this via managed config.

### Q: How do I protect secrets?

Three layers:

1. `permission.external_directory: "deny"` so OpenCode can't read outside the project.
2. A plugin that blocks `edit`/`write` to `.env*`/`secrets/` paths (see [`../plugins.md`](../plugins.md#4-block-sensitive-paths)).
3. Don't commit secrets in the first place. `gitleaks` or similar in CI.

---

## Troubleshooting

### Q: `opencode: command not found` after install

Add the install path to your shell:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Q: Authentication fails

```bash
opencode auth logout
opencode auth login         # re-authenticate
```

If using Zen, regenerate the API key on the [dashboard](https://opencode.ai/auth).

### Q: MCP server won't connect

```bash
opencode mcp debug <server-name>
opencode --log-level DEBUG --print-logs
```

For OAuth servers, clear creds and re-auth:

```bash
opencode mcp logout <server-name>
opencode mcp auth   <server-name>
```

### Q: Editor (`/editor`) opens the wrong program

OpenCode uses `$EDITOR`. Set it in your shell:

```bash
export EDITOR='code --wait'         # VS Code
export EDITOR='nvim'                # Neovim
```

### Q: TUI looks broken / colors wrong

- Make sure your terminal supports truecolor. Test: `echo $COLORTERM` should show `truecolor` or `24bit`.
- Try a built-in theme: `/themes` → pick `tokyonight` or `gruvbox`.
- Update OpenCode: `opencode upgrade`.

### Q: How do I report a bug?

[github.com/anomalyco/opencode/issues](https://github.com/anomalyco/opencode/issues). Include `opencode --version`, your OS, and a minimal reproduction.

---

*Last reviewed: 2026-06-08 · Canonical source: [opencode.ai/docs](https://opencode.ai/docs/).*
