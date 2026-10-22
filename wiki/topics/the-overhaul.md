# QA and production closeout

The [repaired-candidate freeze](../reasoning/2026-10-22-repaired-candidate-final-freeze.md) records all eighteen finding rows reconciled after seven binding-review repairs and actual Linux follow-ups. Signature16/95 is valid. Focused evidence includes Linux25/25+44/44, root public Linux34/34/macOS55/55 and final Linux signed-network/signal/inventory15/15. Final committed full npm, fresh exact-byte receipt and required exact-head PR checks remain delivery gates; no current release approval is claimed.

The [scope](../specs/close-everything/2026-10-22-qa-closure-scope.md) and [unchanged acceptance criteria with ledger](../specs/close-everything/2026-10-21-code-mode-review-acceptance.md) hold evidence and remaining commands. Run `.context/qa-closure/handoff.sh`; [HANDOFF.md](../../.context/qa-closure/HANDOFF.md) preserves model recovery. No new human signing step is required.

## Current release checkpoint

The [October 21 code-mode review](../reasoning/2026-10-21-code-mode-binding-review-result.md) failed with four blockers and fourteen major findings. The [rejected report](../sources/reviews/v6.0.0-2026-10-21-code-mode.failed.review.json) and attempt history are preserved. All eighteen findings now have reviewed regression evidence in the closure ledger. The signed oracle is valid; the remaining delivery conditions are a full npm pass on final committed bytes, a fresh exact-byte passing review receipt, and green required checks on the pushed PR head.

Finding13's supported-provider execution remains honestly `unverified/first_run_required` wherever no real execution exists, as its acceptance contract permits; this never substitutes for GitHub PR checks. The release candidate is `6.0.0`. Follow the ordered [deployment policy](../../rig/corpus/standards/change-management.md) and [closeout task list](../specs/close-everything/task-list.md). Production promotion requires automated health plus real-download clean-install evidence on the exact QA commit. No evidence carries across candidate changes.

## Historical records

Earlier October closeouts and the September overhaul remain available in the [reasoning index](../index/reasoning.md), [close-everything scope](../specs/close-everything/), and [timeline](../index/timeline.md). They explain prior decisions and snapshots; they do not certify the current candidate. Rig remains one central corpus with agent-led, repository-aware onboarding. See [What Rig is](what-rig-is.md) and [Onboarding flow](onboarding-flow.md).
