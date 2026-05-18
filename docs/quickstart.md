# Quickstart

> Five minutes from `curl` to your first AI-assisted commit.

## 1. Install

Pick one:

```bash
# Recommended: install script (auto-detects OS)
curl -fsSL https://opencode.ai/install | bash

# Or via a package manager you already use:
npm i -g opencode-ai@latest
brew install anomalyco/tap/opencode
scoop install opencode
sudo pacman -S opencode
paru -S opencode-bin
mise use -g opencode
nix run nixpkgs#opencode
```

A desktop app (beta) for macOS / Windows / Linux is at [opencode.ai/download](https://opencode.ai/download).

Verify:

```bash
opencode --version
```

## 2. Sign in to a provider

You need an LLM provider. The fastest path is **OpenCode Zen** — one key, dozens of curated models, pay-as-you-go.

```bash
# Visit https://opencode.ai/auth, sign up, add billing, copy your API key.
# Then:
opencode auth login
# Choose "OpenCode Zen" and paste the key.
```

Or sign in directly to Anthropic, OpenAI, Google, Groq, OpenRouter, AWS Bedrock, Azure, Ollama, LM Studio, etc. See [opencode.ai/docs/providers](https://opencode.ai/docs/providers) for the full list.

## 3. Open OpenCode in a real project

```bash
cd ~/your-project
opencode
```

The TUI launches. Try one of these:

| Prompt | What happens |
|---|---|
| `explain what this codebase does` | Reads the repo, summarizes |
| `find every TODO comment` | Greps and lists them |
| `find and fix the failing test in src/api.test.ts` | Diagnoses, edits, runs tests |

## 4. Generate `AGENTS.md`

```
/init
```

This walks you through generating a project-level instructions file (build/test commands, conventions, architecture). Commit it — it's read every session.

## 5. Learn the two essential shortcuts

| Key | Purpose |
|---|---|
| `Tab` | Cycle primary agents (default: `build` ↔ `plan`) |
| `Esc` | Cancel / dismiss |

Two character prefixes that change how you talk to OpenCode in prompts:

| Prefix | Purpose | Example |
|---|---|---|
| `@<path>` | Attach a file's content (fuzzy resolved) | `look at @src/api/auth.ts` |
| `!<cmd>` | Run shell, inject output | `!git diff` then ask Claude about it |

## What next?

- **[Custom Commands](commands.md)** — turn prompts into `/<name>` shortcuts (~3 min)
- **[OpenCode Zen](zen.md)** — model picks, pricing, and BYOK
- **[Agents](agents.md)** — custom build/plan variants and subagents
- **[MCP](mcp.md)** — plug in external tools (browsers, DBs, search)

## Common first-day issues

**`opencode: command not found`**

Add the install path to your shell config:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # or ~/.bashrc
source ~/.zshrc
```

**Auth fails with "no provider configured"**

Run `opencode auth login` and pick a provider. Re-run `/connect` from inside the TUI if you want to add another.

**Want to upgrade later?**

```bash
opencode upgrade            # latest
opencode upgrade v1.15.0    # specific version
```

---

*Last reviewed: 2026-05-18 · Canonical source: [opencode.ai/docs](https://opencode.ai/docs/).*
