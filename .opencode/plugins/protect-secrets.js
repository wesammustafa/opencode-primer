// .opencode/plugins/protect-secrets.js
//
// Block any tool call that would read, write, or shell-touch a sensitive path
// (`.env*`, `secrets/`, `credentials*`, common SSH key files). Belt-and-braces
// on top of `external_directory: deny` and gitignore — never your only line
// of defense, but a useful one.

const SENSITIVE = /(^|\/)(\.env(\..*)?|secrets|credentials|id_rsa|id_ed25519|\.npmrc|\.pypirc)(\b|\/)/i;

function pathFromInput(toolName, input) {
  if (!input || typeof input !== "object") return "";
  return (
    input.path ??
    input.file_path ??
    input.filePath ??
    input.target ??
    input.command ?? // for bash tool, scan the command line itself
    ""
  );
}

export const ProtectSecrets = async () => {
  return {
    event: async ({ event }) => {
      if (event?.type !== "tool.execute.before") return;

      const candidate = pathFromInput(event.tool, event.input);
      if (candidate && SENSITIVE.test(String(candidate))) {
        throw new Error(
          `[protect-secrets] blocked ${event.tool} on sensitive path: ${candidate}`
        );
      }
    },
  };
};

export default ProtectSecrets;
