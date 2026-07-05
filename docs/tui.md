# TUI Mastery

> The terminal UI is where you'll spend most of your time. This page goes deeper than the README's TUI section.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [agent: build]  session: "fix-auth-bug"           tokens   │  ← top bar
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Conversation (scrollable)                                 │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  > prompt input                                             │  ← input box
└─────────────────────────────────────────────────────────────┘
```

Use the **leader key** (default `ctrl+x`) for session-level actions, and readline shortcuts inside the input box.

## Full keybind reference

### Leader chords (default leader: `ctrl+x`)

| Binding | Action |
|---|---|
| `ctrl+x n` | New session |
| `ctrl+x l` | List sessions |
| `ctrl+x g` | Timeline view |
| `ctrl+x c` | Compact (summarize) session |
| `ctrl+x e` | Open `$EDITOR` to compose a long prompt |
| `ctrl+x m` | Browse models |
| `ctrl+x t` | Switch theme |
| `ctrl+x u` / `ctrl+x r` | Undo / Redo |
| `ctrl+x b` | Toggle sidebar |
| `ctrl+x y` | Copy messages |
| `ctrl+x q` | Quit |
| `ctrl+p` | Command palette |

### Top-level

| Key | Action |
|---|---|
| `Tab` | Cycle primary agents (`build` ↔ `plan` ↔ custom primaries) |
| `shift+tab` | Cycle primary agents in reverse |
| `Esc` | Cancel / dismiss |
| `ctrl+c` / `ctrl+x q` | Exit |

> 🆕 v1.17.12 added **yolo mode** — auto-approve permission prompts from within the TUI. See the [permissions reference](reference/permissions.md) before turning it on.

### Inside the prompt box (readline / emacs-style)

| Key | Action |
|---|---|
| `ctrl+a` / `ctrl+e` | Beginning / end of line |
| `ctrl+k` | Delete to end of line |
| `ctrl+u` | Delete to beginning of line |
| `ctrl+r` | Rename current session |
| `ctrl+d` | Delete current session *(when prompt is empty)* |

## Prompt prefixes

### `@<path>` — attach files

Fuzzy-search the project and attach matched file content to the prompt. Multiple `@`s work in one message.

```text
review @src/api/auth.ts and @src/api/auth.test.ts for missing edge cases
```

### `!<command>` — run shell, attach output

```text
!git diff main...HEAD
based on this diff, write a PR description
```

The command runs in the project's working directory.

### `use <mcp-server>` — invoke an MCP tool

```text
use playwright    open https://example.com and take a screenshot
```

## Slash commands (built-in)

Reference table — full list also lives in [`reference/slash-commands.md`](reference/slash-commands.md).

| Command | Purpose |
|---|---|
| `/init` | Generate or update `AGENTS.md` |
| `/help` | Show help dialog |
| `/new` *(alias `/clear`)* | New session |
| `/sessions` *(aliases `/resume`, `/continue`)* | List & switch sessions |
| `/models` | Browse models |
| `/connect` | Add a provider |
| `/themes` | Switch theme |
| `/compact` *(alias `/summarize`)* | Compact session |
| `/share` · `/unshare` | Public link control |
| `/export` | Export to markdown |
| `/undo` · `/redo` | Walk edit history |
| `/editor` | Open `$EDITOR` |
| `/details` | Toggle tool execution detail visibility |
| `/thinking` | Toggle thinking/reasoning blocks |
| `/exit` *(aliases `/quit`, `/q`)* | Exit |

## Customizing keybinds

Drop a `tui.json` next to your `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "tokyonight",
  "leader_timeout": 2000,
  "scroll_speed": 3,
  "diff_style": "auto",
  "mouse": true,
  "keybinds": {
    "command_list": "ctrl+p",
    "messages_copy": ["<leader>y", "ctrl+shift+c"],
    "input_paste": { "key": "ctrl+v", "preventDefault": false }
  },
  "attention": {
    "enabled": true,
    "notifications": true,
    "sound": true,
    "volume": 0.4
  }
}
```

Set a binding to `"none"` or `false` to disable. Arrays bind multiple shortcuts to the same action.

Other top-level keys worth knowing: `diff_style` (`"auto"` adapts to terminal width, `"stacked"` forces single-column diffs), `mouse` (capture toggle, default `true`), and `scroll_acceleration` (macOS-style smooth scroll that overrides `scroll_speed`). The `attention` block also takes `sound_pack` (default `"opencode.default"`) and a `sounds` map for per-event overrides (`default`, `question`, `permission`, `error`, `done`, `subagent_done`).

## Themes

Set the theme in `tui.json` or with `/themes` interactively.

Built-in themes:

`system` · `tokyonight` · `everforest` · `ayu` · `catppuccin` · `catppuccin-macchiato` · `gruvbox` · `kanagawa` · `nord` · `matrix` · `one-dark`

Custom themes:

- Project: `.opencode/themes/<name>.json`
- Global: `~/.config/opencode/themes/<name>.json`

A custom theme is a JSON file mapping color slots to hex (`"#1a1b26"`), ANSI numbers (0–255), or `"none"` (terminal default). Truecolor terminals required.

## Sessions

Sessions are conversation snapshots. They persist across restarts and can be:

- **listed** — `/sessions` or `ctrl+x l`
- **resumed** — pick from the list, or `opencode --continue` on the CLI
- **shared** — `/share` produces a public `opncd.ai/s/<id>` URL
- **exported** — `/export` writes Markdown; `opencode export <id>` writes JSON
- **compacted** — `/compact` summarizes the conversation to free up context window

> 💡 **Pro tip:** Use `/compact` aggressively for long-running sessions. The summary preserves intent while dropping verbose tool output that's no longer needed.

## Image and file attachment

You can drag files (including images, for multimodal models) into the TUI. Image limits live under `attachment.image` in `opencode.json`:

```json
{
  "attachment": {
    "image": {
      "auto_resize": true,
      "max_width": 2048,
      "max_height": 2048,
      "max_base64_bytes": 5242880
    }
  }
}
```

## Performance & long sessions

| Symptom | Fix |
|---|---|
| TUI feels sluggish on a large repo | Add ignore patterns under `watcher.ignore` in config |
| Context window filling fast | `/compact` or pick a model with a bigger context |
| Tools spamming output | `/details` to hide tool execution chrome |
| Costs rising | `opencode stats --days 7 --models` to find the offender |

> 📚 Full TUI reference: [opencode.ai/docs/tui](https://opencode.ai/docs/tui) · keybinds at [opencode.ai/docs/keybinds](https://opencode.ai/docs/keybinds).

---

*Last reviewed: 2026-07-05.*
