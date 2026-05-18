// .opencode/plugins/audit-log.js
//
// Append a JSONL record of every successful tool call to .opencode/audit.jsonl.
// Useful as an after-the-fact paper trail of what the agent did this session.
//
// Toggle off by deleting this file or by gating with an env var:
//   if (process.env.OPENCODE_DISABLE_AUDIT_LOG) return {};

import { appendFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

export const AuditLog = async ({ directory }) => {
  const logPath = join(directory, ".opencode", "audit.jsonl");
  // Make sure .opencode/ exists in case this plugin runs in a fresh project
  await mkdir(dirname(logPath), { recursive: true });

  return {
    event: async ({ event }) => {
      if (event?.type !== "tool.execute.after") return;

      const record = {
        ts: new Date().toISOString(),
        tool: event.tool,
        ok: !event.error,
        // Capture small inputs only — full inputs can be huge (file content, diffs)
        input_keys: event.input ? Object.keys(event.input) : [],
        // Truncate long error messages
        error: event.error
          ? String(event.error).slice(0, 240)
          : undefined,
      };

      await appendFile(logPath, JSON.stringify(record) + "\n");
    },
  };
};

export default AuditLog;
