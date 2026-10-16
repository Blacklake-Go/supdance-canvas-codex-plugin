# @supdance/canvas-agent

The local HTTP and MCP bridge for the SupDance Canvas Codex plugin. This
package is built from source in the independent
`supdance-canvas-codex-plugin` repository and installed from a versioned npm
tarball.

Commands:

```bash
supdance-canvas-agent open --handoff
supdance-canvas-agent open
supdance-canvas-agent mcp
supdance-canvas-agent
```

`open --handoff` starts or reuses the Agent and returns a short-lived local
link for the Codex browser. `open` uses the system browser. `mcp` serves Codex
tools over stdio. The final command runs the local HTTP Agent in the foreground.
The Agent invokes the Codex CLI found on the host `PATH`; set `CODEX_CLI_PATH`
if Codex is installed outside that path.

Both processes use `~/.supdance-canvas/canvas-agent.json` and protocol 6.
Only `https://canvas.supdance.com` is permitted as a browser Origin. Ticketed
SSE is preferred; the `/events` route also supports the current site's legacy
EventSource query-token contract for backward compatibility. Other API routes
still require the token header. This package does not call or depend on
`@basketikun/canvas-agent` at runtime.

The source derives from basketikun's MIT-licensed Infinite Canvas Agent; see
the accompanying LICENSE and the repository NOTICE.md.
