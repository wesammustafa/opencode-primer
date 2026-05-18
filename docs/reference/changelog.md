# Changelog Highlights

> Notable OpenCode releases. For the authoritative, complete list, see [github.com/anomalyco/opencode/releases](https://github.com/anomalyco/opencode/releases).

This document tracks **what's new at a high level** — the things that change how you use OpenCode. Bug fixes and small polish items aren't listed here.

## v1.15.x — May 2026

Current stable line. Run `opencode upgrade` to get the latest.

**Verified latest release:** `v1.15.4`, published 2026-05-17 17:44 UTC ([GitHub release](https://github.com/anomalyco/opencode/releases/tag/v1.15.4)).

**Highlights:**

- **Agent Skills compatibility** — discoverable workflows via `SKILL.md` folders; compatible with Claude Code skill format.
- **Glob-pattern bash permissions** — fine-grained `allow`/`ask`/`deny` per command pattern, with most-specific wins.
- **Managed configs** — `/Library/Application Support/opencode/` (macOS), `/etc/opencode/` (Linux), `%ProgramData%\opencode` (Windows), plus macOS MDM preferences for enterprise rollouts.
- **ACP server** (`opencode acp`) — Agent Client Protocol server for editor integrations.
- **Remote MCP with auto-OAuth** — Dynamic Client Registration (RFC 7591) handled automatically.
- **Desktop app (beta)** — macOS, Windows, Linux at [opencode.ai/download](https://opencode.ai/download).
- **`AGENTS.md` is canonical** — `CLAUDE.md` remains a fallback for migration (`OPENCODE_DISABLE_CLAUDE_CODE=1` disables it).

## Earlier 2026

- **Plugin event surface expanded** — `session.idle`, `session.compacted`, `tui.toast.show` and more.
- **`opencode pr <num>`** — check out a GitHub PR branch and start a session in it.
- **`opencode stats`** — per-day, per-model, per-project breakdowns.
- **TUI command palette** (`ctrl+p`) — fuzzy-pick slash commands.
- **`tools` glob patterns** — enable/disable groups of MCP tools.
- **`/details` and `/thinking`** — toggle tool-output and thinking-block visibility from inside the TUI.

## 2025

Founding releases. Highlights from this period:

- **TUI launch** — terminal UI as the primary interface.
- **MCP support** — both local and remote servers.
- **Plugin system** — JS/TS event-driven extensions.
- **OpenCode Zen** — curated model gateway with pay-as-you-go billing.
- **`/share`** — public conversation links via `opncd.ai/s/<id>`.
- **`opencode serve` / `opencode web`** — headless and web-UI modes.

---

## Coming soon (roadmap topics)

These are themes the OpenCode team has discussed publicly — not commitments to ship by a specific date.

- Deeper IDE integrations via ACP
- Expanded plugin event surface
- More built-in agents and skills
- Workspace sync across devices

For the current state, check the [GitHub repo](https://github.com/anomalyco/opencode), the [discussions](https://github.com/anomalyco/opencode/discussions), and [opencode.ai/docs](https://opencode.ai/docs).

---

## Deprecations

- `CLAUDE.md` as a primary instructions file — use `AGENTS.md`. (Fallback still works; disable with `OPENCODE_DISABLE_CLAUDE_CODE=1`.)

---

*Last reviewed: 2026-05-18 · For the authoritative list, see [GitHub releases](https://github.com/anomalyco/opencode/releases) · Canonical docs: [opencode.ai/docs](https://opencode.ai/docs/).*
