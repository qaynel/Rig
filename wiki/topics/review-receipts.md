# Review receipts

The [repaired-candidate freeze](../reasoning/2026-10-22-repaired-candidate-final-freeze.md) records all eighteen finding rows reconciled after seven binding-review repairs and actual Linux follow-ups. Signature16/95 is valid. Focused evidence includes Linux25/25+44/44, root public Linux34/34/macOS55/55 and final Linux signed-network/signal/inventory15/15. Final committed full npm, fresh exact-byte receipt and required exact-head PR checks remain delivery gates; no current release approval is claimed.

The [scope](../specs/close-everything/2026-10-22-qa-closure-scope.md) and [unchanged acceptance criteria with ledger](../specs/close-everything/2026-10-21-code-mode-review-acceptance.md) hold evidence and remaining commands. Run `.context/qa-closure/handoff.sh`; [HANDOFF.md](../../.context/qa-closure/HANDOFF.md) preserves model recovery. No new human signing step is required.

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
