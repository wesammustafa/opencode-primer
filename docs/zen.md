# OpenCode Zen

> **Mental model:** Zen is OpenCode's curated, pay-as-you-go AI gateway. The OpenCode team tests and benchmarks models for coding-agent workloads and ships a focused lineup with consistent pricing.
>
> *(Beta — verified against [opencode.ai/docs/zen](https://opencode.ai/docs/zen) on 2026-05-18. Pricing and model availability change frequently; check the docs before quoting numbers.)*

## When to reach for Zen vs. direct providers

| Reach for Zen when… | Reach for direct providers when… |
|---|---|
| You want to try many models without juggling N API keys | You already pay for Anthropic/OpenAI/etc. and want to use existing credits |
| You want curated, benchmark-vetted models | You need a model Zen doesn't carry |
| You want billing in one place for a team | You're running fully local (Ollama, LM Studio) |
| You want a free tier to learn on | You want zero third-party intermediation |

Zen is **opt-in**. OpenCode itself is provider-agnostic; you can mix Zen models with direct-provider models in the same config.

## Setup

```bash
# 1. Create a Zen account
# https://opencode.ai/auth

# 2. Add billing details (auto-reload: $20 top-up when balance falls below $5)
# 3. Copy your API key

# 4. Sign in from OpenCode
opencode auth login         # pick "OpenCode Zen", paste key

# Or from inside the TUI:
/connect                    # → OpenCode Zen → paste

# 5. Browse the lineup
/models
```

In `opencode.json`, reference a Zen model with the `opencode/` prefix:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode/claude-sonnet-4-6"
}
```

> Slug format: keep the dots in the upstream model name where they exist (`gpt-5.5`, `gemini-3.1-pro`, `qwen3.6-plus`, `minimax-m2.5`); Anthropic IDs use hyphens (`claude-opus-4-7`, `claude-sonnet-4-6`).

## Available models

Selected lineup below. **For the full list (40+ entries, latest pricing, cached-read/write rates, and endpoint URLs), see [opencode.ai/docs/zen](https://opencode.ai/docs/zen).**

### Anthropic family

| Model ID | Input / Output (per MTok) | Notes |
|---|---|---|
| `opencode/claude-opus-4-7` | $5 / $25 | Flagship reasoning — complex refactors, multi-file work |
| `opencode/claude-sonnet-4-6` | $3 / $15 | Workhorse — most coding work lives here |
| `opencode/claude-haiku-4-5` | $1 / $5 | Cheap, fast — title generation, simple Q&A |

Older versions (`claude-opus-4-6`, `claude-opus-4-5`, `claude-sonnet-4-5`, `claude-sonnet-4`, `claude-3-5-haiku`) are also available — see the full list.

### OpenAI family

| Model ID | Input / Output (per MTok) | Notes |
|---|---|---|
| `opencode/gpt-5.5` *(≤272K)* | $5 / $30 | Long-context flagship |
| `opencode/gpt-5.5` *(>272K)* | $10 / $45 | Same model, beyond-window pricing |
| `opencode/gpt-5.5-pro` | $30 / $180 | Pro variant |
| `opencode/gpt-5.4-mini` | $0.75 / $4.50 | Cost-efficient frontier |
| `opencode/gpt-5.4-nano` | $0.20 / $1.25 | Cheap, fast, narrow tasks |
| `opencode/gpt-5.3-codex` · `opencode/gpt-5.2-codex` | $1.75 / $14 | Codex-tuned variants |

GPT 5.1 / 5 / 5-codex / 5-nano are also available with their own pricing.

### Other

| Model ID | Input / Output (per MTok) | Notes |
|---|---|---|
| `opencode/gemini-3.1-pro` *(≤200K)* | $2 / $12 | Multimodal flagship |
| `opencode/gemini-3-flash` | $0.50 / $3 | Fast Gemini variant |
| `opencode/qwen3.6-plus` | $0.50 / $3 | Budget-friendly heavy lifting |
| `opencode/qwen3.5-plus` | $0.20 / $1.20 | Even cheaper |
| `opencode/kimi-k2.6` | $0.95 / $4 | Moonshot lineup |
| `opencode/glm-5.1` | $1.40 / $4.40 | Zhipu lineup |
| `opencode/minimax-m2.7` | $0.30 / $1.20 | MiniMax current |

### Free tier (rotating, time-limited)

For community feedback during model rollout:

- `opencode/deepseek-v4-flash-free`
- `opencode/minimax-m2.5-free`
- `opencode/nemotron-3-super-free`
- `opencode/big-pickle` *(stealth model)*

Great for learning OpenCode without burning a budget.

## Billing

- **Auto-reload:** default $20 top-up when balance falls under $5. Configurable on the dashboard; can be disabled.
- **Workspace limits:** monthly cap for a team and per-member spending limits.
- **BYOK:** bring your own Anthropic / OpenAI keys and Zen routes those provider calls through your credentials while still letting you use other Zen-hosted models.
- **Transaction fees:** credit card fees pass through at cost (per docs: 4.4% + $0.30 per transaction).
- **Title model:** sessions show `claude-haiku-3-5` charges — that's the low-cost model OpenCode uses to generate session titles automatically.

## Patterns

### Cheap explorer / strong executor

Different agents, different models. A cheap model handles read-heavy subagents; a strong model does the editing.

```json
{
  "model": "opencode/claude-sonnet-4-6",
  "agent": {
    "explore": { "model": "opencode/qwen3.6-plus" },
    "scout":   { "model": "opencode/qwen3.6-plus" },
    "plan":    { "model": "opencode/claude-haiku-4-5" },
    "build":   { "model": "opencode/claude-sonnet-4-6" }
  }
}
```

### Plan-with-Opus / execute-with-Sonnet

For complex tasks, plan with the smartest model, then hand the atomic plan to a cheaper executor.

```json
{
  "agent": {
    "plan":  { "model": "opencode/claude-opus-4-7" },
    "build": { "model": "opencode/claude-sonnet-4-6" }
  }
}
```

### BYOK + Zen extras

Reuse Anthropic credits while still having one-key access to GPT and Gemini.

```json
{
  "model": "anthropic/claude-sonnet-4-5",
  "provider": {
    "anthropic": { "options": { "apiKey": "{env:ANTHROPIC_API_KEY}" } }
  },
  "agent": {
    "vision-helper": { "model": "opencode/gemini-3.1-pro" }
  }
}
```

## API access

You can also call Zen models directly via OpenCode's HTTP endpoints — handy if you're building scripts outside OpenCode itself:

| Family | Endpoint pattern |
|---|---|
| OpenAI | `https://opencode.ai/zen/v1/responses` |
| Anthropic | `https://opencode.ai/zen/v1/messages` |
| Google | `https://opencode.ai/zen/v1/models/<model-id>` |
| OpenAI-compatible (Qwen, Kimi, GLM, etc.) | `https://opencode.ai/zen/v1/chat/completions` |
| Full models list | `https://opencode.ai/zen/v1/models` |

Use the matching AI SDK package (`@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/openai-compatible`).

## FAQ

**Is my code sent anywhere I don't control?**
Zen is a gateway between OpenCode and the upstream provider. The privacy posture depends on the underlying provider plus Zen's own policy for billing/routing. The Zen docs page has the current statement.

**Are free models reliable for production?**
No — the docs call them "available for a limited time" while the team collects feedback. Build with the assumption that any given free model could disappear, become paid, or be replaced. They're for learning, experimentation, and feedback.

**Can I cancel auto-reload?**
Yes — turn it off in the dashboard, or set a monthly hard cap.

**How does Zen compare to OpenRouter?**
Both are gateways. Zen is **curated** — the OpenCode team picks and tunes models for coding-agent loops. OpenRouter is broader but unopinionated. OpenCode supports both.

---

*Last reviewed: 2026-05-18 · Canonical source: [opencode.ai/docs](https://opencode.ai/docs/).*
