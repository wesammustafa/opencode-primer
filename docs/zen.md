# OpenCode Zen

> **Mental model:** Zen is OpenCode's curated, pay-as-you-go AI gateway. The OpenCode team tests and benchmarks models for coding-agent workloads and ships a focused lineup with consistent pricing.
>
> *(Beta — verified against [opencode.ai/docs/zen](https://opencode.ai/docs/zen) on 2026-07-05. Pricing and model availability change frequently; check the docs before quoting numbers.)*

## When to reach for Zen vs. direct providers

| Reach for Zen when… | Reach for direct providers when… |
|---|---|
| You want to try many models without juggling N API keys | You already pay for Anthropic/OpenAI/etc. and want to use existing credits |
| You want curated, benchmark-vetted models | You need a model Zen doesn't carry |
| You want billing in one place for a team | You're running fully local (Ollama, LM Studio) |
| You want a free tier to learn on | You want zero third-party intermediation |

Zen is **opt-in**. OpenCode itself is provider-agnostic; you can mix Zen models with direct-provider models in the same config.

## Zen vs. OpenCode Go

> **Mental model:** Zen is a pay-as-you-go, per-token gateway across the full lineup. [OpenCode Go](https://opencode.ai/docs/go/) is a flat-rate subscription to a curated set of hosted open models.

| | Zen | OpenCode Go |
|---|---|---|
| Billing | Per-token, pay-as-you-go | $10/month flat ($5 first month) |
| Models | Full curated lineup (Anthropic, OpenAI, Google, open models, …) | Hosted open models |
| Limits | Your balance / workspace caps | $12 per 5 hours, $30/week, $60/month equivalent |
| After limits | — | Falls back to your Zen balance |

Reach for Go when you want a predictable monthly bill on open models; reach for Zen when you want per-token access to everything. Details: [opencode.ai/docs/go](https://opencode.ai/docs/go/).

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
  "model": "opencode/claude-sonnet-5"
}
```

> Slug format: keep the dots in the upstream model name where they exist (`gpt-5.5`, `gemini-3.1-pro`, `qwen3.7-plus`, `minimax-m2.7`); Anthropic IDs use hyphens (`claude-opus-4-8`, `claude-sonnet-4-6`).

## Available models

Selected lineup below. **For the full lineup (latest pricing, cached-read/write rates, and endpoint URLs), see [opencode.ai/docs/zen](https://opencode.ai/docs/zen).**

### Anthropic family

| Model ID | Input / Output (per MTok) | Notes |
|---|---|---|
| `opencode/claude-fable-5` | $10 / $50 | New flagship — hardest reasoning, complex refactors |
| `opencode/claude-opus-4-8` | $5 / $25 | Previous flagship — still strong on multi-file work |
| `opencode/claude-sonnet-5` | $2 / $10 | Balanced workhorse — cheaper *and* newer than Sonnet 4.6; adaptive thinking since v1.17.12 |
| `opencode/claude-haiku-4-5` | $1 / $5 | Cheap, fast — title generation, simple Q&A |

Older versions (`claude-opus-4-7`, `claude-opus-4-6`, `claude-opus-4-5`, `claude-sonnet-4-6`, `claude-sonnet-4-5`) are also available — see the full list.

### OpenAI family

| Model ID | Input / Output (per MTok) | Notes |
|---|---|---|
| `opencode/gpt-5.5` *(≤272K)* | $5 / $30 | Long-context flagship |
| `opencode/gpt-5.5` *(>272K)* | $10 / $45 | Same model, beyond-window pricing |
| `opencode/gpt-5.5-pro` | $30 / $180 | Pro variant |
| `opencode/gpt-5.4` *(≤272K)* | $2.50 / $15 | Mid-tier frontier |
| `opencode/gpt-5.4` *(>272K)* | $5 / $22.50 | Same model, beyond-window pricing |
| `opencode/gpt-5.4-pro` | $30 / $180 | Pro variant of 5.4 |
| `opencode/gpt-5.4-mini` | $0.75 / $4.50 | Cost-efficient frontier |
| `opencode/gpt-5.4-nano` | $0.20 / $1.25 | Cheap, fast, narrow tasks |
| `opencode/gpt-5.3-codex` | $1.75 / $14 | Codex-tuned variant |
| `opencode/gpt-5.2` | $1.75 / $14 | Base 5.2 |

GPT 5.1 / 5, `gpt-5.3-codex-spark`, and the `gpt-5.1-codex` family (+max, +mini) are also available — see the [live list](https://opencode.ai/docs/zen) for current pricing and note the sunset dates below.

### Other

| Model ID | Input / Output (per MTok) | Notes |
|---|---|---|
| `opencode/gemini-3.5-flash` | $1.50 / $9 | Newest fast Gemini |
| `opencode/gemini-3.1-pro` *(≤200K)* | $2 / $12 | Multimodal flagship |
| `opencode/gemini-3-flash` | $0.50 / $3 | Cheaper Gemini variant |
| `opencode/qwen3.7-max` | $2.50 / $7.50 | Qwen flagship |
| `opencode/qwen3.7-plus` | $0.40 / $1.60 | Budget-friendly heavy lifting |
| `opencode/deepseek-v4-pro` | $1.74 / $3.48 | DeepSeek flagship |
| `opencode/deepseek-v4-flash` | $0.14 / $0.28 | Rock-bottom pricing |
| `opencode/kimi-k2.7-code` | $0.95 / $4 | Moonshot coding model, current |
| `opencode/kimi-k2.6` | $0.95 / $4 | Moonshot lineup |
| `opencode/glm-5.2` | $1.40 / $4.40 | Zhipu current |
| `opencode/glm-5.1` | $1.40 / $4.40 | Zhipu lineup |
| `opencode/minimax-m3` | $0.30 / $1.20 | MiniMax current |
| `opencode/minimax-m2.7` | $0.30 / $1.20 | Previous MiniMax |
| `opencode/grok-build-0.1` | $1 / $2 | xAI coding model |

### Free tier (rotating, time-limited)

For community feedback during model rollout:

- `opencode/big-pickle` *(stealth model)*
- `opencode/deepseek-v4-flash-free`
- `opencode/mimo-v2.5-free`
- `opencode/north-mini-code-free` *(new)*
- `opencode/nemotron-3-ultra-free`

Great for learning OpenCode without burning a budget. The list rotates — a free model can disappear, become paid, or be replaced at any time; check `/models` for what's live today.

### Deprecations & sunsets

Deprecated Zen models keep working until their sunset date:

| Model(s) | Sunset date |
|---|---|
| `glm-5` | 2026-05-14 *(past)* |
| `claude-sonnet-4` | 2026-06-15 *(past)* |
| `gpt-5.2-codex`, `gpt-5.1-codex` (+max, +mini), `gpt-5-codex` | 2026-07-23 |
| `claude-opus-4-1` | 2026-08-05 |
| `minimax-m2.5`, `kimi-k2.5` | 2026-08-05 |

## Billing

- **Auto-reload:** default $20 top-up when balance falls under $5. Configurable on the dashboard; can be disabled.
- **Workspace limits:** monthly cap for a team and per-member spending limits.
- **BYOK:** bring your own Anthropic / OpenAI keys and Zen routes those provider calls through your credentials while still letting you use other Zen-hosted models.
- **Transaction fees:** credit card fees pass through at cost (per docs: 4.4% + $0.30 per transaction).
- **Title model:** sessions show small charges from a low-cost small model — that's what OpenCode uses to generate session titles automatically.

## Patterns

### Cheap explorer / strong executor

Different agents, different models. A cheap model handles read-heavy subagents; a strong model does the editing.

```json
{
  "model": "opencode/claude-sonnet-5",
  "agent": {
    "explore": { "model": "opencode/qwen3.7-plus" },
    "scout":   { "model": "opencode/qwen3.7-plus" },
    "plan":    { "model": "opencode/claude-haiku-4-5" },
    "build":   { "model": "opencode/claude-sonnet-5" }
  }
}
```

### Plan-with-Opus / execute-with-Sonnet

For complex tasks, plan with the smartest model, then hand the atomic plan to a cheaper executor.

```json
{
  "agent": {
    "plan":  { "model": "opencode/claude-opus-4-8" },
    "build": { "model": "opencode/claude-sonnet-5" }
  }
}
```

### BYOK + Zen extras

Reuse Anthropic credits while still having one-key access to GPT and Gemini.

```json
{
  "model": "anthropic/claude-sonnet-5",
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

*Last reviewed: 2026-07-05 · Canonical source: [opencode.ai/docs](https://opencode.ai/docs/).*
