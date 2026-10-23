# Testing strategy

The [stronger public-flow checkpoint](../reasoning/2026-10-20-qa-closeout-stronger-public-flow-proof.md)
records real writer/entrypoint candidate cases, the test-only security-key
protocol boundary, and fresh integration runs in flight.

The [runtime and host remediation checkpoint](../reasoning/2026-10-20-qa-closeout-runtime-and-host-remediation.md)
records real red-green grade, status, adapter and catalogue checks rather than
using the still-unsigned candidate as release evidence.

The [fresh independent findings](../reasoning/2026-10-20-qa-closeout-independent-findings.md)
separate passing original acceptance regressions from four newly reproduced
runtime failures and still-incomplete candidate oracle proofs.

The [October 20 evidence inventory](../reasoning/2026-10-20-qa-closeout-evidence-inventory.md)
confirms eight failures in the retained full run and starts fresh acceptance
and amendment-strength verification; no unsigned diagnostic counts as a
passing release gate.

The [October 19 QA resume](../reasoning/2026-10-19-qa-closeout-resume.md)
uses maintained regressions for the repaired closeout behavior; older scratch
injection scripts depend on source instructions and return shapes that changed
during the repair. The catalogue authoring failures found during the semantic
cleanup have been corrected; final-byte matrix verification is pending.
The [integration checkpoint](../reasoning/2026-10-19-qa-closeout-integration-checkpoint.md)
records the diagnostic 70/72 mixed-suite result, 15/15 host checks, and the
restored signed-oracle verifier. Final candidate testing waits for code freeze.
The [grade and oracle checkpoint](../reasoning/2026-10-19-qa-closeout-grade-and-oracle-checkpoint.md)
records the projected local grade path, the isolated unsigned acceptance patch
checks, and remaining final-byte validation.
The [candidate reconciliation](../reasoning/2026-10-19-qa-closeout-candidate-reconciliation.md)
retains exact test titles in both proving-ticket links and the proposed signed
oracle, so traceability checks still exercise the strengthened assertions.

