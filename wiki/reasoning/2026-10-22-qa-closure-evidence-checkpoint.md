---
date: 2026-10-22
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes:
tags: review, remediation, verification, recovery
summary: Focused platform, runtime, privacy and CI checks are green after repairing most historical full-suite failures; the current full-main is still running and the frozen Gate 1 signature remains pending.
---

The historical full-main run in `.context/full-main-final-candidate.log`
recorded 1,246 passes and 11 failures. Most of those failures now have
focused repairs documented in `.context/qa-closure/luna-integration.log` and
`luna-runtime.log`; the old count is not the current failure list. Current
focused evidence includes Linux/Bubblewrap 25/25, macOS 36/36, Pi 15/15, MCP
6/6, five merged provider YAMLs accepted by the native Ruby parser, seven CI
adapter tests, local-listener network oracle 2/2, and CI-floor 3/3. Runtime
focused checks pass 3/3 and spawn-guard checks pass 6/6. Focused checks address
their own cases only; all eighteen acceptance rows remain open pending exact
candidate and binding review.

The current full-main process writes `.context/qa-closure/full-main.log` and
was still running at this checkpoint. Its final result is unknown. The
separate `.context/qa-closure/full-npm.log` exits before test code because
`tests/advanced-oracle.test.js` differs from the frozen Gate 1 digest. The
owner-provided signing command remains exactly
`node scripts/approve-gate1.js --confirm-digest-delta b093070363c5dc1a3ac6c4f991e76e6a53e577371c44c051b732b29275075de4`;
the human key holder must review and run it. No agent signs or retries a
binding review automatically.

Finding 13's focused provider merge evidence is not a real provider execution.
Where a supported provider's first run is absent, record
`first_run_required` / unverified. Missing credentials for six remote
providers do not turn into a blanket owner blocker.

I updated the mutable status ledger for findings 3, 5, 6, 8, 13 and 14 without
changing acceptance criteria 1–18. A focused report-only review of findings
3, 5, 6, 8 and 14 found no substantiated implementation defect in the
inspected surfaces; it records remaining evidence gaps in
`.context/qa-closure/luna-review-boundaries.md`. No product or test files were
changed as part of that review. The read-only recovery handoff and executable
script now distinguish historical failures, current focused evidence, the
in-progress full-main and the signature-gated npm run. Resume from the scope,
handoff and retained logs; do not reset Git, delete evidence, sign, or start an
automatic reviewer retry.
