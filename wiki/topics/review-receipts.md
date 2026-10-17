# Review receipts

## What it is

A release review receipt is wrapper-authored, report-only evidence from a fresh
review context. It binds the exact technical-spec digest, a digest over the
catalogue plus every referenced fragment, a deterministic digest of the exact
PR implementation worktree and its base, the reviewer context and timestamp,
one verdict per current acceptance case, findings, and unresolved cases.

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
