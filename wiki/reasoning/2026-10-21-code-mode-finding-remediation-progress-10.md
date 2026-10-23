---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: current
supersedes: 2026-10-21-code-mode-finding-remediation-progress-9
tags: review, remediation, verification, gate1
summary: Signed fixture amendments are prepared and core focused suites are passing; a key-holder signature and full acceptance proof remain outstanding.
---

The public apply fixture now delegates to a real local SSHSIG fixture signer.
The frozen AT-B6 fixture is also amended in draft to reject digest-only
remediation, use signed consent for the no-op and positive cases, and assert
the fresh sanitation verdict. Both changes are recorded in one Gate 1
unfreeze request; its manifest and oracle digest are updated, but no key-holder
signature is configured. The exact digest is recorded in that request.

The remediation path now challenges a no-op proposal without writing, then
checks every preimage and no-op under the remediation lock before any target
mutation. Successful remediation returns the actual post-write scan verdict.
Plan approval validation also supplies the internal verified result used by
the CI adapter. Maximal CI bindings include executable formatter and linter
commands, in addition to the approved workflow path and separate fix command.

Focused checks pass for AT-B6 (1/1), apply/transaction behavior (16/16),
selected lint-format and CI paths (3/3), and the broader focused set is in
progress. The full acceptance ledger is still open and no binding review has
been attempted. Next: finish the focused run, run the repository gate where
possible, keep all 18 criteria honest, and have the Gate 1 key holder review
and sign the prepared amendment before the final full-gate run.
