# The delivery plan

The active release is the 6.0.0 closeout, delivered through the existing PR
into `qa-prod`, then promoted on automated evidence for the exact QA commit.
The [specification sheet](../specs/close-everything/specification-sheet.md),
[statement of work](../specs/close-everything/statement-of-work.md) and
[task list](../specs/close-everything/task-list.md) govern scope and proof.
Settled owner decisions are in [CLAUDE.md](../../CLAUDE.md).

## Current sequence

Follow the shipped [change-management policy](../../rig/corpus/standards/change-management.md):
freeze a clean candidate, verify the signed oracle, run the full gate, obtain
fresh independent review, verify docs/versions/trackers, deliver through required
QA checks, prove the exact QA commit, publish and verify the release, then close
trackers. Any change invalidates affected evidence.

The deployment checker runs the full test gate and independently validates the
review receipt against the current technical design, catalogue, implementation
and complete frozen acceptance set. A receipt pathname or old passing run is
insufficient. The [owner runbook](../specs/close-everything/owner-runbook.md)
contains concrete release commands.

## Current constraints

The owner has re-signed the test:e2e script amendment, and the 16-file, 95-case
oracle verifies. Existing test results belong to their earlier bytes; the full
gate, final review and required CI evidence must be renewed after cleanup. The public install and tagged-download smoke checks
require the published tag.

PR #153 is on `qa-prod` at `0256c663`. Its closing keywords did not attach, because `prod` is the default branch. Each delivered issue now has a comment naming that SHA and its proving test, and [PR #157](https://github.com/qaynel/Rig/pull/157) carries the keywords so GitHub closes those issues when `qa-prod` merges to `prod`. The five redesign issues stay open for a not-planned closure after the tag. The conflict with `prod` is resolved in `683fbc00`; the August 30 process traces came across as historical records.
[2026-10-24 attachment](../reasoning/2026-10-24-qa-closeout-issue-attachment.md)

The local agent chooses relevant capabilities from one central corpus and
proposes approved grafts into existing repository setup. Optional third-party
skills are fetched selectively; obsolete whole-shelf installation instructions
are historical. See [onboarding](onboarding-flow.md) and
[distribution](distribution-and-release.md).

## History and rationale

The former MVP and its rollout describe v5 history, not the current work list.
Its decisions remain in the [August delivery archive](../archive/2026-08/release-install-and-distribution.md).
The [compacted closeout transcript](../archive/2026-10/close-everything-resume-transcript.md)
preserves owner messages and the execution history without repeated tool output.
Current release findings and cleanup are recorded in
[the readiness checkpoint](../reasoning/2026-10-17-qa-readiness-gate-and-compaction.md).
