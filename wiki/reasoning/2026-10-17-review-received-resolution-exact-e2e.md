---
date: 2026-10-17
source: agent
topics: distribution-and-release
status: historical
supersedes: 2026-10-17-review-received-resolution-clean-install.md
summary: The committed clean-install candidate passed exact-SHA local-archive E2E and real-npm public-upgrade checks.
---

The committed candidate `fff3a6b2c967e1167e668d377179f7be82828a75` passed the clean-install E2E using an archive created from that exact commit. The retained files are `.context/e2e-fff3a6b2.tar.gz` and `.context/e2e-fff3a6b2.json`; the JSON reports `provisional: false`, successful fresh and existing repository scenarios, real dependency downloads, an MCP handshake and `rig_instructions` call, the approved service check, and byte-inventory equality after uninstall. The archive SHA256 is `f09d1291c11481ef246ed9dd4dbacd2198fc969238b8f7f9d7dd4dd304ba9d1f`. This proves the local archive path for this commit, not the GitHub remote archive or required Linux/macOS workflow.

The same candidate passed the focused public v5 upgrade test with real npm enabled: `RIG_TEST_REAL_NPM=1 node --test --test-name-pattern='public installer disables setup-only MCP' tests/migrate-v5.test.js`. The retained log is `.context/real-mcp-upgrade-fff3a6b2.log`; it verifies fresh-install suppression, the v5 upgrade retry marker, successful npm retry, and MCP handshake/tool call.

The independent architecture review found no remaining design conflict after the Gate 2 clarification: migration-only `SETUP_MCP=1` applies only to v5 upgrades with a host that emits MCP, fresh installs and non-emitting hosts skip it, and it does not write OpenClaw configuration. The exact-E2E evidence and this trace update change publishable bytes, so the candidate must be committed and the local E2E plus full suite rerun on that final SHA. Remote QA workflows, receipt, authorized review, and PR closure remain owner-controlled.
