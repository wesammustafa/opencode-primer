# Images/

Diagrams, screenshots, and visual assets for this guide.

## Contribution rules

- **No copyrighted material** without an explicit license. Don't drop the OpenCode logo here — we're not affiliated with the OpenCode team.
- **Prefer SVG over PNG** for diagrams. They scale and are diff-friendly.
- **Reference inline** from the relevant doc:

  ```markdown
  ![Alt text describing the image](Images/your-image.svg)
  ```

  Paths are relative to the *referencing* file — `Images/your-image.svg` works from the root `README.md`, but a doc under `docs/` needs `../Images/your-image.svg`.

- **Include alt text.** Always.
- **Mermaid before raster.** When a concept can be expressed as a flowchart or sequence diagram, prefer Mermaid (renders natively on GitHub) over an exported PNG. See [`docs/mcp.md`](../docs/mcp.md) for an example.

## What lives here

Currently empty — contributions welcome. See [`CONTRIBUTING.md`](../CONTRIBUTING.md).
