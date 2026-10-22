# Review receipts

The [final signed-candidate checkpoint](../reasoning/2026-10-22-final-signed-candidate-freeze.md) records reviewed evidence for all eighteen findings, the completed owner signature (16 files/95 cases), and a diagnostic full npm pass (main1284, Pi15, MCP6). Added installed-route proofs and workflow checks each pass8/8. Freeze/commit the final bytes, repeat the full gate, obtain the binding receipt, then push PR153 and require checks on its exact head. No passing fresh receipt or deployment is claimed here.

The [closure scope](../specs/close-everything/2026-10-22-qa-closure-scope.md) and [unchanged acceptance criteria with closure ledger](../specs/close-everything/2026-10-21-code-mode-review-acceptance.md) hold the reviewed evidence map. Run `.context/qa-closure/handoff.sh`; [HANDOFF.md](../../.context/qa-closure/HANDOFF.md) preserves commands and model recovery. The owner signing step is complete.

## What a receipt proves

A release receipt is wrapper-authored, report-only evidence from a fresh review context. It binds the technical-spec digest, catalogue and referenced fragments, exact PR implementation worktree and base, reviewer context, timestamp, one verdict per current acceptance case, findings and unresolved cases. It is valid only for those exact bytes. It does not authorize implementation or sign Gate 1.

The reviewer returns verdicts and findings. The wrapper computes digests, starts the fresh context, records reviewer/model metadata and writes the receipt. Validation requires distinct author and reviewer contexts, current byte bindings, the exact acceptance-ID set, a passing verdict for every case, `unresolved: []`, and no blocker. Review receipts are excluded from the implementation digest to avoid self-reference; other tracked and publishable untracked files are included.

## Current review state

The [October 21 Codex review](../reasoning/2026-10-21-code-mode-binding-review-result.md) failed with four blockers and fourteen major findings. Its rejected report is retained at [the source JSON](../sources/reviews/v6.0.0-2026-10-21-code-mode.failed.review.json). All eighteen findings now have reviewed closure evidence; a fresh exact-candidate binding review remains required after the final full gate. Preserve the existing author context and attempt counter (ten before that review). The acceptance requirements remain unchanged.

The owner authorizes completing the existing scope without repeat permission prompts. The exact final binding review still follows the receipt path after the candidate is ready; preserve author context and counter. A provider usage limit means preserve logs and resume from the scope and handoff. It never changes a finding's status or authorizes an automatic retry.

## Re-review cap

`review-receipt.js` tracks failures per `--author-context` in a sibling attempts file. A failed review increments the count; a pass clears it. Once capped, another attempt requires an explicit owner-authorized `--force-rereview`. `--interim` is non-binding and cannot write a receipt. The wrapper tests and historical RIG-124 evidence are linked from the [decision index](../index/decisions.md) and [reasoning index](../index/reasoning.md).

## Authorities

- Review intent: [business specification](../gate1/business-spec.md)
- Working mechanism: [technical specification](../gate2/technical-spec.md)
- Acceptance IDs: [acceptance index](../index/acceptance-cases.md)
- Historical review sources: [reviews](../sources/reviews/)
- Delivery sequence: [change-management policy](../../rig/corpus/standards/change-management.md)
