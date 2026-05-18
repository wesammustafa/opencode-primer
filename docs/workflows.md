# Workflows — Real-World Recipes

> Glue patterns that combine commands, agents, skills, and MCP. Use them as inspiration or copy them whole.

## 1. Test-Driven feature development

Goal: implement a feature with tests written first and reviewed in plan mode.

```text
[plan]  > write failing tests for a `slugify` function with these specs:
        - handles unicode (café → cafe)
        - collapses spaces (Hello World → hello-world)
        - strips trailing punctuation
[build] > <Tab>
[build] > run the failing tests to confirm they fail
[build] > implement slugify so the tests pass
[build] > /review @src/util/slugify.ts
[build] > /pr
```

What's happening:

- **`plan`** writes tests without touching code (edits default to `ask` in plan agent — easier than expected).
- **`build`** runs the tests and implements.
- **`/review`** custom command surfaces any issues before PR.
- **`/pr`** opens the PR with a generated title and summary.

## 2. Bug investigation with subagents

Goal: isolate context-heavy research from your main session.

```text
> a user reports the payment webhook is being processed twice
> @explore find every code path that handles the payment webhook
> @scout what does Stripe's docs say about webhook idempotency (latest)?

(based on subagent reports)

[plan]  > given the findings, what's the most likely root cause and how should
          we fix it?
[build] > implement the fix
[build] > add an integration test that exercises the duplicate-delivery path
[build] > /test
[build] > /pr
```

`@explore` and `@scout` run in **child sessions** — separate from your main session. Their long file reads and search output don't bloat the parent conversation. Navigate between parent and children with the session-child keybinds.

## 3. Multi-agent review

Goal: get two perspectives on the same change.

```text
[build] > implement the OAuth token refresh path in src/auth/refresh.ts
[build] > @code-reviewer review the changes in src/auth/refresh.ts
[build] > @security-auditor audit src/auth/refresh.ts for token-handling vulns
[build] > address the high-severity findings, then re-run @code-reviewer to verify
```

Two specialized subagents from [`.opencode/agents/`](../.opencode/agents/) give you independent review perspectives. Run them sequentially or in parallel — your call.

## 4. Cross-repo research with MCP

Goal: find how an idiom is used across GitHub before adopting it.

Configure [`grep`](https://mcp.grep.app/) MCP server in `opencode.json`:

```json
{
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```

Then:

```text
use gh_grep to search for "useTransition" usage in React 19 codebases on GitHub
look for the 3 most common patterns and summarize when each is used
```

OpenCode reads the search results through MCP and produces a written summary grounded in real code.

## 5. Long-running migration plan

Goal: walk a multi-step migration from a fresh plan to a tracked rollout.

```text
[plan]  > Read AGENTS.md and the architecture doc.
          Then propose a migration plan to move from REST to GraphQL.
          Break the plan into atomic, independently-mergeable PRs.
          Output a checklist.
[plan]  > save the plan as docs/migration-graphql.md
[build] > <Tab>
[build] > start on phase 1 of docs/migration-graphql.md — add the GraphQL server
          skeleton. Use the /tdd workflow for each new resolver.
```

Combine that with the [`git-release`](../.opencode/skills/git-release/SKILL.md) skill so each phase ends with a clean tagged release:

```text
> we're about to merge phase 1 — draft release notes
```

The agent picks up the `git-release` skill from the description match and walks through release prep without explicit invocation.

## 6. CI integration — headless OpenCode in a workflow

Goal: run OpenCode on every PR to audit changes. The example below uses GitHub Actions, but the same pattern works on GitLab CI, Buildkite, CircleCI, Jenkins, or anything else that can run a shell — OpenCode is just a CLI you `curl | bash` and then invoke.

`.github/workflows/opencode-review.yml`:

```yaml
name: OpenCode review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with:
          fetch-depth: 0
      - run: curl -fsSL https://opencode.ai/install | bash
      - run: |
          opencode run --agent plan --format json \
            "Review the diff between origin/main and HEAD. Surface security and
             correctness issues only. Output JSON with {severity,file,line,issue,fix}." \
            > review.json
        env:
          OPENCODE_API_KEY: ${{ secrets.OPENCODE_API_KEY }}
      - run: gh pr comment ${{ github.event.pull_request.number }} --body-file review.json
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Equivalent shape on **GitLab CI**:

```yaml
opencode-review:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
  script:
    - curl -fsSL https://opencode.ai/install | bash
    - export PATH="$HOME/.local/bin:$PATH"
    - opencode run --agent plan --format json "Review the diff..." > review.json
    - 'curl -X POST -H "PRIVATE-TOKEN: $CI_TOKEN" --data-urlencode "body=$(cat review.json)" "$CI_API_V4_URL/projects/$CI_PROJECT_ID/merge_requests/$CI_MERGE_REQUEST_IID/notes"'
  variables:
    OPENCODE_API_KEY: $OPENCODE_API_KEY
```

Same idea on Buildkite, CircleCI, Jenkins — install the CLI, set the env var, run a prompt, post the result wherever you post things.

`--dangerously-skip-permissions` is available for fully unattended runs — use it with care.

## 7. Visual iteration

Goal: implement UI to match a mock.

```text
[plan]  > [drag screenshot of the mock into the TUI]
        > what HTML/CSS structure best matches this layout?
[build] > <Tab>
[build] > implement it under src/components/Dashboard/.
        > take a screenshot of the result with the playwright MCP server
        > compare the new screenshot to the mock and refine
```

Two-three iteration rounds usually produces a close visual match. Multimodal models (`opencode/gemini-3.1-pro`, `opencode/claude-sonnet-4-6`) handle the comparison well.

## Cross-cutting tips

- **Always commit `.opencode/` and `AGENTS.md`.** Your workflows become reproducible across teammates.
- **Use `/compact` aggressively** for long sessions — the summary preserves intent at a fraction of the tokens.
- **Use subagents for read-heavy work.** Your main session shouldn't carry 50KB of grep output it'll never reference again.
- **Pick a cheap model for `explore` and `scout` subagents.** They do dumb (but voluminous) work.
- **Audit `opencode stats` weekly.** Surprises in cost almost always trace to one overactive agent or MCP server.

---

*Last reviewed: 2026-05-18 · Canonical source: [opencode.ai/docs](https://opencode.ai/docs/).*
