# Contributing

Thank you for considering a contribution. This repo is a community-maintained guide to [OpenCode](https://opencode.ai) — every typo fix, fact correction, and new example helps the next reader.

## What we welcome

| Contribution | What's helpful |
|---|---|
| **Fact corrections** | OpenCode moves fast. If something here is out of date, fix it and cite the source. |
| **New MCP walkthroughs** | A short page in [`mcp-servers/`](mcp-servers/) with verified setup steps, example prompts, and gotchas. |
| **New specialized-agent prompts** | A new role under [`specialized-agents/system-prompts/`](specialized-agents/system-prompts/) + a one-page description. |
| **Better examples** | Real-world patterns that worked for you. |
| **Typo and grammar fixes** | Just send the PR. |
| **Image / diagram contributions** | Drop PNG/SVG in [`Images/`](Images/) and reference them inline. |

## What we don't accept

- **Unverified claims.** Every factual statement must trace back to [opencode.ai/docs](https://opencode.ai/docs/), the [OpenCode GitHub repo](https://github.com/anomalyco/opencode), or a primary source. No "I heard that…".
- **Marketing language.** This guide is practical, not a sales pitch.
- **Affiliate links or sponsored content** without prior agreement.
- **AI-generated content that hasn't been read and verified by you.** If you used an AI to draft, that's fine — but read it carefully, fact-check, and remove fluff before submitting.

## How to contribute

1. **Open an issue first** for non-trivial changes (new sections, restructuring) so we can align on scope.
2. **Fork → branch → PR.** One topic per PR; smaller is better.
3. **Match the existing style.** See [AGENTS.md](AGENTS.md) for style conventions (markdown, tone, link form).
4. **Cite your sources.** If you're updating a fact, include a link to the source in the PR description.
5. **Update the "Last reviewed" date** at the bottom of the README if you've made material changes.

## Style basics

- Short lines, plain English.
- Lead with the mental model, then the syntax, then the example.
- Comparison tables when there's a choice to make.
- Code fences with language tags. JSON examples should be valid `opencode.json` snippets.
- Emoji callouts: `> 💡 Pro Tip`, `> ⚠️ Warning`, `> 🆕 New`, `> 📚 Further reading`.

## Tips for adding a new MCP walkthrough

A good walkthrough has:

1. **When to reach for it** — one-line use case
2. **Setup** — exact JSON snippet for `opencode.json` and any auth steps
3. **Example prompts** — 2–3 realistic prompts (not "hello world")
4. **What it can do / won't do** — set expectations
5. **Gotchas** — things you wish you'd known
6. **Resources** — links to the upstream project

See [`mcp-servers/playwright.md`](mcp-servers/playwright.md) as a template.

## Tips for adding a new specialized-agent prompt

A good system prompt has:

1. **Frontmatter** with `description`, `mode`, `model`, `temperature`, `permission` — use the format in [`docs/agents.md`](docs/agents.md).
2. **Principles** — 3–5 numbered, prescriptive items. What the agent prioritizes.
3. **Workflow** — concrete steps the agent should follow.
4. **Defaults** — the stack and tools the agent uses.
5. **What I won't do** — explicit constraints. This is what makes specialized agents different from a generic LLM.
6. **Communication style** — how the agent talks (terse, surfaces trade-offs, etc.).

Add the matching short description under [`specialized-agents/descriptions/`](specialized-agents/descriptions/) and update the table in [`specialized-agents/README.md`](specialized-agents/README.md).

## Local check

There's no build system to run, but a quick mental checklist before submitting:

- [ ] All links resolve (in-page anchors and external URLs)
- [ ] Code fences have language tags
- [ ] No trailing whitespace
- [ ] No emoji clutter
- [ ] Facts cite a source

## Questions

Open a [GitHub Discussion](../../discussions) or an [issue](../../issues). Drive-by PRs are welcome too — we'll suggest changes in review.

---

*Thanks for making this resource better.*
