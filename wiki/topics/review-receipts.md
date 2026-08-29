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
[[2026-08-26-rig124-cap-lost-update]].

## Authorities and sources

- Review intent: [business specification](../gate1/business-spec.md)
- Working mechanism: [technical specification](../gate2/technical-spec.md)
- Historical receipts: [review sources](../sources/reviews/)
- Latest rejected implementation review: [v0.16 failed review](../sources/reviews/a-la-carte-v0.16-implementation.failed.review.json)
- Production findings: [intent-owner trace](../reasoning/2026-08-23-production-release-blockers.md)
- PR review binding: [owner decision](../reasoning/2026-08-23-triage-disclosure-and-pr-review.md)
- Re-review cap / interim passes: [RIG-124](../tickets/RIG-124.md), [implementation trace](../reasoning/2026-08-25-rig124-implementation.md), token-burn source: [investigation](../reasoning/2026-08-25-token-burn-investigation.md)

## Remaining work

Historical receipts remain historical because they bind older bytes. The fresh
independent receipt must be produced after disclosure implementation and the
full test gate; the implementation context cannot self-issue it.
