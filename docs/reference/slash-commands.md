# Slash Commands Reference

> Every slash command OpenCode ships in the TUI. Aliases are noted in parentheses.

## Session

| Command | Aliases | What it does |
|---|---|---|
| `/new` | `/clear` | Start a new session |
| `/sessions` | `/resume`, `/continue` | List and switch between sessions |
| `/compact` | `/summarize` | Compact the current session to free up context |
| `/share` | — | Generate a public link (`opncd.ai/s/<id>`); also configurable via `share` in `opencode.json` (`manual` \| `auto` \| `disabled`) |
| `/unshare` | — | Revoke the public link |
| `/export` | — | Export the conversation to Markdown |

## Provider & model

| Command | What it does |
|---|---|
| `/connect` | Add a provider — interactive picker |
| `/models` | Browse and switch models |

## Customization

| Command | What it does |
|---|---|
| `/themes` | Switch theme — interactive picker |
| `/editor` | Open `$EDITOR` to compose a long prompt |
| `/details` | Toggle visibility of tool execution details |
| `/thinking` | Toggle visibility of thinking/reasoning blocks |

## Repo & docs

| Command | What it does |
|---|---|
| `/init` | Guided generation of `AGENTS.md` |
| `/help` | Show the help dialog |

## Edits

| Command | What it does |
|---|---|
| `/undo` | Undo the last message |
| `/redo` | Redo a previously undone message |

## Exit

| Command | Aliases | What it does |
|---|---|---|
| `/exit` | `/quit`, `/q` | Exit OpenCode |

---

## Custom slash commands

Any markdown file in `.opencode/commands/<name>.md` (or `~/.config/opencode/commands/`) creates a `/<name>` slash command. See [`../commands.md`](../commands.md) for the file format.

> 📚 Source: [opencode.ai/docs/tui](https://opencode.ai/docs/tui). Built-in command set may evolve — check the docs for the current set.
