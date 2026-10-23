---
date: 2026-10-14
source: agent
topics: distribution-and-release, the-overhaul
decisions:
status: superseded
summary: Purge now preserves pre-existing reports, verified through the real uninstall lifecycle.
---
The clean-install E2E reached its post-install checks after MCP setup was wired, then failed because uninstall removed all of `reports/rig` before scoped evidence cleanup. Removed the recursive directory deletion; `cleanupEvidence` now restores only journaled files and leaves unrelated reports intact. Added an uninstall-level regression. `node --test tests/e2e/scoped-evidence.test.js tests/install-uninstall-roundtrip.test.js` passed (29/29). In flight: rerun the full provisional clean-install E2E. Next: fault-injection proofs and coherence sweep.
