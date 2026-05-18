# Agent Skills

> **Mental model:** A skill is a **discoverable workflow**. The agent sees the skill's `name` and `description` in its tool surface and decides on its own to load the full content when the task matches. You don't have to remember to invoke it — the model does.

## Skill vs. Command — when to use which

| | Agent Skill | Custom Command |
|---|---|---|
| Trigger | Agent decides (description match) | User types `/<name>` |
| File | `.opencode/skills/<name>/SKILL.md` *(folder)* | `.opencode/commands/<name>.md` *(file)* |
| Best for | "When you're doing X, here's how" expertise | Repeatable user-driven actions |
| Discoverable | Yes — surfaces as a tool | Yes — in slash palette |

A great heuristic: **write a skill when the workflow has a natural trigger** ("when preparing a release", "when reviewing a payment-related change"). Write a command when the user is the one who knows it's time.

## File format

A skill is a **folder** named after the skill, containing a `SKILL.md`:

```
.opencode/skills/
└── git-release/
    ├── SKILL.md         # required
    └── ...              # optional resources the skill references
```

`SKILL.md`:

```markdown
---
name: git-release
description: Draft release notes from merged PRs, propose a semver bump, and emit a copy-pasteable `gh release create` command. Use when preparing a tagged GitHub release.
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## What I do
- Read merged PRs since the last tag
- Group by feat/fix/other
- Propose a semver bump (major / minor / patch)
- Emit Keep-a-Changelog-style notes
- Print a ready-to-run `gh release create` command

## When to use me
Use this when preparing a tagged release. Ask the user to confirm the
version bump before doing anything destructive.

## What I won't do
- Push tags or publish releases without confirmation
- Edit files
- Hallucinate changelog entries
```

### Frontmatter rules

| Key | Required | Constraints |
|---|---|---|
| `name` | yes | `^[a-z0-9]+(-[a-z0-9]+)*$`, 1–64 chars — lowercase alphanumeric with single hyphens |
| `description` | yes | 1–1024 chars. **This is the discovery signal** — write it carefully. |
| `license` | no | SPDX identifier ideal |
| `compatibility` | no | `opencode`, `claude-code`, or both |
| `metadata` | no | Arbitrary structured metadata |

### Why the `description` matters

The description is what the model reads when deciding whether to load the skill. Bad descriptions don't get loaded:

```yaml
# 👎 Vague
description: Helps with releases

# 👍 Specific, trigger-shaped
description: Draft release notes from merged PRs, propose a semver bump, and emit a `gh release create` command. Use when preparing a tagged GitHub release.
```

Anatomy of a good description:

- **What it does** (verb-first)
- **What it produces** (concrete output)
- **When to use it** (trigger phrase)

## Where skills live

OpenCode searches multiple locations:

| Location | Scope |
|---|---|
| `.opencode/skills/<name>/SKILL.md` | Project |
| `~/.config/opencode/skills/<name>/SKILL.md` | Global |
| `.claude/skills/<name>/SKILL.md` | Claude Code compatibility |
| `.agents/skills/<name>/SKILL.md` | Agent-format compatibility |

Project skills take precedence over global. Same-named skills in different locations: project wins.

## Permissions

Skills are gated by the `skill` permission. Three values plus glob patterns:

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

| Value | Behavior |
|---|---|
| `"allow"` | Skill loads silently when the agent decides to |
| `"ask"` | User must approve each load |
| `"deny"` | Skill is hidden from the agent's surface |

To disable skills entirely for an agent:

```json
{
  "agent": {
    "build": {
      "tools": { "skill": false }
    }
  }
}
```

## Writing skills the model will actually use

The hardest part is getting the agent to **find** your skill. Tips:

1. **Trigger phrases in the description.** "Use when preparing a release", "Use for any payment-related change", "Use when generating release notes".
2. **Be concrete about output.** Models load skills more readily when the description names a specific artifact they can produce.
3. **One skill, one job.** Don't bundle "release notes + version bump + deploy" — the description gets vague and load decisions get muddled.
4. **Test discovery.** Ask your agent something the skill should handle without naming the skill. If it doesn't pull it in, refine the description.

## Patterns

### Procedure skill

The skill carries the exact procedure for a recurring task.

```yaml
name: bump-dependency
description: Safely upgrade a single dependency — runs typecheck, tests, and changelog scan to surface breaking changes. Use when the user asks to update a specific package.
```

Body: step-by-step procedure, including which commands to run and how to interpret output.

### Convention skill

The skill encodes domain conventions for a specific area of the codebase.

```yaml
name: payment-handler
description: How to safely modify payment-handler code. Use when editing anything under packages/payments/. Encodes our idempotency, refund, and webhook conventions.
```

Body: conventions and rules — what to do, what not to do, with code examples.

### Tool-bridge skill

The skill explains how to use an external CLI or service the agent should discover.

```yaml
name: argo-rollout
description: Use Argo CD to roll out staging deployments. Use when the user wants to deploy a branch to staging. Wraps the `argocd` CLI.
```

Body: CLI invocation, common flags, what success and failure look like.

## Compatibility with Claude Code

Skills using `compatibility: claude-code` work in both tools — OpenCode reads from `.claude/skills/`, Claude Code reads from there natively. Useful for teams running both.

> 📚 Full Skills guide: [opencode.ai/docs/skills](https://opencode.ai/docs/skills).
