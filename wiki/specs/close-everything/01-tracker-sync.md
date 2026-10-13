# 01 — Tracker sync

Part of the [master plan](00-master-plan.md). **Goal:** GitHub issues, the
wiki board (`wiki/Tickets.md`), and each ticket file (`wiki/tickets/RIG-*.md`)
agree with the code, item by item. Reality wins: if the board is ahead of the
code, revert the card; if a GitHub issue was closed too early, reopen it.

**Local half done 2026-10-13** ([trace](../../reasoning/2026-10-13-close-everything-tracker-sync-local.md)):
the [redesign backlog](../redesign-backlog.md) exists, the board and ticket files
are reconciled, and the GitHub writes are prepared but not run in
[github-actions-pending](github-actions-pending.md). The table below is the
pre-sync audit.

## Current state (audited 2026-10-13 at 051a819c)

| Item | GitHub | Board | Ticket file | Reality | Action |
|---|---|---|---|---|---|
| RIG-148 | closed #125 | OPEN | — | fixed (`ensureGitignoreBlock`) | board → Done, checked |
| RIG-149 | closed #126 | OPEN | — | fixed (router installs as `rig`) | board → Done, checked |
| RIG-150 | open #127 | Done, unchecked | OPEN | fixed (13/13 green) | close #127 with test names; ticket → Done |
| RIG-153 | open #130 | Done, unchecked | DONE | shipped instrument | close #130 |
| RIG-154 | open #138 | Done, unchecked | CLOSED | shipped PR #140 | close #138 |
| RIG-135.1–.3 | closed as COMPLETED #78–80 | closed "Not Planned" | — | not fixed; reason below the bar | reopen #78–80; fixed in [02](02-bug-fixes.md) |
| RIG-155 | none | OPEN | OPEN | not built | open a GitHub issue; fixed in [06](06-clean-install-e2e.md) |
| RIG-156 | none | OPEN | OPEN | never started | create issue, then close with `redesign` and backlog link |
| RIG-116, 122, 130, 133 | open | various | various | never started | label `redesign`, close as not planned with a link to the backlog page |
| RIG-122 | — | duplicated card | — | — | remove duplicate |
| every Done card | — | `- [ ]` | — | — | check `- [x]` |

## Approach

1. **Redesign backlog page.** Create `wiki/specs/redesign-backlog.md` with one
   section per deferred item: what it is, why it is deferred ("never started;
   owner deferred to the redesign, 2026-10-13"), and links to its ticket and
   any analysis. Give RIG-156 a GitHub issue so every backlog item has one.
2. **Board edits.** Reconcile already-shipped work immediately. Work on this
   branch stays open with a declared ready-for-QA state until it reaches QA.
   Record disposition, proving evidence, and target commit separately from
   delivery state. Deferred work uses the redesign disposition, not fixed.
3. **GitHub edits, in two phases:**
   - **Now:** reopen #78–80 with a comment explaining why. Create the RIG-155
     and RIG-156 issues. Add the `redesign` label to the five deferred items.
   - **At ship ([10](10-review-sign-ship.md)):** close each fixed or deferred
     issue with a comment naming the proving test, commit, or backlog entry.
     Close newly fixed issues only after the corresponding commit reaches QA.
     Close verified previously shipped items and redesign deferrals when their
     evidence/disposition is recorded. Validate the declared state transition
     before merge and the live tracker state after QA delivery.
4. The **sync check** in [08](08-coherence-and-upkeep.md) makes this
   permanent.

## Acceptance

- For every `RIG-*` id, the GitHub state, board lane, and ticket-file status
  agree. The sync check from 08 passes.
- Every closed issue has a closing comment naming a test, commit, or backlog
  entry.
- No GitHub issue is closed with reason COMPLETED unless a fix shipped.
- The redesign backlog page lists exactly RIG-116, 122, 130, 133, and 156.

## Risks

- GitHub writes are public and immediate. Phase-1 writes are limited to
  reopen, create, and label actions, all reversible.
