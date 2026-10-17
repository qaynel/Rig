# QA and production closeout

This page points to the current closeout record. September's overhaul work is
history; it is not a live set of open product decisions. The settled direction
remains one central corpus with agent-led, repository-aware onboarding. See
[What Rig is](what-rig-is.md) and [Onboarding flow](onboarding-flow.md).

## Current release checkpoint

The release candidate is `6.0.0`. Follow the ordered
[deployment policy](../../rig/corpus/standards/change-management.md) and the
[closeout task list](../specs/close-everything/task-list.md); old green results
do not carry across a change to the candidate bytes.

The owner re-signed the package-scripts amendment on 2026-10-17.
`node scripts/check-advanced-spec.js` verifies 16 files and 95 acceptance cases.
The full gate and fresh review receipt are now being renewed on the final
candidate bytes.
The [owner's answers](../reasoning/2026-10-17-change-management-policy-and-doc-deduplication.md)
record this approval sequence.

After the signed oracle verifies, the remaining release steps are:

1. Run `npm test` and create a fresh review receipt against the same final
   bytes.
2. Deliver the candidate through the existing QA PR with `gate1-pin` required,
   then run automated health and real-download clean-install checks against the
   exact QA commit.
3. Promote and tag the verified commit. Close fixed and redesign issues only
   after QA promotion and the tag, with the recorded disposition.

The policy is the operational checklist; the task list holds per-item evidence
and owner-only actions. Do not use the earlier October 14 closure traces as
evidence for the present candidate: they document earlier bytes and runs.

## September workstream record

The 2026-09 workstream diagnosed a costly delivery loop, product-positioning
questions, and an unbounded wiki read path. Its evidence and rejected approaches
remain in the [structural workflow design](../reasoning/2026-09-04-structural-workflow-fix-design.md),
[grilling answers](../reasoning/2026-09-04-structural-workflow-fix-grilling.md),
[closed-loop design](../reasoning/2026-09-02-closed-loop-workflow-and-context-realignment.md),
and [finished-product design](../reasoning/2026-09-04-finished-product-design.md).
These are historical sources, not open decisions for the 6.0.0 closeout.

## Current-session evidence

The [owner request](../reasoning/2026-10-17-qa-readiness-owner-request.md) resumes
the approved closeout. Evidence: [inventory](../reasoning/2026-10-17-qa-readiness-inventory.md),
[gate and compaction repairs](../reasoning/2026-10-17-qa-readiness-gate-and-compaction.md),
[verification start](../reasoning/2026-10-17-qa-readiness-verification-start.md),
and [independent review corrections](../reasoning/2026-10-17-qa-readiness-review-corrections.md).
The [owner signing reply](../reasoning/2026-10-17-qa-readiness-owner-signed.md)
and [verified signed candidate](../reasoning/2026-10-17-qa-readiness-signed-candidate.md)
supersede the earlier signing blocker. Earlier passing results do not establish
readiness for the current bytes.

The [full-gate/network reproduction](../reasoning/2026-10-17-qa-readiness-network-reproduction.md)
records the first signed run's five failures and the verified-mirror retry.
No release is claimed from the earlier focused passes.
