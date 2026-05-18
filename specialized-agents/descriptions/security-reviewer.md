# Security Reviewer

A subagent dedicated to security audits — OWASP Top 10, secret leaks, auth/authz issues, and dependency risk.

## When to reach for it

- After a `code-reviewer` pass, for security-sensitive changes
- When touching auth, payments, or user data paths
- Before shipping to production for the first time
- After a CVE drops in a dependency you use

## What it does well

- Maps findings to CWE identifiers
- Names the trigger path explicitly (how an attacker reaches the vuln)
- Distinguishes real holes from defense-in-depth gaps

## What it doesn't do

- Edit files
- Speculate about exploitability it can't verify from the code
- Recommend a "secure" rewrite without naming the specific vulns it fixes

→ [System prompt](../system-prompts/security-reviewer-prompt.md)
