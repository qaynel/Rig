---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-sandbox-regressions-fixed
tags: review, remediation, verification
summary: Owner-signed Gate 1 oracle and the full npm test gate pass after correcting two stale isolation-status assertions; all eighteen review findings remain open pending their specific adversarial proof.
---

The owner ran the Gate 1 approval command with `lock` and the expected digest
`baa6178531319ce81a4d40ddadd10776d874a24543f218bdf05410aee7459c3e`.
`node scripts/check-advanced-spec.js` verifies 16 files and 95 acceptance
cases.

The first full `npm test` run exposed two stale assertions in
`tests/guarantee-coverage.test.js`. Disabling the task sandbox now reports
`filesystem_isolation_unavailable`; the tests expected the lower-level
`sandbox-disabled` reason. Updated both assertions. The focused command
`node --test --test-name-pattern='AT-PROC-1d|AT-PROC-1r' tests/guarantee-coverage.test.js`
passes 2/2.

The next full `npm test` passes: 1,192 main-suite tests passed, 2 skipped,
15 Pi extension tests passed, and 6 MCP tests passed. This establishes the
repository gate only. All 18 rows in the acceptance ledger remain open because
finding-specific proof is incomplete; see the ledger for exact remaining
criteria. No fresh binding review was started, and the required authorization
and external release evidence remain separate.
