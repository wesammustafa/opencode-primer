// .opencode/plugins/protect-secrets.js
//
// Block any tool call that would read, write, or shell-touch a sensitive path
// (`.env*`, `secrets/`, `credentials*`, common SSH key files). Belt-and-braces
// on top of `external_directory: deny` and gitignore — never your only line
// of defense, but a useful one.

const SENSITIVE = /(^|[\s\/"'=])(\.env(\.[^\s]*)?|secrets|credentials|id_rsa|id_ed25519|\.npmrc|\.pypirc)(\b|\/)/i;

// Pull the most likely path/command field out of a tool's arguments.
// `read`/`edit`/`write` use `filePath`; `bash` uses `command`; others vary.
function targetFromArgs(args) {
  if (!args || typeof args !== "object") return "";
  return (
    args.filePath ??
    args.path ??
    args.file_path ??
    args.target ??
    args.command ?? // bash: scan the command line itself
    ""
  );
}

export const ProtectSecrets = async () => {
  return {
    // `tool.execute.before` is a top-level hook with an (input, output) signature.
    // `input.tool` is the tool name; `output.args` holds its (mutable) arguments.
    // Throwing here aborts the tool call before it runs.
    "tool.execute.before": async (input, output) => {
      const candidate = targetFromArgs(output?.args);
      if (candidate && SENSITIVE.test(String(candidate))) {
        throw new Error(
          `[protect-secrets] blocked ${input.tool} on sensitive path: ${candidate}`
        );
      }
    },
  };
};
