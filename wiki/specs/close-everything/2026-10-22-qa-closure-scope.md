# 6.0.0 QA closure scope and recovery — 2026-10-22

This scope carries the owner's request to resolve and verify all eighteen
findings in the retained October 21 failed review. The immutable acceptance
criteria remain in
[`2026-10-21-code-mode-review-acceptance.md`](2026-10-21-code-mode-review-acceptance.md).
This page does not revise those criteria, close a finding, or claim release
readiness.

## Required proof by finding

Each row needs a passing positive case, the named adversarial cases from its
acceptance section, the exact command/result, candidate commit and worktree
digest. A focused pass is evidence for that case only. A row closes only after
all its required public entry points and evidence are reviewed against the
criteria.

| # | Required behavior and evidence surface | Current disposition |
|---|---|---|
| 1 | Gate 1 signature and exact target/plan binding at public CLI and exported apply seam; forged, wrong-key/identity/purpose, stale, cross-repository rejection preserves bytes; valid signature applies exact changes. `tests/advanced-apply.test.js`, `tests/remediation-task-acceptance.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 2 | Read-only proposal; Gate 1 consent; locked preimage check; no-op/unsupported/path rejection; exact diff, rollback and crash journal; post-write sanitation rescan. `tests/remediation-task-acceptance.test.js`, `tests/remediation-apply-coverage.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 3 | Empty/malformed/mixed executable maps are named nonzero gaps through shared and installed runners; valid launch count reflects real commands. `tests/remediation-task-acceptance.test.js`, `tests/catalogue-installed.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 4 | Exact real task launch only after signed one-use approval; drift/replay/restart/concurrency blocked on every local, CLI, MCP, installed and CI dispatch route. `tests/remediation-dispatch-boundaries.test.js`, `tests/guarantee-coverage.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 5 | OS-enforced filesystem and environment boundary for task and child processes; outside read/write, symlink, cwd and ambient-variable attempts denied on macOS and Linux; valid contained task succeeds. `tests/task-filesystem-sandbox.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 6 | Omitted/missing network declarations deny on all binding shapes; only exact approved explicit grant reaches listener; apply-generated binding covered. `tests/remediation-task-acceptance.test.js`, `tests/remediation-dispatch-boundaries.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 7 | Agent-led open discovery, semantic binding and ambiguity, user selection/exclusion, changed-file expansion and ignore behavior reach actual argv/cwd after apply and resume. `tests/remediation-discovery-pathb.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 8 | Every read-only route snapshots each command, reports mutation/nonzero/signal truthfully, preserves edits and stops before the next command. `tests/remediation-dispatch-boundaries.test.js`, `tests/guarantee-coverage.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 9 | Installed Path B lint-format runs real good/bad source checks at Policy; Context review and Evidence replay are cumulative and bound. `tests/remediation-discovery-pathb.test.js`, `tests/path-b-catalog.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 10 | Installed hook and CI actually run enabled policy baseline in order; signed disable/re-enable, real commit, user hook and lint grade rules are honored. `tests/remediation-policy-baseline.test.js`, `tests/advanced-ci-floor.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 11 | Sanitation scans staged index bytes through the shared detector; semantic drift requires current review and rejects contradiction at installed hook. `tests/remediation-history-global-journal.test.js`, `tests/advanced-sync.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 12 | Policy activation is atomic, locked and recoverable; exact signed action is durably consumed before dispatch and resists clone/replay/races. `tests/remediation-policy-baseline.test.js`, `tests/remediation-dispatch-boundaries.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 13 | Existing provider CI is classified and merged without clobber; malformed/unknown shapes preserved; real provider execution is verified only when observed; otherwise explicitly first_run_required. `tests/remediation-ci-merge.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 14 | Secret/PII/path data stays private across CLI, Git, CI, MCP and reports; every abnormal ending retains distinct nonpassing state. `tests/remediation-ci-privacy.test.js`, `tests/basic-guard-scanner.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 15 | One strict journal parser governs readers and recovery; malformed history fails closed; attributable weight includes every written preimage. `tests/remediation-history-global-journal.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 16 | Coverage writes require exact signed approval and durable recoverable ownership; higher grades retain cumulative lower-grade bindings. `tests/remediation-apply-coverage.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 17 | Pinned official history scanner, structured/actionable local evidence, exact-current-finding Gate 1 waiver, and clean rescan after accepted findings. `tests/advanced-secret.test.js`, `tests/remediation-history-global-journal.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |
| 18 | Attributed shared-global JSON changes preserve all unrelated lexical bytes through install/reinstall/removal in either repository order; OpenClaw uses native CLI only. `tests/global-mcp-writes.test.js`, `tests/remediation-history-global-journal.test.js`. | Closed on finding-specific evidence — the acceptance ledger names the maintained proofs; final full-gate, binding review and exact-head PR checks remain delivery conditions. |

## Ownership and integration

- **Luna runtime:** Path B execution, policy-aware baseline and active-bundle
  failures; owns runtime modules and non-frozen regressions assigned to that
  slice.
- **Luna integration:** secret hygiene, spawn inventory, CI uninstall fixture
  and deterministic-v5 evidence; owns its assigned modules/tests. Never weaken
  detectors or blanket-allow spawn debt.
- **Luna evidence:** documentation/design/operator truth, all eighteen evidence
  mappings, this durable scope and the read-only handoff; owns docs/wiki and
  the acceptance ledger after section 18. Frozen criteria and Gate 1 files are
  outside this ownership.
- **Coordinator:** integrate changes, repair only approved frozen fixtures,
  obtain the one human signature, run final macOS/Linux checks and `npm test`,
  then seek the authorized independent review and handle delivery.

Confirm file ownership with the coordinator before touching a shared file.
Focused evidence can be reused only when it names the tested bytes and seam.

## Current gate and recovery

Three Luna repair/review slices and three fresh Luna evidence/audit slices have
completed. All eighteen finding rows have reviewed implementation and
regression evidence in the mutable acceptance ledger. The original sections
1–18 are preserved. New installed public-process proofs cover network denial
and exact signed grant, CI timeout/mutation parity, and Gate 1 signed privacy
triage enable/disable. A reproduced standalone exact-copy diagnostic leak is
fixed with the already-installed shared redactor and safe CI projection.

The owner has signed the prepared fixture amendment. Independent verification
passes16 files and95 acceptance cases. No additional signing action is needed.
The first signed full npm run passes main1284, Pi15 and MCP6, with zero failures
and two main-suite skips. Since final proof/docs changes overlapped that run,
freeze/commit this candidate and repeat the full gate before binding review.
The added proof files pass8/8; workflow checks pass8/8. Prior actual Linux
Bubblewrap evidence passes43/43. CI now installs Bubblewrap explicitly in
Ubuntu test, health, eligibility and both clean-install jobs, preserving the
namespace setup/probe. Logs and recovery commands are in `.context/qa-closure/`.

The owner already authorized the necessary fresh review and pushing this
branch after required gates pass. Preserve author context
`v6.0.0-qa-readiness-2026-10-17`, its existing attempt counter and rejected
report. Run the final full gate, obtain/validate an exact-byte passing review,
then push/update PR153 against qa-prod and inspect required checks on its
exact head. No passing fresh receipt, new push or deployment is claimed by
this checkpoint. Production promotion remains separate and uses automated
health plus real-download clean-install evidence on the exact QA commit.

Run `./.context/qa-closure/handoff.sh` for a read-only live state snapshot.
`./.context/qa-closure/run-verification.sh` runs the full gate with supported
mirror variables pointing to verified official archives, avoiding reproduced
Node HTTPS timeouts without weakening production fetch checks. Its
`HANDOFF.md` records final review/delivery and model-transition commands.
Never reset Git, delete prior evidence, use the human key, manufacture a
receipt, or automatically retry a capped reviewer.

## Fresh binding review follow-up — 2026-10-22 17:46 UTC

The exact signed candidate full gate passes main1292/Pi15/MCP6 and coherence66/66,
but the fresh review rejected seven shipping-seam gaps. Read the latest
[review trace](../../reasoning/2026-10-22-final-review-seven-shared-seam-gaps.md)
and [report](../../sources/reviews/v6.0.0-2026-10-22-qa-candidate.failed.review.json).
Affected acceptance-ledger rows are reopened. Three non-overlapping Luna
lanes now repair installed dispatch/evidence, inspection/journal integrity,
and harness/privacy. Root integrates and reruns exact-byte final verification.
No push, passing receipt or deployment is claimed; no new human signing
requirement has been found. Earlier closure statements above are superseded
by this review result and the current ledger.
