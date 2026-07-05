# Specialized Agents

> **Starting points, not authoritative wisdom.** These are one set of defensible defaults for common engineering roles — copy them to `.opencode/agents/<name>.md` and **edit them to match your stack, your conventions, and your taste.** They encode opinions that a senior engineer on your team might disagree with, which is fine — the value is having a coherent starting point, not in any one rule being universally right.

> When something in a prompt says "always X, never Y," read it as "by default, X — but override per project in your `AGENTS.md` if Y is correct for you."

## How to use

Each role has:

- A **system prompt** under [`system-prompts/`](system-prompts/) — copy verbatim or as a starting point
- A short **description** under [`descriptions/`](descriptions/) — what the role focuses on and when to reach for it

To install one in your project:

```bash
mkdir -p .opencode/agents
cp specialized-agents/system-prompts/code-reviewer-prompt.md .opencode/agents/code-reviewer.md
```

The filename you choose becomes the agent's mention name (`@code-reviewer`).

You can also reference the prompt file from `opencode.json` without copying:

```json
{
  "agent": {
    "code-reviewer": {
      "description": "Senior code reviewer",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-5",
      "prompt": "{file:./specialized-agents/system-prompts/code-reviewer-prompt.md}",
      "permission": { "edit": "deny" }
    }
  }
}
```

> ⚠️ **Warning:** `{file:...}` inlines the file verbatim — including its YAML frontmatter — into the system prompt. Strip the frontmatter block from the copy you reference this way.

## Available roles

| Role | Mode | Reach for it when… | Prompt | Description |
|---|---|---|---|---|
| **Code Reviewer** | subagent | Surface bugs / security / perf / maintainability in a diff or branch | [prompt](system-prompts/code-reviewer-prompt.md) | [description](descriptions/code-reviewer.md) |
| **Security Reviewer** | subagent | Audit code for OWASP-style vulnerabilities | [prompt](system-prompts/security-reviewer-prompt.md) | [description](descriptions/security-reviewer.md) |
| **Backend Engineer** | all (primary + subagent) | TypeScript/Go/Python API work, DB integration, REST/GraphQL | [prompt](system-prompts/backend-engineer-prompt.md) | [description](descriptions/backend-engineer.md) |
| **Frontend Engineer** | all (primary + subagent) | React/Tailwind/TypeScript UI work, accessibility, component design | [prompt](system-prompts/frontend-engineer-prompt.md) | [description](descriptions/frontend-engineer.md) |
| **Tech Lead** | all (primary + subagent) | Architectural decisions, cross-team trade-offs, sequencing work | [prompt](system-prompts/tech-lead-prompt.md) | [description](descriptions/tech-lead.md) |
| **UX Engineer** | all (primary + subagent) | Component-first UI work, design-system alignment | [prompt](system-prompts/ux-engineer-prompt.md) | [description](descriptions/ux-engineer.md) |
| **Database Engineer** | all (primary + subagent) | Schema design, migrations, query performance | [prompt](system-prompts/database-engineer-prompt.md) | [description](descriptions/database-engineer.md) |

> 💡 These are starting points. Edit the prompts to match your stack — replace generic guidance with your actual conventions, technologies, and naming.

## Patterns

### Sequential review

```text
[build] > implement the OAuth refresh endpoint
[build] > @code-reviewer review the changes
[build] > @security-auditor audit the same files
[build] > address the high-severity findings
```

### Parallel research

```text
> @backend-engineer  propose a migration plan for the payments service
> @database-engineer review the schema implications
> @tech-lead         decide which proposal to ship
```

### Persistent specialist primary

For ongoing work in a single area, install a role as a **primary** agent (`mode: primary` or `mode: all`) so it's a Tab target.

```bash
cp specialized-agents/system-prompts/frontend-engineer-prompt.md .opencode/agents/frontend.md
# Edit the frontmatter to `mode: primary`, then Tab in the TUI cycles
# [build] ↔ [plan] ↔ [frontend]
```

## Customizing

Three things to adapt before using these in earnest:

1. **Tech stack lines** — the prompts mention "TypeScript, React, Tailwind" etc. Replace with your actual stack.
2. **Repo-specific conventions** — point at your `AGENTS.md` and let it carry the conventions.
3. **Permission profiles** — every role's permission map is conservative by default. Loosen `bash` patterns for commands your team runs constantly.

The prompts are MIT-licensed (same as the repo). Fork them.
