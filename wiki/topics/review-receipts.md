# Review receipts

The [owner-signature handoff](../reasoning/2026-10-22-qa-closure-owner-signature-handoff.md) records213 macOS and43 Linux passing acceptance cases, a passing66-issue live coherence gate, and recoverable next commands. Human signing precedes the final npm gate, binding review and push.

The [2026-10-22 closure scope and recovery handoff](../specs/close-everything/2026-10-22-qa-closure-scope.md) preserves all eighteen criteria, evidence mapping and ownership. The executable state report is `.context/qa-closure/handoff.sh`; see [its instructions](../../.context/qa-closure/HANDOFF.md). Historical `.context/full-main-final-candidate.log` recorded 1,246 passes and 11 failures; most have focused fixes now. Current focused evidence: Linux 25/25, macOS 36/36, Pi 15/15, MCP 6/6, five provider YAML parses and seven adapter tests. The current full-main log is still running; another `npm test` stops before tests at the stale frozen Gate 1 digest. All findings remain open; required evidence, final candidate reconciliation and binding review still apply.

## What a receipt proves

A release receipt is wrapper-authored, report-only evidence from a fresh review context. It binds the technical-spec digest, catalogue and referenced fragments, exact PR implementation worktree and base, reviewer context, timestamp, one verdict per current acceptance case, findings and unresolved cases. It is valid only for those exact bytes. It does not authorize implementation or sign Gate 1.

The reviewer returns verdicts and findings. The wrapper computes digests, starts the fresh context, records reviewer/model metadata and writes the receipt. Validation requires distinct author and reviewer contexts, current byte bindings, the exact acceptance-ID set, a passing verdict for every case, `unresolved: []`, and no blocker. Review receipts are excluded from the implementation digest to avoid self-reference; other tracked and publishable untracked files are included.

## Current review state

The [October 21 Codex review](../reasoning/2026-10-21-code-mode-binding-review-result.md) failed with four blockers and fourteen major findings. Its rejected report is preserved at [the source JSON](../sources/reviews/v6.0.0-2026-10-21-code-mode.failed.review.json); no passing receipt exists and the attempt counter is ten. The [acceptance criteria](../specs/close-everything/2026-10-21-code-mode-review-acceptance.md) remain unchanged. The [latest dispatch checkpoint](../reasoning/2026-10-21-acceptance-dispatch-renewal-progress.md) records broad adversarial progress. The [October 22 evidence checkpoint](../reasoning/2026-10-22-qa-closure-evidence-checkpoint.md) and [focused security review](../../.context/qa-closure/luna-review-boundaries.md) record repairs and remaining exact-candidate gaps; full integration and current-byte acceptance are not established.

The owner authorizes completing the existing scope without repeat permission prompts. The exact final binding review still follows the receipt path after the candidate is ready; preserve author context and counter. A provider usage limit means preserve logs and resume from the scope and handoff. It never changes a finding's status or authorizes an automatic retry.

## Re-review cap

`review-receipt.js` tracks failures per `--author-context` in a sibling attempts file. A failed review increments the count; a pass clears it. Once capped, another attempt requires an explicit owner-authorized `--force-rereview`. `--interim` is non-binding and cannot write a receipt. The wrapper tests and historical RIG-124 evidence are linked from the [decision index](../index/decisions.md) and [reasoning index](../index/reasoning.md).

## Authorities

- Review intent: [business specification](../gate1/business-spec.md)
- Working mechanism: [technical specification](../gate2/technical-spec.md)
- Acceptance IDs: [acceptance index](../index/acceptance-cases.md)
- Historical review sources: [reviews](../sources/reviews/)
- Delivery sequence: [change-management policy](../../rig/corpus/standards/change-management.md)
