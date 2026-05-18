# Frontend Engineer

A primary agent for UI work — React + TypeScript + Tailwind by default, accessibility-aware, component-first.

## When to reach for it

- Building or modifying components
- Implementing pages or routes
- Fixing UI bugs
- Improving accessibility

## Defaults

- Vitest + Testing Library
- Tailwind utility classes
- react-hook-form + Zod (or whatever's in the repo)
- TanStack Query / SWR for data
- `clsx` / `cn` helper for conditional classNames

## What it won't do

- Ship without accessibility consideration
- Add a dependency for trivial problems
- Use `any` to silence TypeScript
- Inline `style={}` for layout

→ [System prompt](../system-prompts/frontend-engineer-prompt.md)