[Current grade-receipt boundary](../reasoning/2026-10-18-qa-grade-receipt-boundary.md):
lint-format Context and Evidence need a digest-bound review and replayable
command receipt before either can report a pass.
[Local implementation checkpoint](../reasoning/2026-10-18-qa-grade-receipt-implementation-checkpoint.md)
records the former installed-path gap. The current installed runner projects
the same grade evaluator and writes a request after clean Policy commands;
the repository agent supplies an exact request-bound Context review, and
maximal reruns those commands into a local Evidence receipt. The
[operator guide](../../docs/advanced/operator.md#local-lint-and-format-grades)
gives the file locations and command. CI remains a separate approved adapter.

The [runtime-correction checkpoint](../reasoning/2026-10-18-qa-review-runtime-corrections.md)
records the observed-execution grade fix and the resulting expected failures
in the frozen lint-format cases pending owner amendment.

The [binding review checkpoint](../reasoning/2026-10-18-qa-binding-review-remediation-start.md)
records that `f8140b72` passed the full npm gate, local exact-commit archive
E2E and real-npm MCP retry, but independent semantic review failed. Those
earlier passing logs are evidence for that commit only; all final-byte checks
must be renewed after remediation.

The [QA follow-up checkpoint](../reasoning/2026-10-18-qa-closeout-followup-progress.md)
records passing focused normal and resumed migration replacement checks while
integrated final-byte verification remains pending.
The [integration checkpoint](../reasoning/2026-10-18-qa-closeout-followup-migration-integration.md)
and [platform verification checkpoint](../reasoning/2026-10-18-qa-closeout-followup-platform-verification.md)
record the protected-projection regression and passing macOS and Linux migration
checks. The final-byte full npm gate remains pending.
The [candidate-preparation checkpoint](../reasoning/2026-10-18-qa-closeout-followup-candidate-prep.md)
records the installed README assertion and stronger transaction-byte recovery check.

The current hubs were shortened to restore the wiki budget without extending
waivers. [Budget trace](../reasoning/2026-10-14-closure-wiki-budget.md)

The completed service matrix, installed CLI checks, recovery-boundary tests and
health workflow tests are part of the current suite. Earlier traces that say a
candidate check was pending are historical snapshots; final delivery evidence
is always renewed for the exact committed candidate.

## What it is

Gate 1 freezes acceptance behavior; tests execute that behavior through the same boundaries used by the product. Local work uses the smallest relevant test file, while CI runs the full gate. A passing test must execute, assert the intended result, and fail on a meaningful violation. [Gate 2 §9.2 and §13–14](../gate2/technical-spec.md#13-acceptance-traceability)

## Why it is this way

Inventory, file presence, source text and exit status alone can all pass while behavior is broken. Exact identity, observable effects, failure cases and installed-path coverage make omissions visible. [Known traps](../index/traps.md)

## What binds it

G7–G9 define TDD, debugging and independent review; AD-18 drives the executable oracle. Each Gate 2 §13 acceptance row names a mechanism and target. [Foundational decisions](../sources/logs/grill-decisions.md) · [acceptance index](../index/acceptance-cases.md)

## Lessons retained

- Test the installed path as well as library seams; the fresh-checkout MCP prerequisite is recorded in the [AT-HOME-1 closeout](../archive/2026-08/review-receipts-and-test-infrastructure.md).
- Reproducibility checks must vary the external factor that can drift; see the [tree-digest test](../reasoning/2026-09-02-catalogue-tree-digest-reproducibility.md).
- Fault injection must match the current recovery boundary, and a separate test should catch real regressions the frozen oracle misses. The review sequence is summarized in [test ratchets](../reasoning/2026-09-03-onboarding-hardening-oracle-review.md) and the [review/context-burn finding](../reasoning/2026-09-04-structural-workflow-fix-design.md).

## What was rejected

Implementation-authored acceptance, title-only evidence, trusting exit status, file-presence checks, no-op bindings, and treating missing targets as pass. Frozen tests change only through the owner's signed amendment. [Rejected approaches](../index/rejected.md)

## Authorities

- Frozen oracle: [Gate 1 acceptance](../gate1/acceptance.md)
- Traceability: [Gate 2 §13–14](../gate2/technical-spec.md#13-acceptance-traceability)
- Captured sources: [testing pipeline](../sources/reference/testing-pipeline-vision.raw.md), [mutation taxonomy](../sources/reference/mutation-testing-taxonomy.raw.md)
- Fixture prerequisite: [AT-HOME-1](../archive/2026-08/wiki-and-agent-working-conventions.md)

The current executed-test evidence gate is called by check-coherence.js. The
final local gate is npm test, run on the exact candidate before delivery.

The [2026-10-18 follow-up](../reasoning/2026-10-18-review-received-followup-fixes.md)
adds exact publication and post-migration interruption seams missed by prior
focused coverage, plus an editable check for current release documentation.
The [publication follow-up](../reasoning/2026-10-18-review-received-publication-followup.md)
records the remaining red pre-link parent substitution regression and why it
blocks the final migration acceptance gate.
The [directory-relative fix](../reasoning/2026-10-18-review-received-dirfd-fix.md)
records the 38/38 migration result and why the interrupted full `npm test` run
does not count as a green gate.
The [cleanup follow-up](../reasoning/2026-10-18-review-received-cleanup-followup.md)
adds external-sentinel tests for pre-publication root-swap cleanup and absent-
path marker-creation races; full migration verification is still in flight.
The [recovery-boundaries trace](../reasoning/2026-10-18-review-received-recovery-boundaries.md)
adds a substituted-regular-file preservation regression and a crash between
exclusive marker write and its applied journal append. Twenty focused checks
and the real-download retry pass; the full migration-file command did not
complete and remains unverified.
The [temp-retention trace](../reasoning/2026-10-18-review-received-temp-retention.md)
records the parent-symlink regression's updated transaction-temp expectation
after the first `npm test` run exposed it.
The [final gate retry trace](../reasoning/2026-10-18-review-received-final-gate-retry.md)
records the refreshed generated indexes and size hints needed before the final
`npm test` run.
The [full-gate trace](../reasoning/2026-10-18-review-received-full-gate-passed.md)
records the successful repository, Pi-extension and MCP test suites.

The current closeout regressions cover unsafe migration entries, replayed
intent conflicts, pinned upstream delivery, deselection, receipt integrity,
wrong-shaped global configuration, and health-result reporting at their public
boundaries. [Remediation trace](../reasoning/2026-10-18-qa-closeout-remediation.md)

The [full-gate checkpoint](../reasoning/2026-10-19-qa-closeout-full-gate-checkpoint.md)
records green focused integration, coherence, and the full service matrix; the
repository-wide gate and final-candidate archive evidence remain in flight.
The [oracle diagnostic](../reasoning/2026-10-19-qa-closeout-oracle-diagnostic.md)
records the frozen lint fixtures that still predate nonce approvals and the
target-aware CI planner, plus the passing real-npm MCP retry.
The [owner-patch checkpoint](../reasoning/2026-10-19-qa-closeout-owner-patch-ready.md)
records 17 passing amended cases and complete manifest and trace verification
in isolation; the current worktree keeps its signed oracle untouched.
The [pinned-mirror checkpoint](../reasoning/2026-10-19-qa-closeout-pinned-mirror-checkpoint.md)
records the exact archive digest used to make the broad diagnostic independent
of repeated optional upstream fetch timeouts.
The [mirrored gate progress](../reasoning/2026-10-19-qa-closeout-mirrored-gate-progress.md)
records AT-LF-5 passing after its editable validation fix while the broader
digest-pinned run continues.
The [CI binding correction](../reasoning/2026-10-19-qa-closeout-ci-binding-correction.md)
records the installed CI invocation added to the maximal lint regression and
the approved-path binding it exercises.
