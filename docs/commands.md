# Custom Commands

> A custom command is a prompt template you've named. Drop a markdown file in `.opencode/commands/<name>.md` and it becomes `/<name>` in the TUI — with arguments, file refs, and shell output stitched in.

## When to use a command vs. a skill vs. an agent

| | Custom Command | [Agent Skill](skills.md) | [Custom Agent](agents.md) |
|---|---|---|---|
| Invocation | **Manual** — user types `/<name>` | **Auto** — model loads when description matches | Mode-dependent (Tab or `@`) |
| Best for | Repeatable user-driven prompts | Domain expertise the model should discover | A persistent role / tool surface |
| File | `.opencode/commands/<name>.md` | `.opencode/skills/<name>/SKILL.md` *(folder)* | `.opencode/agents/<name>.md` |

A good rule of thumb: **commands run a workflow; skills teach the agent how to handle a class of task; agents are the role doing the work.**

## File format

```markdown
---
description: Run tests with coverage and triage failures
agent: build
model: anthropic/claude-sonnet-5
subtask: false
---

Run the full test suite with coverage and surface failures.
Focus on the failing tests and suggest precise fixes.

Arguments: $ARGUMENTS
```

### Frontmatter

| Key | Type | Required | Purpose |
|---|---|---|---|
| `description` | string | no (recommended) | One-liner shown in the slash-command palette |
| `agent` | string | no | Which agent runs the command (`build`, `plan`, or custom) |
| `model` | `provider/model-id` | no | Override model just for this command |
| `subtask` | bool | no | If `true`, runs the specified agent in an isolated child session |

Only the template body is required — a command file with no frontmatter at all is still a valid command.

### Body placeholders

| Syntax | Substitutes |
|---|---|
| `$ARGUMENTS` | Everything after the command name |
| `$1`, `$2`, … | Positional args (whitespace-split) |
| `@<path>` | File content (fuzzy resolved) |
| ``!`<cmd>` `` | Shell stdout |

Placeholders are resolved **at invocation time**, so each run picks up fresh file content and shell output.

Note the shell-injection syntax is bang **plus backticks** — ``!`cmd` ``. A bare `!cmd` only works as a TUI prompt prefix, not inside command templates.

## Where commands live

| Scope | Path |
|---|---|
| Project (committed) | `.opencode/commands/` |
| Global | `~/.config/opencode/commands/` |

Project commands override globals; both override built-in commands of the same name.

## Examples

### Test runner

```markdown
---
description: Run tests, triage failures
agent: build
---

!`pnpm test --reporter=verbose`

If any tests failed above, open the relevant source files and propose a fix.
Otherwise, summarize coverage and any flaky-looking tests.
```

### Targeted code review

```markdown
---
description: Review changed files for the current branch
agent: plan
---

!`git diff --name-only main...HEAD`

Review each changed file above for security, perf, and style. Suggest fixes
with code snippets — but do not edit files. Prioritize anything under
`src/auth/` or `src/api/`.
```

### Scaffolding with positional args

```markdown
---
description: Scaffold a new React component
agent: build
---

Create a new React component named `$1` under `src/components/$1/`:

- `index.tsx` — named export, Props type, default boilerplate
- `$1.test.tsx` — render test using @testing-library/react
- `$1.module.css` — only if styling is needed

Match the patterns in `src/components/Button/`. TypeScript strict mode.
```

Invoke with: `/scaffold-component UserAvatar`

### Subtask isolation

```markdown
---
description: Deep architectural review (isolated context)
agent: build
subtask: true
model: opencode/claude-opus-4-8
---

You are reviewing the architectural integrity of $ARGUMENTS.

Spend your context on:
- Coupling and cohesion
- Layer violations
- Missing abstractions / premature abstractions
- Long-term maintainability

Produce a report with findings and recommendations. Run as a subagent —
your work won't pollute the main session's context.
```

`subtask: true` runs the **specified agent** (here `build`) in an isolated child session, so the heavy reading and analysis stays separate from your main conversation.

## Patterns

### Chain commands

A command can reference outputs from previous commands via the conversation context:

```text
/test
# (failures observed)
/review src/api/auth.ts
```

The `/review` invocation sees the test output in the conversation history and can use it.

### Capture team-wide workflows

Commit `.opencode/commands/` to your repo. Every contributor's `opencode` now has the same `/test`, `/review`, `/pr` commands with the same exact behavior — like committed git hooks for prompts.

### Pre-baked arguments via frontmatter

If a command always runs with a particular model or agent, put it in the frontmatter so the user can't forget:

```markdown
---
description: Long, deep refactor planning (Opus only)
agent: plan
model: opencode/claude-opus-4-8
---
```

## Built-in commands and overriding

OpenCode's built-in commands (`/init`, `/help`, `/share`, etc. — see [`reference/slash-commands.md`](reference/slash-commands.md)) can be overridden by a same-named file in your `.opencode/commands/`.

> ⚠️ Override sparingly. If you replace `/help`, users in your repo lose access to the real help dialog. Pick a unique name like `/repo-help` instead.

> 📚 Full Commands guide: [opencode.ai/docs/commands](https://opencode.ai/docs/commands).

---

*Last reviewed: 2026-07-05 · Canonical source: [opencode.ai/docs/commands](https://opencode.ai/docs/commands).*
