---
date: 2026-10-17
source: agent
topics: distribution-and-release
status: current
supersedes: 2026-10-17-review-received-resolution-mcp-emission-docs.md
summary: The exact-SHA clean-install harness now explicitly opts into MCP through disposable OpenClaw state.
---

The exact-commit clean-install path was an important part of this review, so I ran it against a local Git archive of commit `85a24ec4dc86f562c97e9f7520b58ab1a90d59f2`. It initially failed because the harness expected `.rig/mcp-server.json` while using the new default no-npm install. I changed the harness to request `--openclaw-mcp`, provide a fake CLI and isolated OpenClaw config under the disposable HOME, seed an unrelated server, and verify the Rig entry is removed without disturbing it. The first rerun revealed the expected clone-local identity under `.git/rig/install-id`; the fixture now seeds that identity before inventory so it can verify user bytes remain unchanged through uninstall.

The corrected run passed fresh and existing scenarios with actual npm downloads, MCP handshake and `rig_instructions`, service execution, and full inventory comparison after uninstall. It used a local archive from exact commit 85a24ec4, but the E2E script was modified in the working tree, so its evidence correctly marked `provisional: true`. The implementation/test regression passes; exact final-commit E2E must be rerun after this harness update is committed.

Next: regenerate wiki indexes; run focused checks and coherence; commit the E2E change; run the exact-commit E2E and complete `npm test` on the resulting candidate. Exact-QA Linux/macOS runs, binding receipt, push, independent approval, and PR closure remain owner-controlled.
