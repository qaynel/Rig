# QA and production closeout

The [final signed-candidate checkpoint](../reasoning/2026-10-22-final-signed-candidate-freeze.md) records reviewed evidence for all eighteen findings, the completed owner signature (16 files/95 cases), and a diagnostic full npm pass (main1284, Pi15, MCP6). Added installed-route proofs and workflow checks each pass8/8. Freeze/commit the final bytes, repeat the full gate, obtain the binding receipt, then push PR153 and require checks on its exact head. No passing fresh receipt or deployment is claimed here.

The [closure scope](../specs/close-everything/2026-10-22-qa-closure-scope.md) and [unchanged acceptance criteria with closure ledger](../specs/close-everything/2026-10-21-code-mode-review-acceptance.md) hold the reviewed evidence map. Run `.context/qa-closure/handoff.sh`; [HANDOFF.md](../../.context/qa-closure/HANDOFF.md) preserves commands and model recovery. The owner signing step is complete.

## Current release checkpoint

The [October 21 code-mode review](../reasoning/2026-10-21-code-mode-binding-review-result.md) failed with four blockers and fourteen major findings. The [rejected report](../sources/reviews/v6.0.0-2026-10-21-code-mode.failed.review.json) and attempt history are preserved. All eighteen findings now have reviewed regression evidence in the closure ledger. The signed oracle is valid; the remaining delivery conditions are a full npm pass on final committed bytes, a fresh exact-byte passing review receipt, and green required checks on the pushed PR head.

Finding13's supported-provider execution remains honestly `unverified/first_run_required` wherever no real execution exists, as its acceptance contract permits; this never substitutes for GitHub PR checks. The release candidate is `6.0.0`. Follow the ordered [deployment policy](../../rig/corpus/standards/change-management.md) and [closeout task list](../specs/close-everything/task-list.md). Production promotion requires automated health plus real-download clean-install evidence on the exact QA commit. No evidence carries across candidate changes.

## Historical records

Earlier October closeouts and the September overhaul remain available in the [reasoning index](../index/reasoning.md), [close-everything scope](../specs/close-everything/), and [timeline](../index/timeline.md). They explain prior decisions and snapshots; they do not certify the current candidate. Rig remains one central corpus with agent-led, repository-aware onboarding. See [What Rig is](what-rig-is.md) and [Onboarding flow](onboarding-flow.md).
