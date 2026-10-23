# QA and production closeout

The [standalone compatibility freeze](../reasoning/2026-10-23-standalone-compatibility-final-freeze.md) records the final shared-seam repair: only an actual adjacent fix/verifier pair advances inputs; standalone mutation and preceding read-only steps keep their correct semantics. Execution callers pass140 host/66 Linux, final Linux autofix/dispatch19/19 and oracle16/95. Complete verification and a fresh passing receipt on final bytes remain before push/required PR checks. Original criteria/counter12 are intact; no owner command or QA readiness is claimed.

The [previous repaired-candidate checkpoint](../reasoning/2026-10-22-repaired-candidate-final-freeze.md) and [scope](../specs/close-everything/2026-10-22-qa-closure-scope.md) retain all eighteen finding mappings, cross-review and macOS/Linux evidence. The [unchanged acceptance criteria with ledger](../specs/close-everything/2026-10-21-code-mode-review-acceptance.md) remains the closure bar. Run `.context/qa-closure/handoff.sh`; [HANDOFF.md](../../.context/qa-closure/HANDOFF.md) preserves model recovery. No new signing action is required. Current-byte full npm, fresh passing binding receipt and required exact-head PR checks remain delivery gates.

The GitHub test job was red on Linux for three runner-only reasons (shallow checkout, `CI=true` output mode, bwrap loopback errno), none visible on macOS; the [diagnosis](../reasoning/2026-10-23-ci-red-linux-runner-diagnosis.md) records each cause and fix. The workflows now check out full history and run the suite with the CI markers hidden, because it asserts local-mode output.

## Current release checkpoint

The [October 21 code-mode review](../reasoning/2026-10-21-code-mode-binding-review-result.md) failed with four blockers and fourteen major findings. The [rejected report](../sources/reviews/v6.0.0-2026-10-21-code-mode.failed.review.json) and attempt history are preserved. All eighteen findings now have reviewed regression evidence in the closure ledger. The signed oracle is valid; the remaining delivery conditions are a full npm pass on final committed bytes, a fresh exact-byte passing review receipt, and green required checks on the pushed PR head.

Finding13's supported-provider execution remains honestly `unverified/first_run_required` wherever no real execution exists, as its acceptance contract permits; this never substitutes for GitHub PR checks. The release candidate is `6.0.0`. Follow the ordered [deployment policy](../../rig/corpus/standards/change-management.md) and [closeout task list](../specs/close-everything/task-list.md). Production promotion requires automated health plus real-download clean-install evidence on the exact QA commit. No evidence carries across candidate changes.

## Historical records

Earlier October closeouts and the September overhaul remain available in the [reasoning index](../index/reasoning.md), [close-everything scope](../specs/close-everything/), and [timeline](../index/timeline.md). They explain prior decisions and snapshots; they do not certify the current candidate. Rig remains one central corpus with agent-led, repository-aware onboarding. See [What Rig is](what-rig-is.md) and [Onboarding flow](onboarding-flow.md).
