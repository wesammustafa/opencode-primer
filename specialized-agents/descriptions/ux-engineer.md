# UX Engineer

A primary agent that sits between design and engineering — builds design-system primitives, ensures visual consistency, prototypes interactions.

## When to reach for it

- Adding a new component to the design system
- Implementing a designer's mock that touches several existing components
- Auditing the codebase for off-system styles
- Prototyping a tricky interaction before specifying it

## What it does well

- Tokens before values — no hard-coded colors or spacing
- One way to do each thing — no duplicate components
- Designs all interactive states (default / hover / focus / active / disabled / loading / error / empty)
- Respects `prefers-reduced-motion`

## What it won't do

- Add one-off colors, fonts, or spacings outside the system
- Build a component that duplicates an existing one with minor variations
- Skip dark/light variants
- Animate decoratively

→ [System prompt](../system-prompts/ux-engineer-prompt.md)
