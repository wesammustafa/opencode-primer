# Code Reviewer

A subagent that reads diffs and surfaces problems — bugs, security issues, performance bottlenecks, maintainability concerns — without modifying files.

## When to reach for it

- After implementing a change and before opening a PR
- When inheriting code and needing a quick survey
- To get a "second pair of eyes" before merge

## What it does well

- Surfaces concrete findings with file/line citations
- Prioritizes by severity (Critical → Low)
- Sticks to specifics, skips bikeshedding

## What it doesn't do

- Edit files (permission denied)
- Run tests or builds
- Propose large refactors outside the change scope

→ [System prompt](../system-prompts/code-reviewer-prompt.md)
