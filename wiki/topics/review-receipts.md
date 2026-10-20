# Review receipts

## What it is

The [authorized retry](../reasoning/2026-10-20-trust-root-rereview-result.md)
is **fail**: three major and six minor findings, no blockers, and no passing
receipt. The preserved counter rose from five to six. The [authorization](../reasoning/2026-10-20-owner-authorized-trust-root-rereview.md)
was used once. Approval remains withheld and no further attempt is authorized.
The [provider-limit failure](../reasoning/2026-10-20-trust-root-binding-review-unavailable.md)
and the reviews below concern earlier attempts. The [handoff](../specs/close-everything/2026-10-20-trust-root-review-handoff.md)
lists bounded criteria for the unreproduced reviewer claims.

The [authorized October 20 review result](../reasoning/2026-10-20-authorized-binding-review-result.md)
is **fail**: four blocker, five major and three minor findings; no passing
receipt, and three preserved failures. The [bounded finding-by-finding handoff](../specs/close-everything/2026-10-20-binding-review-handoff.md)
provides acceptance criteria and written-response options, preserving the
owner's honest host-gap decision. No further binding retry is authorized.

The [owner's October 20 authorization](../reasoning/2026-10-20-owner-authorized-binding-rereview.md)
permits one additional binding `--force-rereview` attempt using the preserved
reviewer, author context and attempt history. Authorization permits the attempt;
its verdict and current-byte validation determine whether a receipt is usable.

The [fix-verification checkpoint](../reasoning/2026-10-18-qa-closeout-fix-verification.md)
checks the eight-item remediation. Its [bounded follow-up](../specs/close-everything/qa-prod-closeout-followup.md)
retains only incomplete criteria: migration safety/recovery, documented helper
paths, empty-selection output safety, current authorities and maintained checks.
Approval remains withheld; verified fixes are not reopened.

A release review receipt is wrapper-authored, report-only evidence from a fresh
review context. It binds the exact technical-spec digest, a digest over the
catalogue plus every referenced fragment, a deterministic digest of the exact
PR implementation worktree and its base, the reviewer context and timestamp,
one verdict per current acceptance case, findings, and unresolved cases.

The [consolidated advisory verdict](../reasoning/2026-10-18-qa-closeout-consolidated-verdict.md)
withholds approval for eight grouped findings. The
[active acceptance handoff](../specs/close-everything/qa-prod-closeout-review.md)
reconciles every earlier review and separates QA merge from later release
operations. No binding wrapper attempt ran; the prior count and designated
reviewer remain preserved.

## Validation

Producer and validator now use the same `report-only` schema. Validation
requires distinct author/reviewer contexts, exact current spec, catalogue, and
implementation digests, the expected PR base, exact
acceptance-ID set equality with no duplicates, a passing verdict for every
case, `unresolved: []`, and no blocker finding. Missing, extra, stale, failing,
or unresolved reviews fail closed. The wrapper validates the reviewer result
before it writes a receipt, so an incomplete file is never release evidence.

The release operator supplies the unchanged file produced by the wrapper.
Workflow dispatch access and custody of that file are trusted operational
inputs: JSON validation checks content bindings, not who produced the file.
The implementation digest uses Git's canonical executable/non-executable modes
so identical publishable bytes reproduce across checkout umasks and platforms.

The reviewer supplies semantic verdicts and findings only. The wrapper can
launch Claude or Codex as an ephemeral read-only driver; driver choice changes
neither the prompt nor receipt contract. It computes digests, creates the fresh
context identifier, records the driver and model for audit, and writes the
timestamp. A model label is not the independence mechanism; the fresh context
and report-only authority are. Review receipt files are excluded
from the implementation digest to avoid a self-referential hash; all other
tracked and publishable untracked files are covered.

## Re-review cap and interim passes (RIG-124)

The wrapper is a release-only gate, never a mid-development inner loop. It
tracks failures per `--author-context` in a sibling `<out>.attempts.json`
file: a `fail` verdict increments the count, a `pass` clears it, and a prior
count above one refuses to spawn another reviewer — "at most one re-review
after a fix," enforced by the script itself rather than agent discipline.
`--force-rereview` overrides the cap as an explicit, visible step. `--interim`
runs the same review with a cheap `--model` for a fix-and-recheck cycle but
never writes the binding receipt (prints verdict and findings, exits non-zero
on fail); only a run without `--interim` produces AT-GATE-3 evidence, using
the model the release designates. Default behavior with neither flag is
unchanged from before RIG-124.

**RIG-124.1 is now Done (2026-08-26):** the cap-scoping fix and the
reviewer process-group fix both landed with named regression tests; a killed
or timed-out reviewer spawn is persisted before the cap is evaluated. See
[[archive/2026-08/review-receipts-and-test-infrastructure|2026-08-26-rig124-cap-lost-update]].

## Authorities and sources

- Review intent: [business specification](../gate1/business-spec.md)
- Working mechanism: [technical specification](../gate2/technical-spec.md)
- Historical receipts: [review sources](../sources/reviews/)
- Latest rejected implementation review: [v0.16 failed review](../sources/reviews/a-la-carte-v0.16-implementation.failed.review.json)
- Production findings: [intent-owner trace](../archive/2026-08/release-install-and-distribution.md)
- PR review binding: [owner decision](../archive/2026-08/host-coverage-and-mcp-wiring.md)
- Re-review cap / interim passes: [RIG-124](../tickets/RIG-124.md), [implementation trace](../archive/2026-08/review-receipts-and-test-infrastructure.md), token-burn source: [investigation](../archive/2026-08/wiki-and-agent-working-conventions.md)

## Remaining work

The [renewed candidate review](../reasoning/2026-10-17-review-received-final-candidate-review.md)
withheld approval for two reproduced migration/upgrade defects and current
design/documentation drift. The [follow-up fixes](../reasoning/2026-10-18-review-received-followup-fixes.md)
record the fixes and regression seams; final-byte verification and owner-led
review and release evidence remain separate. The reserved binding review
attempt has not been consumed; review notes do not constitute a receipt. The
[completed verdict](../reasoning/2026-10-18-review-received-candidate-verdict.md)
remains the record for the prior candidate's evidence.

The [Review Received request](../reasoning/2026-10-17-review-received-request.md)
asks for final review and PR approval. The
[report-only findings](../reasoning/2026-10-17-review-received-findings.md)
withhold approval for three high defects and a network-warning regression.
The dirty candidate and failing pushed-head CI precede the reserved binding
review. The PR author's connected account cannot supply GitHub self-approval.
The [delivery result](../reasoning/2026-10-17-review-received-delivery.md)
records that GitHub denied both review and comment publication with HTTP 403;
the report exists locally and no approval was created.
The [resolution criteria](../specs/close-everything/review-received-resolution.md)
give the fixing agent per-finding checks and evidence requirements, followed
by the approval checklist. See the
[handoff request](../reasoning/2026-10-17-review-received-acceptance-handoff.md).
The [resolution progress trace](../reasoning/2026-10-17-review-received-resolution-progress.md)
records that network diagnostic preservation and exact-SHA Linux/macOS
eligibility are red-green verified while migration and upgrade setup remain in
flight.
The [resolution findings trace](../reasoning/2026-10-17-review-received-resolution-findings.md)
records the regression evidence and the remaining exact-candidate and review
receipt requirements.
The [verification trace](../reasoning/2026-10-17-review-received-resolution-verification.md)
records the passing focused suite and unresolved owner-controlled release gates.
The [full-gate trace](../reasoning/2026-10-17-review-received-resolution-full-gate.md)
records the green local full gate and remaining exact-candidate/owner review steps.

The `v5.0.0` receipt is
[`rig-120-v5.0.0-2026-08-29-fresh.review.json`](../sources/reviews/rig-120-v5.0.0-2026-08-29-fresh.review.json):
`verdict: pass`, no unresolved cases, bound to the tagged commit. Historical
receipts remain historical because they bind older bytes.

The [late findings trace](../reasoning/2026-10-17-review-received-resolution-late-findings.md)
records follow-up report-only defects, their acceptance regressions, and the
owner-controlled evidence still required before the PR can close.
The [publication follow-up](../reasoning/2026-10-18-review-received-publication-followup.md)
keeps Finding 17 open after identifying the remaining pre-link parent swap.
The [directory-relative fix](../reasoning/2026-10-18-review-received-dirfd-fix.md)
resolves that race and records the locally demonstrated findings; full release
evidence and the new candidate receipt remain open.
The [cleanup follow-up](../reasoning/2026-10-18-review-received-cleanup-followup.md)
records root-pinned migration cleanup and exclusive no-follow MCP marker reads
and writes, with full migration verification still running.
The [recovery-boundaries trace](../reasoning/2026-10-18-review-received-recovery-boundaries.md)
adds two red-green recovery regressions and records the real-download MCP
retry evidence; the full migration and repository gates remain open.
The [temp-retention trace](../reasoning/2026-10-18-review-received-temp-retention.md)
records the corrected refusal expectation; the final full gate is rerunning.
The [final gate retry trace](../reasoning/2026-10-18-review-received-final-gate-retry.md)
records that generated wiki files are current before the final gate rerun.
The [full-gate trace](../reasoning/2026-10-18-review-received-full-gate-passed.md)
records 1,111 main tests, 15 Pi-extension tests and six MCP tests passing;
exact-SHA evidence and the new candidate receipt remain open.

The [renewed review checkpoint](../reasoning/2026-10-18-review-received-renewed-review-start.md) records the uncommitted fix handoff and ongoing independent verification.

The [repository-wide closeout request](../reasoning/2026-10-18-qa-closeout-review-request.md) asks for one consolidated set of findings and verifiable criteria for the fixing agent.

The [broad review checkpoint](../reasoning/2026-10-18-qa-closeout-review-progress.md) records coverage, grouped reproductions and the distinction between QA merge and production-only evidence.

The [managed-section correction](../reasoning/2026-10-18-qa-closeout-managed-section-correction.md) retracts a proposed code finding because the signed contract intentionally removes edited managed bodies; live documentation must match that behavior.

The [temp-type boundary check](../reasoning/2026-10-18-qa-closeout-temp-type-check.md) adds a bounded FIFO-refusal criterion to the existing migration finding; the consolidated list remains eight groups.

The [trust-root review fixes](../reasoning/2026-10-20-trust-root-review-fixes-progress.md) trace resolves the nine findings of the failed re-review (counter 6, preserved) and stages a second owner amendment; no new receipt exists.
