# Plugins

> **Mental model:** Plugins are OpenCode's **event-driven extension surface** — small JavaScript or TypeScript modules that subscribe to lifecycle events (tool calls, file edits, session state) and run code automatically. Think `husky` for your AI session.

## When to write a plugin

| Reach for a plugin when… | Skip plugins and use a command/skill if… |
|---|---|
| You want code to run **automatically** (no user prompt) | The trigger is "user types /something" |
| You're connecting to an external system (notifications, logging, telemetry) | You're shaping the prompt or output |
| You want to enforce policy (block writes to certain paths) | You want the agent to decide what to do |

## Where plugins live

Three locations:

| Location | Scope |
|---|---|
| `.opencode/plugins/<name>.{js,ts}` | Project |
| `~/.config/opencode/plugins/<name>.{js,ts}` | Global |
| `plugin: [...]` in `opencode.json` | NPM packages |

NPM-installed plugins:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "opencode-helicone-session",
    "opencode-wakatime",
    "@my-org/custom-plugin"
  ]
}
```

These install on first run via Bun and cache under `~/.cache/opencode/node_modules/`.

### Dependencies for local plugins

Local plugins can use npm packages. Drop a `package.json` next to them:

```json
{
  "dependencies": {
    "shescape": "^2.1.0",
    "node-notifier": "^10.0.1"
  }
}
```

Run `opencode plugin <module>` (or `opencode plug`) to add a plugin and let OpenCode update your config:

```bash
opencode plugin opencode-helicone-session
opencode plugin --global opencode-wakatime
```

## Plugin API

A plugin is a default-export async function returning an object of event handlers:

```javascript
// .opencode/plugins/notify-on-idle.js
export const NotifyOnIdle = async ({ project, client, $, directory, worktree }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await $`osascript -e 'display notification "Session done!" with title "opencode"'`;
      }
    },
  };
};
```

### Arguments

| Argument | What you get |
|---|---|
| `project` | Project metadata — name, root, language hints |
| `directory` | Current working directory string |
| `worktree` | Git worktree path (when applicable) |
| `client` | OpenCode SDK client — call back into OpenCode from inside the plugin |
| `$` | Bun shell — run commands; supports tagged-template syntax |

### Available events

Verified against the [Plugins doc](https://opencode.ai/docs/plugins):

| Category | Events |
|---|---|
| **Tools** | `tool.execute.before`, `tool.execute.after` |
| **Files** | `file.edited`, `file.watcher.updated` |
| **Sessions** | `session.created`, `session.updated`, `session.compacted`, `session.idle`, `session.status`, `session.error`, `session.diff`, `session.deleted` |
| **Messages** | `message.updated`, `message.removed`, `message.part.updated`, `message.part.removed` |
| **Commands** | `command.executed` |
| **Permissions** | `permission.asked`, `permission.replied` |
| **LSP** | `lsp.client.diagnostics`, `lsp.updated` |
| **Server / installation** | `server.connected`, `installation.updated` |
| **Shell** | `shell.env` |
| **Todo** | `todo.updated` |
| **TUI** | `tui.prompt.append`, `tui.command.execute`, `tui.toast.show` |

> 📚 Each event carries event-specific payload. Full reference: [opencode.ai/docs/plugins](https://opencode.ai/docs/plugins).

## Common patterns

### 1. Auto-format on save

Every time the agent edits a file, run the project formatter:

```javascript
// .opencode/plugins/autoformat.js
export const Autoformat = async ({ $ }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "file.edited") {
        const path = event.path;
        if (/\.(ts|tsx|js|jsx|json|md)$/.test(path)) {
          await $`pnpm prettier --write ${path}`.quiet();
        } else if (/\.py$/.test(path)) {
          await $`ruff format ${path}`.quiet();
        } else if (/\.go$/.test(path)) {
          await $`gofmt -w ${path}`.quiet();
        }
      }
    },
  };
};
```

### 2. Action audit log

Append every tool call to a JSONL log — paper trail for what the agent did.

```javascript
// .opencode/plugins/audit-log.js
import { appendFile } from "node:fs/promises";

export const AuditLog = async ({ directory }) => {
  const logPath = `${directory}/.opencode/audit.jsonl`;

  return {
    event: async ({ event }) => {
      if (event.type === "tool.execute.after") {
        await appendFile(
          logPath,
          JSON.stringify({
            ts: new Date().toISOString(),
            tool: event.tool,
            input: event.input,
            success: !event.error,
          }) + "\n"
        );
      }
    },
  };
};
```

### 3. Notify on long-running task completion

macOS notification when a session goes idle:

```javascript
export const NotifyOnIdle = async ({ $ }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await $`osascript -e 'display notification "OpenCode is idle" with title "opencode" sound name "Glass"'`.quiet();
      }
    },
  };
};
```

### 4. Block sensitive paths

Prevent any edits to `.env` files or `secrets/` directories:

```javascript
export const ProtectSecrets = async ({ client }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "tool.execute.before" && event.tool === "edit") {
        const path = event.input?.path ?? "";
        if (/\.env|secrets\//i.test(path)) {
          throw new Error(`Plugin blocked: ${path} is a protected path`);
        }
      }
    },
  };
};
```

## Loading order

Plugins load in this order (later ones can override earlier behavior):

1. NPM packages in the **global** `plugin` array
2. NPM packages in the **project** `plugin` array
3. **Global plugins** in `~/.config/opencode/plugins/`
4. **Project plugins** in `.opencode/plugins/`

## Security

> ⚠️ **Plugins run with your user permissions.** They can read, modify, delete any file you can, plus make network calls. Treat installation like running an unaudited shell script — read every third-party plugin before adding it.

Best practices:

- Pin plugin versions in `opencode.json` (`"opencode-foo@1.2.3"`).
- Audit `package.json` for transitive dependencies.
- Sandboxed plugins: run OpenCode in a container if you can't audit a plugin you need.
- Don't `eval` user-controlled strings in plugin code.
- Use absolute paths for shell commands so PATH manipulation can't redirect them.

## Debugging

```bash
opencode --log-level DEBUG --print-logs       # see plugin loading
opencode debug                                # debug subcommands
```

Plugin errors show up in the TUI; full traces appear in OpenCode's log (default at `~/.local/share/opencode/log/`, or stderr with `--print-logs`).

> 📚 Full Plugins guide and event reference: [opencode.ai/docs/plugins](https://opencode.ai/docs/plugins).
