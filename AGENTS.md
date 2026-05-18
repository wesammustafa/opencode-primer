# AGENTS.md

> Project instructions for OpenCode. Read every session.

## What this repo is

A practical, opinionated guide to using [OpenCode](https://opencode.ai) — README, supporting docs, drop-in agent prompts, MCP walkthroughs, and a worked example of a fully-configured `.opencode/` directory. It's a **documentation repository**, not application code.

## Repo layout

```
.
├── README.md                       # Main guide (the centerpiece)
├── AGENTS.md                       # This file
├── CONTRIBUTING.md                 # How to contribute
├── LICENSE                         # MIT
├── docs/
│   ├── quickstart.md               # 5-minute getting-started
│   ├── zen.md                      # Zen model gateway details
│   ├── tui.md                      # TUI mastery
│   ├── agents.md                   # Custom agent deep dive
│   ├── commands.md                 # Custom slash commands
│   ├── skills.md                   # Agent skills
│   ├── plugins.md                  # Plugin/hook system
│   ├── mcp.md                      # MCP integration
│   ├── workflows.md                # Real-world recipes
│   ├── migration.md                # Migration from Claude Code / Cursor
│   ├── faq.md                      # FAQ + troubleshooting
│   └── reference/
│       ├── cli.md                  # All CLI commands
│       ├── slash-commands.md       # All TUI slash commands
│       ├── permissions.md          # Permission model
│       ├── changelog.md            # OpenCode releases
│       └── further-reading.md      # External resources
├── .opencode/
│   ├── agents/                     # Example custom agents
│   ├── commands/                   # Example custom commands
│   └── skills/                     # Example agent skills
├── mcp-servers/                    # MCP server walkthroughs
├── specialized-agents/             # Drop-in specialist prompts
│   ├── system-prompts/             # System prompts (10 roles)
│   └── descriptions/               # Role descriptions
└── Images/                         # Diagrams and screenshots
```

## Editing rules

### Always

- **Cite the source.** Every factual claim about OpenCode must trace back to [opencode.ai/docs](https://opencode.ai/docs/), the [GitHub repo](https://github.com/anomalyco/opencode), or an official release note. Don't paraphrase from memory.
- **Verify version-specific claims.** Pricing, model names, commands, and flags change. When in doubt, check the docs page that owns the topic.
- **Use OpenCode's actual terminology.** "Custom commands" not "slash skills"; "agents" and "subagents" not "personas"; "plugins" not "hooks" (OpenCode plugins serve the hook role).
- **Match the README's tone.** Practical, mental-model-first, prescriptive ("Reach for it when…"). No marketing fluff.
- **Update the `Last reviewed` date** at the bottom of the README when making material changes.

### Never

- **Don't invent commands, flags, or features.** If you can't verify it, leave it out.
- **Don't hardcode prices without a "verified" date.** Always show the date next to any pricing table.
- **Don't add `Co-Authored-By` lines to commits** unless the user asks for them.
- **Don't `git push --force` to `main`**, ever, without explicit permission.
- **Don't introduce affiliate links or sponsorship blocks** without the maintainer's approval.

## Style conventions

### Markdown

- One blank line between sections. No trailing whitespace.
- Code fences with language tags: ` ```bash `, ` ```json `, ` ```markdown `.
- Internal links use anchor form: `[label](#section-id)`. Anchors are auto-derived from headings (lowercased, spaces → dashes, special chars stripped).
- Tables: header row, separator row, no leading/trailing pipes. Keep column widths reasonable for desktop reading.
- Callouts use blockquotes with emoji prefixes:
  - `> 💡 **Pro Tip:** …` for tips
  - `> ⚠️ **Warning:** …` for foot-guns
  - `> 🆕 …` for new features
  - `> 📚 …` for deeper-reading pointers
- Emoji policy:
  - **OK** — one leading emoji on H2 navigation headings (🧭 🧠 📚 📖), and the callout-prefix set above.
  - **Not OK** — decorative emoji inside prose, in code, or on H3/H4 headings. One per spot, never decorative density.

### Code samples

- **JSON examples** in this repo are valid `opencode.json` snippets — paste-ready. Include the `$schema` line on full-file examples.
- **Shell examples** assume a POSIX shell. Use `bash` fence; quote variables (`"$VAR"`).
- **Markdown front-matter** uses YAML with `---` fences. Match the exact key spelling from the OpenCode docs (e.g., `description`, `mode`, `model`, `permission`, `tools`).

### Tone

- **Be concrete.** "Reach for it when X" beats "useful for X."
- **Lead with the mental model**, then the syntax, then the example.
- **Compare options side-by-side** when there's a choice to make (custom commands vs. skills, etc.).
- **Emoji discipline.** Allowed: H2 navigation marker, and the callout prefixes listed under "Markdown" above. Not allowed: decoration inside prose or on H3/H4 headings.

## Commands

This repo has no build/test stack — it's pure markdown. Useful housekeeping:

```bash
# Spell-check (if installed)
codespell README.md docs/

# Find broken internal links
grep -nE '\]\(#[a-z0-9-]+\)' README.md docs/*.md
```

## How OpenCode should work in this repo

- **Default agent:** `build` is fine — edits are local-file-only and easily reversible.
- **No network-dependent tools needed** for editing docs. `webfetch`/`websearch` are useful only when verifying external claims.
- **Bash:** read-only commands (`ls`, `grep`, `git status`, `git diff`) are safe to auto-allow. Writes (`rm`, `mv`, `git push`) should always require confirmation.

## When to update what

| Trigger | What to update |
|---|---|
| New OpenCode release | `docs/reference/changelog.md` + version line in README footer |
| Pricing change | Pricing table in README + `docs/zen.md`, with new "verified" date |
| New built-in command | Slash-command list in README + `docs/reference/slash-commands.md` |
| Discovered factual error | Fix the source location; grep for repeats |

---

*This file is read by OpenCode at every session. Keep it short, accurate, and actionable.*
