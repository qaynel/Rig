---
date: 2026-10-17
source: agent
topics: distribution-and-release
status: historical
supersedes: 2026-10-17-review-received-resolution-late-findings.md
summary: The public installer must preserve an explicit migration-only MCP setup request on v5 upgrades while keeping fresh installs opt-out.
---

The independent correctness pass caught a remaining gap after the focused upgrade work: `install.sh` unconditionally set `SETUP_MCP=0`, so the public entrypoint discarded an explicit migration setup request. The original bootstrap test did not cross this wrapper boundary.

I added a public-installer regression that keeps `SETUP_MCP=1` in the environment. It first proves a fresh install ignores that migration-only request and does not call npm. On a v5 upgrade, injected npm failure must return nonzero and leave the owned retry marker; a retry must install the runtime, remove the marker, complete an MCP handshake, and call `rig_instructions`. The test failed before the fix at the assertion that the upgrade fail. `install.sh` now forwards an explicitly supplied setup request and retains the default of zero. The regression passes with stubbed dependency installation. Its optional `RIG_TEST_REAL_NPM=1` mode will be used on the exact committed candidate for real dependency downloads.

This distinguishes three cases in the working technical spec: default installs avoid optional dependencies, the explicit migration-only request finalizes a v5 runtime without global OpenClaw writes, and `--openclaw-mcp` installs and registers the server. The user-facing default-install documentation continues to describe the ordinary no-npm path. Both the stubbed regression and `RIG_TEST_REAL_NPM=1 node --test --test-name-pattern='public installer disables setup-only MCP' tests/migrate-v5.test.js` passed (1/1); the latter used real dependency downloads and an actual MCP tool call in the disposable upgraded target. Independent re-review found no remaining correctness or security issues.

Next: rerun migration and policy suites, run the exact-candidate public upgrade with real npm, run all local policy/oracle checks, then run `npm test` on the final committed bytes. Exact-QA Linux/macOS evidence, binding receipt, push, independent approval, and PR closure remain controlled by the owner delivery process.
