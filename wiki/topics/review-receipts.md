# Review receipts

The [October23 repaired freeze](../reasoning/2026-10-23-report-review-fix-final-freeze.md) records both final-gate failures repaired and reviewed, with integrated focused tests21/21. Generated reports no longer invalidate current local Context review; command report writes still fail. Mandatory native catalogue containment coverage is corrected without admitting optional runtime packages. The oracle verifies16/95 and live coherence passes66/66. Final committed-byte full verification and a fresh binding receipt remain before pushing and checking required PR CI.

The [previous repaired-candidate checkpoint](../reasoning/2026-10-22-repaired-candidate-final-freeze.md) and [scope](../specs/close-everything/2026-10-22-qa-closure-scope.md) retain all eighteen finding mappings, cross-review and macOS/Linux evidence. The [unchanged acceptance criteria with ledger](../specs/close-everything/2026-10-21-code-mode-review-acceptance.md) remains the closure bar. Run `.context/qa-closure/handoff.sh`; [HANDOFF.md](../../.context/qa-closure/HANDOFF.md) preserves model recovery. No new signing action is required. Current-byte full npm, fresh passing binding receipt and required exact-head PR checks remain delivery gates.

## What a receipt proves

A release receipt is wrapper-authored, report-only evidence from a fresh review context. It binds the technical-spec digest, catalogue and referenced fragments, exact PR implementation worktree and base, reviewer context, timestamp, one verdict per current acceptance case, findings and unresolved cases. It is valid only for those exact bytes. It does not authorize implementation or sign Gate 1.

The reviewer returns verdicts and findings. The wrapper computes digests, starts the fresh context, records reviewer/model metadata and writes the receipt. Validation requires distinct author and reviewer contexts, current byte bindings, the exact acceptance-ID set, a passing verdict for every case, `unresolved: []`, and no blocker. Review receipts are excluded from the implementation digest to avoid self-reference; other tracked and publishable untracked files are included.

## Current review state

The [October21 rejected review](../sources/reviews/v6.0.0-2026-10-21-code-mode.failed.review.json) and [October22 seven-gap rejected report](../sources/reviews/v6.0.0-2026-10-22-qa-candidate.failed.review.json) are retained. The latter followed a green exact-candidate full gate1292+15+6 and exposed shipping seams that helper tests missed. Those seams now have real public-process proofs and cross-review repairs. No current passing receipt exists at this checkpoint. Preserve author context and counter11 for the necessary post-fix review; a pass is valid only on final unchanged bytes.

The owner authorizes completing the existing scope without repeat permission prompts. The exact final binding review still follows the receipt path after the candidate is ready; preserve author context and counter. A provider usage limit means preserve logs and resume from the scope and handoff. It never changes a finding's status or authorizes an automatic retry.

## Re-review cap

`review-receipt.js` tracks failures per `--author-context` in a sibling attempts file. A failed review increments the count; a pass clears it. Once capped, another attempt requires an explicit owner-authorized `--force-rereview`. `--interim` is non-binding and cannot write a receipt. The wrapper tests and historical RIG-124 evidence are linked from the [decision index](../index/decisions.md) and [reasoning index](../index/reasoning.md).

## Authorities

- Review intent: [business specification](../gate1/business-spec.md)
- Working mechanism: [technical specification](../gate2/technical-spec.md)
- Acceptance IDs: [acceptance index](../index/acceptance-cases.md)
- Historical review sources: [reviews](../sources/reviews/)
- Delivery sequence: [change-management policy](../../rig/corpus/standards/change-management.md)
