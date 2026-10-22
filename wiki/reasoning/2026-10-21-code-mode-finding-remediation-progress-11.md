---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-finding-remediation-progress-10
tags: review, remediation, verification, gate1
summary: The 152-test focused set passes; npm test is stopped by the unsigned Gate 1 amendment, and the 18-item ledger remains open.
---

The focused command covering advanced acceptance, apply, onboarding,
spawn-guard, lint-format, oracle, shipping-boundary, global MCP-write, and
Path B weight suites passed 152/152. The Gate 1 manifest hashes match the
prepared signed-fixture and AT-B6 test changes. The unfreeze request records
the exact oracle confirmation digest
`caa34cfc14b0ff9d67bf0369fabbae1c98d4adf0a83170a7f9b562c03be7e344`.

`npm test` was run and stopped in its pretest chain at
`node scripts/check-advanced-spec.js`: `rig oracle: oracle signature does not
verify`. The repository's frozen oracle therefore needs its key holder to
review and sign the concrete amendment before the full suite can start. Pi and
MCP test commands were not reached. The wiki budget, spawn-guard inventory,
and `git diff --check` pass.

This is not acceptance completion. The binding review has not been repeated,
the 18 rows remain open, and several required adversarial entry-point proofs
are still outstanding. Next: the Gate 1 key holder signs the prepared exact
delta; rerun `npm test`; then complete the remaining evidence and closure
review against the final candidate bytes.
