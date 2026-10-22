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
| 1 | Gate 1 signature and exact target/plan binding at public CLI and exported apply seam; forged, wrong-key/identity/purpose, stale, cross-repository rejection preserves bytes; valid signature applies exact changes. `tests/advanced-apply.test.js`, `tests/remediation-task-acceptance.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 2 | Read-only proposal; Gate 1 consent; locked preimage check; no-op/unsupported/path rejection; exact diff, rollback and crash journal; post-write sanitation rescan. `tests/remediation-task-acceptance.test.js`, `tests/remediation-apply-coverage.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 3 | Empty/malformed/mixed executable maps are named nonzero gaps through shared and installed runners; valid launch count reflects real commands. `tests/remediation-task-acceptance.test.js`, `tests/catalogue-installed.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 4 | Exact real task launch only after signed one-use approval; drift/replay/restart/concurrency blocked on every local, CLI, MCP, installed and CI dispatch route. `tests/remediation-dispatch-boundaries.test.js`, `tests/guarantee-coverage.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 5 | OS-enforced filesystem and environment boundary for task and child processes; outside read/write, symlink, cwd and ambient-variable attempts denied on macOS and Linux; valid contained task succeeds. `tests/task-filesystem-sandbox.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 6 | Omitted/missing network declarations deny on all binding shapes; only exact approved explicit grant reaches listener; apply-generated binding covered. `tests/remediation-task-acceptance.test.js`, `tests/remediation-dispatch-boundaries.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 7 | Agent-led open discovery, semantic binding and ambiguity, user selection/exclusion, changed-file expansion and ignore behavior reach actual argv/cwd after apply and resume. `tests/remediation-discovery-pathb.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 8 | Every read-only route snapshots each command, reports mutation/nonzero/signal truthfully, preserves edits and stops before the next command. `tests/remediation-dispatch-boundaries.test.js`, `tests/guarantee-coverage.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 9 | Installed Path B lint-format runs real good/bad source checks at Policy; Context review and Evidence replay are cumulative and bound. `tests/remediation-discovery-pathb.test.js`, `tests/path-b-catalog.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 10 | Installed hook and CI actually run enabled policy baseline in order; signed disable/re-enable, real commit, user hook and lint grade rules are honored. `tests/remediation-policy-baseline.test.js`, `tests/advanced-ci-floor.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 11 | Sanitation scans staged index bytes through the shared detector; semantic drift requires current review and rejects contradiction at installed hook. `tests/remediation-history-global-journal.test.js`, `tests/advanced-sync.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 12 | Policy activation is atomic, locked and recoverable; exact signed action is durably consumed before dispatch and resists clone/replay/races. `tests/remediation-policy-baseline.test.js`, `tests/remediation-dispatch-boundaries.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 13 | Existing provider CI is classified and merged without clobber; malformed/unknown shapes preserved; real provider execution is verified only when observed; otherwise explicitly first_run_required. `tests/remediation-ci-merge.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 14 | Secret/PII/path data stays private across CLI, Git, CI, MCP and reports; every abnormal ending retains distinct nonpassing state. `tests/remediation-ci-privacy.test.js`, `tests/basic-guard-scanner.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 15 | One strict journal parser governs readers and recovery; malformed history fails closed; attributable weight includes every written preimage. `tests/remediation-history-global-journal.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 16 | Coverage writes require exact signed approval and durable recoverable ownership; higher grades retain cumulative lower-grade bindings. `tests/remediation-apply-coverage.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 17 | Pinned official history scanner, structured/actionable local evidence, exact-current-finding Gate 1 waiver, and clean rescan after accepted findings. `tests/advanced-secret.test.js`, `tests/remediation-history-global-journal.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |
| 18 | Attributed shared-global JSON changes preserve all unrelated lexical bytes through install/reinstall/removal in either repository order; OpenClaw uses native CLI only. `tests/global-mcp-writes.test.js`, `tests/remediation-history-global-journal.test.js`. | Open — implementation and focused regressions are indexed in the current acceptance ledger; final full-gate and binding-review reconciliation remain. |

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

Three Luna agents completed the original repair slices, reviewed all eighteen
criteria independently and fixed the additional reproduced defects. The
mutable acceptance ledger maps every criterion to the current maintained
regression. All rows remain open for final verification and the binding review.

Current combined acceptance evidence passes 213/213 on macOS and 37/37 under
real Docker/Linux Bubblewrap. Pi passes 15/15, MCP 6/6, six-provider CI
preservation passes 7/7, and all five YAML provider artifacts pass native syntax
parsing. Logs and exact resume commands are under `.context/qa-closure/`.
The latest broad main run passed1274 tests and failed four on its starting
bytes; three reported regressions now have focused passing fixes, and the
fourth is the unsigned oracle. The live coherence gate now passes all66
tracker transitions and its seven dedicated tests. No green full npm gate
exists until owner signing and final verification.

`npm test` currently stops at the stale oracle signature, before test code.
The only human action identified is the batched signing of the prepared three
fixture files. The exact command remains:

```sh
node scripts/approve-gate1.js --confirm-digest-delta b093070363c5dc1a3ac6c4f991e76e6a53e577371c44c051b732b29275075de4
```

The owner already authorized the necessary fresh review and pushing this
branch after the required gates pass. Do not ask again or bypass signing.
Preserve author context `v6.0.0-qa-readiness-2026-10-17`, its existing review
counter, and the rejected report. Production promotion remains separate from
this QA PR and uses automated evidence on the exact QA commit.

Run `./.context/qa-closure/handoff.sh` for a read-only live state snapshot.
After human signing, `./.context/qa-closure/run-verification.sh` runs the full
gate with supported mirror variables pointing to digest-verified official
archives. This avoids the observed Node HTTPS timeouts without weakening the
production fetch checks. `HANDOFF.md` there has the reviewer, final delivery
and model-transition commands. Never reset Git, delete prior evidence, use
the human key, manufacture a receipt, or automatically retry a capped reviewer.
