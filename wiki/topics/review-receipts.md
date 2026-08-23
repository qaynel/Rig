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

## Authorities and sources

- Review intent: [business specification](../gate1/business-spec.md)
- Working mechanism: [technical specification](../gate2/technical-spec.md)
- Historical receipts: [review sources](../sources/reviews/)
- Latest rejected implementation review: [v0.16 failed review](../sources/reviews/a-la-carte-v0.16-implementation.failed.review.json)
- Production findings: [intent-owner trace](../reasoning/2026-08-23-production-release-blockers.md)
- PR review binding: [owner decision](../reasoning/2026-08-23-triage-disclosure-and-pr-review.md)

## Remaining work

Historical receipts remain historical because they bind older bytes. The fresh
independent receipt must be produced after disclosure implementation and the
full test gate; the implementation context cannot self-issue it.
