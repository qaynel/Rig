---
date: 2026-10-13
source: agent
topics: the-overhaul, agent-working-conventions
decisions:
status: current
supersedes:
tags: audit, tracker-sync
summary: Reality audit of every tracker item for the close-everything branch — 5 trackers disagree with the code, 6 concrete defects are genuinely open, 4 items are blocked on owner-only inputs, 4 are structural, 3 browse-runtime items were closed below the owner's new bar; no tracker state changed yet.
---

# Close-everything — reality audit (HEAD 051a819c)

Checked against code and tests, not against either tracker.

## Trackers wrong in the "already done" direction (close/move to Done)

| Item | Evidence |
|---|---|
| RIG-148 (gitignore) | `payload.js` `ensureGitignoreBlock` ships; GitHub closed, board still OPEN. |
| RIG-149 (`rig-rig`) | Guarded; `rig-bootstrap.test.js` + `installed-router-hygiene.test.js` assert it. GitHub closed, board OPEN. |
| RIG-150 (rules path) | `basic-payload-gating` + `installed-router-hygiene` RIG-150 cases green (13/13). Ticket file and GitHub still OPEN. |
| RIG-153 (adaptation instrument) | Ticket DONE; GitHub #130 still OPEN. |
| RIG-154 (fresh-checkout npm test) | Shipped PR #140 / a15d4267; GitHub #138 still OPEN. |

## Genuinely open — concrete defects (fix)

- RIG-127.11 — `removeGlobalConfig` still calls raw `JSON.parse` unguarded.
- RIG-127.12 — nameless `managed_block` still falls back to `[^\n]*` wildcard.
- RIG-145 — `runReadOnly` still returns one batch status on first ungranted command.
- RIG-147 — `check-runner.js:198` still `console.warn`s.
- RIG-146 — frozen AT-LF-20 still reuses one approval object (needs re-sign; batch).
- RIG-155 — no real-npm clean-container E2E exists (board-only; no GitHub issue).

## Owner-gated (blocked on inputs only the owner holds)

- RIG-110 — first-wire proofs need real host access the owner controls.
- RIG-112 — catalogue contract waits on owner freeze.
- RIG-113 — lint-format replacement policy waits on owner approval.
- RIG-116 — waits on post-beta demand evidence.

## Structural (overlap the deferred redesign)

RIG-125, RIG-130, RIG-132, RIG-133. RIG-125 and RIG-132 are partly landed.

## Deferred / product-gated

RIG-122 (wiki as a tool family), RIG-156 (re-baseline adaptation score).

## Closed below the owner's 2026-10-13 bar

RIG-135.1/.2/.3 — browse-skill runtime defects closed "Not Planned" on
"runtime-only / low priority / upstream limitation" grounds, and GitHub marks
them COMPLETED (wrong reason code either way). Under "code is cheap, fix
everything" these reopen unless a replaced-by reason exists.

## Hygiene drift

Done-lane cards unchecked; RIG-122 duplicated on the board; RIG-155/156 have no
GitHub issue.

## Not a defect

`onboarding-hardening.test.js` AT-HD-7 fails when run standalone because
`rig-mcp/node_modules` is absent; the root `pretest` bootstraps it. Hardening
oracle otherwise 7/8 green standalone. Path B hardening is landed on qa-prod.
