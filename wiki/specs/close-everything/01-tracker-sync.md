# 01 — Tracker sync

Part of the [master plan](00-master-plan.md). Goal: GitHub issues, the wiki
board (`wiki/Tickets.md`), and ticket files (`wiki/tickets/RIG-*.md`) agree
with code and release evidence.

## Current state (read-only audit, 2026-10-17)

The board and ticket files are reconciled to the candidate. GitHub Phase A is
complete: `redesign` exists and is on the five deferred issues, #78–80 are
reopened, and RIG-155/#151 plus RIG-156/#152 exist. No delivered issue has been
closed for this release yet. The current issue-by-issue state and guarded
commands are in [github-actions-pending.md](github-actions-pending.md); the
declared source for expected current and target states is
[`tracker-transitions.json`](tracker-transitions.json).

The owner chose to run tracker closures only after exact-SHA QA promotion, tag
and release publication, and the public tagged-download smoke test. Until that
sequence passes, leave delivered and redesign issues open. This follows the
[change-management policy](../../../rig/corpus/standards/change-management.md)
and the owner's [Q4 answer](owner-questionnaire.md).

| Work | Current disposition | Next step |
|---|---|---|
| Phase A setup | Complete and confirmed by live read-only audit | No repeat writes |
| Delivered issues | Open until QA, release tag, and tagged-download smoke pass | Close as completed with promoted QA SHA and exact proving test |
| Redesign issues: RIG-116, 122, 130, 133, 156 | Open with `redesign` label | Close as not planned with item-specific reason and backlog link |
| #125 / RIG-148 | Already closed completed; old comment is stale | Add one marked correction with final implementation and test evidence |
| #126 / RIG-149 | Already closed completed; implementation noted, test evidence missing | Add one marked final evidence comment |

The five redesign rationales are listed in the [redesign backlog](../redesign-backlog.md)
and repeated in the guarded closure instructions. The `redesign` label records
the deferral; the issue body alone is not the closure justification. Every
closed issue must have a comment that names a test, promoted commit, or the
backlog entry as appropriate.

## Acceptance

- For every RIG ID, issue state, board lane, ticket-file state, and declared
  transition match release reality.
- Delivered work is closed as completed only after its exact proving commit is
  in the release; each close comment names the QA SHA and a test.
- The five never-started items are closed as not planned, retain the
  `redesign` label, and have specific owner-deferral reasons linked to the
  backlog.
- No issue is closed before QA promotion, release tag publication, and a
  passing public tagged-download smoke test.
- The coherence check verifies the declared tracker transitions against GitHub
  and the local tickets.

## Historical pre-sync snapshot (2026-10-13, HEAD `051a819c`)

This table is retained as an audit record only. Its actions are superseded by
the current state and post-release procedure above; do not execute them.

| Item | GitHub then | Local board/ticket then | Finding then |
|---|---|---|---|
| RIG-148 / #125 | Closed completed | Board OPEN | Later board reconciliation found the fix delivered; the old issue comment is now known stale |
| RIG-149 / #126 | Closed completed | Board OPEN | Later board reconciliation found the router fix delivered |
| RIG-150 / #127 | Open | Done, unchecked / ticket OPEN | Fix had evidence but issue closure was pending |
| RIG-153 / #130 | Open | Done, unchecked / ticket DONE | Instrument was delivered; issue closure was pending |
| RIG-154 / #138 | Open | Done, unchecked / ticket CLOSED | Bootstrap fix shipped; issue closure was pending |
| RIG-135.1–.3 / #78–80 | Closed completed | Board said Not Planned | Findings were not fixed; Phase A reopened them |
| RIG-155 | No issue | Board and ticket OPEN | Later created as #151 |
| RIG-156 | No issue | Board and ticket OPEN | Later created as #152 and labeled `redesign` |
| RIG-116, 122, 130, 133 | Open | Mixed local lanes | Later labeled `redesign`; closure waits for post-release step |

The original 2026-10-13 local reconciliation is recorded in
[the tracker-sync trace](../../reasoning/2026-10-13-close-everything-tracker-sync-local.md).
The subsequent audit and exact closeout sequence are maintained in
[github-actions-pending.md](github-actions-pending.md).
