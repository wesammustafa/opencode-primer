# `.opencode/plugins/`

Working examples of OpenCode plugins. Drop-in to any project — pure JS, no npm dependencies.

| Plugin | What it does |
|---|---|
| [`protect-secrets.js`](protect-secrets.js) | Blocks any tool call (read/write/bash) touching `.env*`, `secrets/`, `credentials*`, SSH keys, `.npmrc`, `.pypirc`. |
| [`audit-log.js`](audit-log.js) | Appends a one-line JSON record of every successful tool call to `.opencode/audit.jsonl`. |

## How they load

OpenCode auto-loads every `.js` / `.ts` file in `.opencode/plugins/` at session start. No registration step.

```bash
opencode                       # loads both plugins automatically
opencode --pure                # skip all plugins for one run
```

## Audit how this plugin folder fires

```bash
tail -f .opencode/audit.jsonl    # watch tool calls live
```

Sample line:

```json
{"ts":"2026-05-18T19:30:12.451Z","tool":"edit","ok":true,"input_keys":["file_path","old_string","new_string"]}
```

## Disabling temporarily

Three options:

1. Move the plugin file out of `.opencode/plugins/`.
2. Comment out the `export default` line.
3. Gate the body of the plugin on an env var:

   ```js
   if (process.env.OPENCODE_DISABLE_AUDIT_LOG) return {};
   ```

## Writing your own

See [`docs/plugins.md`](../../docs/plugins.md) for the full API, event list, and more patterns (auto-format on save, idle notifications, etc.).
