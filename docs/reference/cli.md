# CLI Reference

> Complete command-line reference for OpenCode. All commands run from a terminal.

```
opencode [command] [flags]
```

## Default behavior

Running `opencode` with no command starts the TUI in the current directory. This is the same as `opencode tui`.

## Global flags

| Flag | Purpose |
|---|---|
| `--help`, `-h` | Display help |
| `--version`, `-v` | Print version |
| `--print-logs` | Print logs to stderr |
| `--log-level <level>` | `DEBUG` \| `INFO` \| `WARN` \| `ERROR` |
| `--pure` | Run without loading external plugins |

---

## `opencode` / `opencode tui`

Start the terminal UI.

```bash
opencode [project] [flags]
```

| Flag | Purpose |
|---|---|
| `--continue`, `-c` | Continue the last session |
| `--session <id>`, `-s` | Continue a specific session |
| `--fork` | Fork the session when continuing |
| `--prompt <text>` | Pre-fill prompt |
| `--model <id>`, `-m` | Set model (`provider/model-id`) |
| `--agent <name>` | Start with a specific agent |
| `--port`, `--hostname` | Bind the underlying server |
| `--mdns`, `--mdns-domain` | mDNS discovery |
| `--cors <origins>` | Additional browser origins for CORS |

---

## `opencode run`

Run OpenCode non-interactively with a prompt.

```bash
opencode run "summarize the last 5 commits"
opencode run --format json "list every TODO with file and line"
opencode run --agent plan --model anthropic/claude-haiku-4-5 "audit src/ for missing input validation"
```

| Flag | Purpose |
|---|---|
| `--continue`, `-c` | Continue the last session |
| `--session <id>`, `-s` | Continue a specific session |
| `--fork` | Fork the session when continuing |
| `--share` | Share the session |
| `--model <id>`, `-m` | Model in `provider/model-id` form |
| `--agent <name>` | Agent to use |
| `--file <path>`, `-f` | Attach file(s) to the message |
| `--format <default\|json>` | Output format |
| `--title <text>` | Title for the session |
| `--attach <url>` | Attach to a running OpenCode server |
| `--password`, `-p` · `--username`, `-u` | Basic auth for the attached server |
| `--dir <path>` | Directory to run in |
| `--port` | Port for the local server backing this run |
| `--variant <name>` | Model variant |
| `--thinking` | Show thinking blocks |
| `--replay` | Interactively replay the run as it streams *(v1.16+)* |
| `--replay-limit <n>` | How much recent history to show when replaying |
| `--command <name>` | Run a saved command |
| `--dangerously-skip-permissions` | Auto-approve everything that isn't explicitly denied. **CI only.** |

---

## `opencode auth`

Manage provider credentials.

```bash
opencode auth login [--provider <id>] [--method <label>]
opencode auth list     # alias: ls
opencode auth logout
```

---

## `opencode agent`

Manage agents.

```bash
opencode agent list
opencode agent create [flags]
```

`create` flags:

| Flag | Purpose |
|---|---|
| `--path <dir>` | Directory for the new agent file |
| `--description <text>` | Agent description |
| `--mode <primary\|subagent\|all>` | Agent mode |
| `--permissions <list>` | Comma-separated allowed permissions |
| `--model <id>`, `-m` | Model to use |

---

## `opencode mcp`

Manage MCP servers.

```bash
opencode mcp add                  # interactive add
opencode mcp list                 # alias: ls
opencode mcp auth <name>          # complete OAuth
opencode mcp logout <name>
opencode mcp debug <name>
```

---

## `opencode models`

List available models.

```bash
opencode models [provider]
```

| Flag | Purpose |
|---|---|
| `--refresh` | Re-fetch from models.dev |
| `--verbose` | Show metadata |

---

## `opencode session`

Manage sessions.

```bash
opencode session list [--max-count <n>] [--format <table\|json>]
opencode session delete <sessionID>
```

---

## `opencode stats`

Token usage and cost report.

```bash
opencode stats [flags]
```

| Flag | Purpose |
|---|---|
| `--days <n>` | Window in days |
| `--tools <n>` | Number of tools to show |
| `--models` | Show per-model breakdown |
| `--project <name>` | Filter by project |

---

## `opencode export` / `opencode import`

Move sessions in and out of OpenCode.

```bash
opencode export <sessionID> [--sanitize] > session.json
opencode import session.json
opencode import https://opncd.ai/s/<share-id>
```

---

## `opencode serve` / `opencode web`

Run OpenCode as a headless server (`serve`) or with a web UI (`web`).

```bash
opencode serve --port 4096 --hostname 0.0.0.0
opencode web   --port 4096
```

| Flag | Purpose |
|---|---|
| `--port` | Listening port |
| `--hostname` | Bind address |
| `--mdns`, `--mdns-domain` | mDNS |
| `--cors <origins>` | Browser CORS origins |

---

## `opencode attach`

Attach a TUI to an already-running OpenCode server.

```bash
opencode attach http://localhost:4096
```

| Flag | Purpose |
|---|---|
| `--dir <path>` | Working dir to start in |
| `--continue`, `-c` · `--session <id>` · `--fork` | Session controls |
| `--username`, `-u` · `--password`, `-p` | Basic auth |

---

## `opencode acp`

Start an Agent Client Protocol server (for editor integrations).

```bash
opencode acp --cwd . --port 4099
```

---

## `opencode plugin`

Install or update a plugin.

```bash
opencode plugin <module>      # alias: opencode plug
opencode plugin --global opencode-wakatime
opencode plugin --force opencode-helicone-session@1.2.3
```

| Flag | Purpose |
|---|---|
| `--global`, `-g` | Install in global config |
| `--force`, `-f` | Replace existing plugin version |

---

## `opencode github`

Manage the GitHub agent integration.

```bash
opencode github install          # add workflow file to repo
opencode github run [--event <name>] [--token <token>]
```

---

## `opencode pr`

Check out a GitHub PR and start OpenCode in that workspace.

```bash
opencode pr 123
```

---

## `opencode db`

Database tools (advanced).

```bash
opencode db path                  # print the database path
opencode db "<query>" [--format json|tsv]
```

---

## `opencode debug`

Various debugging utilities. Run `opencode debug --help` for the live subcommand list.

---

## `opencode upgrade`

Update OpenCode to the latest or a specific version.

```bash
opencode upgrade
opencode upgrade v1.16.0
opencode upgrade --method brew    # force the install method
```

| Flag | Purpose |
|---|---|
| `--method <m>` | `curl` \| `npm` \| `pnpm` \| `bun` \| `brew` |

---

## `opencode uninstall`

Remove OpenCode and (optionally) all related data.

```bash
opencode uninstall [--keep-config] [--keep-data] [--dry-run] [--force]
```

| Flag | Purpose |
|---|---|
| `--keep-config`, `-c` | Keep configuration files |
| `--keep-data`, `-d` | Keep session data and snapshots |
| `--dry-run` | Print what would be removed |
| `--force`, `-f` | Skip confirmation |

> 📚 Full live CLI reference: [opencode.ai/docs/cli](https://opencode.ai/docs/cli).
