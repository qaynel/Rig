---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-clearance-full-gate
tags: review, remediation, verification
summary: Five full-suite sandbox regressions were reproduced and fixed; focused cases pass, while the frozen test amendment needs Gate 1 signing before the final full gate.
---

The fresh full run failed five cases after 1,187 of 1,194 main-suite tests
passed. Four failures came from frozen lint-format fixtures writing replay or
network observations outside the repository, which the filesystem sandbox
correctly blocks. The fifth installed-diagnostics fixture manually copied the
shared check runner but omitted its new `sandbox.js` dependency.

Replay output now varies without mutating an external counter. Network probes
report through their process result instead of writing outside the target.
`runReadOnly` now preserves an explicit `filesystem_isolation_unavailable`
status and refuses to report clean when the sandbox cannot run. The installed
diagnostic fixture now materializes the shared sandbox module. The explicit
network-grant test exercises a real local listener under the sandbox.

Focused regressions passed: four selected cases in
`tests/advanced-oracle.test.js`, plus seven installed-diagnostics and task
filesystem-isolation cases. The Gate 1 manifest still records the prior
`tests/advanced-oracle.test.js` digest. The owner-reviewable amendment request
is `wiki/gate1/unfreeze-requests/2026-10-21-lint-task-filesystem-sandbox.md`;
its signing command uses digest
`baa6178531319ce81a4d40ddadd10776d874a24543f218bdf05410aee7459c3e`.

The full `npm test` gate must be rerun after the key holder updates the signed
oracle. Linux/bubblewrap, broader filesystem escape cases, and the remaining
finding-specific criteria are still unverified. All eighteen review findings
remain open; this progress is not acceptance.
