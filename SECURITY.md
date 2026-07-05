# Security Policy

## Scope

This repository is a **documentation guide**, not application code. It ships:

- Markdown documentation
- Two example JS plugins ([`.opencode/plugins/`](.opencode/plugins/))
- Example agent / command / skill files

The plugins are simple and self-contained, but because they're meant to run inside a user's OpenCode session, security still matters.

## Reporting a vulnerability

If you find a security issue in:

| Where | Report to |
|---|---|
| **OpenCode itself** (the tool) | Open a [security advisory on `anomalyco/opencode`](https://github.com/anomalyco/opencode/security/advisories/new) |
| **The example plugins in this repo** | Use GitHub's [private vulnerability reporting](https://github.com/wesammustafa/opencode-primer/security/advisories/new) ("Report a vulnerability" under the repo's Security tab) |
| **A factual error in documentation** that could mislead a user into a vulnerable configuration | Open a normal issue or PR |

Please **don't** disclose security issues publicly until they've been addressed. We'll acknowledge receipt within 7 days and aim to resolve within 30.

## What counts as a vulnerability here

- An example plugin that doesn't do what its docstring claims (e.g. fails to block a sensitive path it says it blocks).
- A doc example that demonstrates an insecure configuration without warning.
- A copy-pasteable command in the docs that exfiltrates data, executes arbitrary code unexpectedly, or weakens the user's setup.

## What doesn't count

- OpenCode core bugs — those belong to [`anomalyco/opencode`](https://github.com/anomalyco/opencode/issues).
- General "plugins can run arbitrary code" concerns — this is documented behavior of the plugin system itself.

## Supply-chain notes

This repo has **no runtime dependencies** and **no build step**. The two example plugins use only Node built-ins (`node:fs/promises`, `node:path`).
