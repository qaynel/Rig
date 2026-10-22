# QA and production closeout

The [owner-signature handoff](../reasoning/2026-10-22-qa-closure-owner-signature-handoff.md) records213 macOS and43 Linux passing acceptance cases, a passing66-issue live coherence gate, and recoverable next commands. Human signing precedes the final npm gate, binding review and push.

The [2026-10-22 closure scope and recovery handoff](../specs/close-everything/2026-10-22-qa-closure-scope.md) maps all eighteen findings to proof and owners. Run the read-only state report at `.context/qa-closure/handoff.sh`; instructions are in [HANDOFF.md](../../.context/qa-closure/HANDOFF.md).

## Current release checkpoint

The [October 21 code-mode review](../reasoning/2026-10-21-code-mode-binding-review-result.md) failed with four blockers and fourteen major findings. The [rejected report](../sources/reviews/v6.0.0-2026-10-21-code-mode.failed.review.json) is preserved; no passing receipt exists and the counter is ten. The unchanged [acceptance checklist](../specs/close-everything/2026-10-21-code-mode-review-acceptance.md) has eighteen open rows.

Historical `.context/full-main-final-candidate.log` recorded 1,246 passes and 11 failures; most have focused repairs. Current focused evidence is Linux/Bubblewrap 25/25, macOS 36/36, Pi 15/15, MCP 6/6, five native YAML parses and seven adapter checks, runtime 3/3, spawn-guard 6/6, and CI floor 3/3. The current `.context/qa-closure/full-main.log` remains in progress. `.context/qa-closure/full-npm.log` stops before test code at the stale frozen Gate 1 digest for `tests/advanced-oracle.test.js`. No green full gate, current passing review receipt, QA-prod readiness or production promotion is claimed. All findings remain open pending remaining proof, final candidate reconciliation and binding review. The exact human signing command is preserved in the [scope](../specs/close-everything/2026-10-22-qa-closure-scope.md) and [handoff](../../.context/qa-closure/HANDOFF.md).

The [latest dispatch renewal trace](../reasoning/2026-10-21-acceptance-dispatch-renewal-progress.md) records broad adversarial work; the [October 22 checkpoint](../reasoning/2026-10-22-qa-closure-evidence-checkpoint.md) updates repaired focused evidence. Treat every result as limited to its exact command and bytes. Finding 13's supported-provider real first run remains `first_run_required` wherever no real execution is available; unavailable remote credentials are not by themselves an owner blocker.

The release candidate is `6.0.0`. After all finding-specific proof is reviewed, run the final gate on the exact candidate, obtain the owner-authorized fresh binding receipt, and follow the ordered [deployment policy](../../rig/corpus/standards/change-management.md) and [closeout task list](../specs/close-everything/task-list.md). No evidence carries across candidate changes.

## Historical records

Earlier October closeouts and the September overhaul remain available in the [reasoning index](../index/reasoning.md), [close-everything scope](../specs/close-everything/), and [timeline](../index/timeline.md). They explain prior decisions and snapshots; they do not certify the current candidate. Rig remains one central corpus with agent-led, repository-aware onboarding. See [What Rig is](what-rig-is.md) and [Onboarding flow](onboarding-flow.md).
