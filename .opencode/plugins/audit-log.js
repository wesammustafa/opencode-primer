// .opencode/plugins/audit-log.js
//
// Append a JSONL record of every completed tool call to .opencode/audit.jsonl.
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
    // `tool.execute.after` is a top-level hook with an (input, output) signature,
    // fired once a tool call completes. `input.tool`/`input.args` describe the
    // call; `output.title` is OpenCode's short summary of the result.
    "tool.execute.after": async (input, output) => {
      const record = {
        ts: new Date().toISOString(),
        tool: input.tool,
        // Capture argument keys only — full args can be huge (file content, diffs)
        arg_keys: input.args ? Object.keys(input.args) : [],
        title: output?.title,
      };

      await appendFile(logPath, JSON.stringify(record) + "\n");
    },
  };
};
