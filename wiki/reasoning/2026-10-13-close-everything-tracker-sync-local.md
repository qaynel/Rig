---
date: 2026-10-13
source: agent
topics: the-overhaul, agent-working-conventions
decisions:
status: current
supersedes:
tags: tracker-sync, interdependency
summary: Local half of close-everything subplan 01 done — redesign backlog page, board and ticket files reconciled against code and tests, GitHub command list prepared but not run; three discrepancies found against the plan's table.
---

# Close-everything 01 — tracker sync, local half

Done at HEAD `051a819c` plus the branch's uncommitted work. No GitHub write was
made; read-only `gh` queries only.

## Reality checks run before editing

- RIG-148: `ensureGitignoreBlock` exists in `rig/lib/payload.js` (one
  `ensure_gitignore_block` manifest op); three `tests/rig-bootstrap.test.js`
  RIG-148 cases and the hygiene case pass.
- RIG-149: `tests/rig-bootstrap.test.js` case "vendored rig router installs
  addressable as 'rig'..." passes; hygiene guard passes.
- RIG-150: `tests/installed-router-hygiene.test.js` (7) plus
  `tests/basic-payload-gating.test.js` (6) = 13/13. The plan's "13/13" is these
  two files together, not one file.
- RIG-153: instrument commit `592f4eed` is an ancestor of HEAD. RIG-154: PR #140
  merged to qa-prod, `a15d4267` is an ancestor of HEAD; both rig-mcp-bootstrap
  tests pass.
- GitHub (read-only): #78-80 CLOSED with reason COMPLETED; #127, #130, #138 OPEN;
  #62, #63, #42, #43 OPEN with no labels; no RIG-155/156 issue; no `redesign`
  label exists.

## Discrepancies against the plan's table

1. The board's #78-80 cards say "Closed - Not Planned", but GitHub's close
   reason is COMPLETED (the comment text says Not Planned). Two trackers
   disagreed on the reason, not just the state.
2. GitHub #125's last comment is stale: it reports 11/12 with uninstall red and
   three `ensure_line` entries. Reality: one `ensure_gitignore_block` entry and
   the uninstall test is green. The plan did not list this; a corrective
   comment is in the pending-actions page.
3. Every Done card, not only the five named, had `- [ ]` (31 cards, 33 with the moved RIG-148/149); all are
   now `- [x]`. RIG-149's ticket had a failing-format `## Acceptance` (two
   sections, a "RED on HEAD" line) and RIG-148's had no evidence bullets, so
   moving them to Done needed ticket edits for the traceability gate to stay
   green. The board also carried RIG-122 twice.

## What changed

- Created `wiki/specs/redesign-backlog.md` (exactly RIG-116, 122, 130, 133, 156).
- `wiki/Tickets.md`: RIG-148/149 moved to Done with test evidence; RIG-135.1-.3
  reverted to open (reopen pending); duplicate RIG-122 removed; Done cards
  checked; each card on the close-everything ledger gained a
  `Disposition / Delivery / QA delivery` line so disposition, candidate delivery
  state and actual QA delivery are recorded separately. Nothing on this branch
  is marked closed; fix items read "not yet ready-for-QA".
- Ticket files: 148, 149 (acceptance evidence), 150 (header Done), 154 (GitHub
  #138), 135 (reopen note), 155, 156, 116, 122, 130, 133 (disposition line).
- Created `wiki/specs/close-everything/github-actions-pending.md`: three phases
  (reversible writes; closures with evidence; closures after QA), none executed.
  The backlog link needs the branch pushed or merged to resolve; the page uses
  a `$BACKLOG_URL` variable for that reason.

## Left alone

RIG-132, 125, 110, 112, 113 stay in Blocked with their old text. The master
ledger routes them to subplans 03-05, which own those lane moves. They carry a
disposition line only.

## Next

Owner approves the GitHub phases; subplan 08's sync check makes the agreement
permanent; subplan 10 reconciles the live tracker after QA delivery.
