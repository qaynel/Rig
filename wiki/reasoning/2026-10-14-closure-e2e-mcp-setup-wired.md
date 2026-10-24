---
date: 2026-10-14
source: agent
topics: distribution-and-release, the-overhaul
decisions:
status: historical
summary: The public installer now runs the shipped MCP dependency setup through the install journal before optional global registration.
---
The first clean-install E2E attempts stopped because `.rig/mcp-server.json` was never produced: `install.sh` unpacked the runtime and returned after bootstrap, while the already-shipped `setup-mcp.js` had no caller. The public installer now requests MCP setup through bootstrap's existing post-payload callback, so downloaded dependencies and the descriptor share the install journal and are in place before optional OpenClaw registration. In flight: provisional clean-install E2E against an archive of the current candidate. Next: prove both fault injections and rerun coherence.
