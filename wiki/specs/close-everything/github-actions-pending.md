# GitHub actions pending owner approval

Part of [01 tracker sync](01-tracker-sync.md). **Nothing here has been run.**
GitHub writes are public and immediate; the owner approves, then the commands
are executed from a shell with write access to `qaynel/Rig`. Read-only audit
queries (`gh issue view`, `gh issue list`) were run on 2026-10-13 at HEAD
`051a819c`; the observed state is in the table below and the three phases
depend on it. Re-run the audit before executing; abort a step whose
precondition no longer holds.

```sh
REPO=qaynel/Rig
# Backlog page must resolve for readers. Before the branch merges use the
# branch URL (requires the branch to be pushed); after merge use the qa-prod or prod URL.
BACKLOG_URL="https://github.com/$REPO/blob/vaibhav-kodiyan/universal-issues-closure/wiki/specs/redesign-backlog.md"
```

## Observed state (read-only, 2026-10-13)

| Issue | Item | State now | Needed |
|---|---|---|---|
| #78, #79, #80 | RIG-135.1, .2, .3 | CLOSED, reason **completed** (closing comment says "Not Planned"; not fixed) | reopen |
| #125, #126 | RIG-148, 149 | CLOSED completed, fixed. #125's last comment says "11/12, uninstall red", and describes three `ensure_line` entries; reality is one `ensure_gitignore_block` entry and 3/3 green | corrective evidence comment, no state change |
| #127, #130, #138 | RIG-150, 153, 154 | OPEN, fixed or shipped | close with evidence |
| #62, #63, #42, #43 | RIG-122, 116, 133, 130 | OPEN, no labels, never started | label `redesign`, close not planned |
| none | RIG-155, RIG-156 | no issue exists | create |
| label `redesign` | | does not exist (labels: bug, documentation, duplicate, enhancement, good first issue, help wanted, invalid, question, wontfix) | create |

## Phase A: reversible writes (create, label, reopen)

Run after owner approval. Limited to label creation, issue creation, label
addition and reopening, all reversible.

```sh
# A1. Label
gh label create redesign -R $REPO --color 5319E7 \
  --description "Never started; deferred to the owner's redesign (see redesign backlog)"

# A2. Reopen the three premature closures
gh issue reopen 78 -R $REPO --comment "Reopened 2026-10-13. This was closed as completed (and recorded as Not Planned) but the defect is not fixed: the reasons given (runtime-only, no Windows CI, Bun limitation) are below the close bar the owner set for the close-everything branch. It is fixed on the 6.0.0 branch under subplan 02 (wiki/specs/close-everything/02-bug-fixes.md); this issue closes as completed only after that commit reaches QA."
gh issue reopen 79 -R $REPO --comment "Reopened 2026-10-13. Not fixed; the Bun-native group-kill limitation is a design constraint to solve (for example a node:child_process shim), not a reason to drop the item. Fixed on the 6.0.0 branch under subplan 02; closes as completed only after that commit reaches QA."
gh issue reopen 80 -R $REPO --comment "Reopened 2026-10-13. Not fixed; xvfb.ts still lacks detached: true and a descendant-cleanup contract. Fixed on the 6.0.0 branch under subplan 02; closes as completed only after that commit reaches QA."

# A3. Create the two missing issues
gh issue create -R $REPO --title "RIG-155 — Real-npm clean-container E2E of the customer install path" --body "$(cat <<'EOF'
Tracks wiki/tickets/RIG-155.md (follow-up from RIG-154).

AT-HOME-1 proves the installed rig-mcp server works only through a fake npm shim. Nothing exercises the real customer path: real install, real dependency download, the MCP server starting, a real tool call, and a scoped uninstall, in a clean runner.

Disposition: fix on the 6.0.0 close-everything branch, subplan 06 (wiki/specs/close-everything/06-clean-install-e2e.md), rescoped host-agnostic. Closes as completed only after the commit reaches QA.
EOF
)"
gh issue create -R $REPO --label redesign --title "RIG-156 — (Low priority / deferred) Re-baseline the adaptation score against post-fix Rig" --body "$(cat <<'EOF'
Tracks wiki/tickets/RIG-156.md (RIG-153 option B).

Run the frozen RIG-153 instrument to produce a post-fix per-axis profile against the +12/100 baseline.

Disposition: redesign. Never started; owner deferred to the redesign, 2026-10-13. Listed on the redesign backlog. Closed as not planned; not a delivered fix.
EOF
)"
# Record the two new issue numbers in wiki/Tickets.md and the ticket files afterwards.

# A4. Label the four existing deferred issues
gh issue edit 62 63 42 43 -R $REPO --add-label redesign
```

## Phase B: closures with recorded evidence

Run when the evidence below is on the branch and the backlog page resolves at
`$BACKLOG_URL`. Replace `<NEW_156>` with the issue number created in A3.
Verified-fixed items close as completed; redesign items close as not planned.

```sh
# B1. Previously shipped, verified on HEAD 051a819c (tests re-run 2026-10-13)
gh issue close 127 -R $REPO --reason completed --comment "Verified fixed. Evidence: tests/installed-router-hygiene.test.js::RIG-150 — rig.md implementation rule names the skill, not a raw .rig/ path; tests/basic-payload-gating.test.js::RIG-150 — rig.md reference resolves after claude-only install. Both files run 13/13 green (installed-router-hygiene 7, basic-payload-gating 6). Board and ticket reconciled in the close-everything tracker sync."
gh issue close 130 -R $REPO --reason completed --comment "Delivered: option A, the frozen instrument (592f4eed). Evidence: tests/installed-router-hygiene.test.js (six RIG-148 to 152 defect-shape blocks, incl. 'RIG-149 — prefix self-collision guard is present for the rig router skill' and 'RIG-148 — manifest writes a gitignore block for Rig-owned install paths') and wiki/specs/adaptation-measurement-rubric.md. Option B (the re-baseline run) is carved out as RIG-156 (#<NEW_156>), deferred to the redesign."
gh issue close 138 -R $REPO --reason completed --comment "Shipped in PR #140 (a15d4267, merged to qa-prod 2026-08-31). Evidence: tests/rig-mcp-bootstrap.test.js::root pretest bootstraps rig-mcp dependencies when absent; tests/rig-mcp-bootstrap.test.js::CI relies on the root pretest bootstrap instead of a duplicate install step. Real-npm clean-container follow-up is RIG-155."

# B2. Corrective evidence on already-closed issues (no state change)
gh issue comment 125 -R $REPO --body "Correction 2026-10-13. The earlier comment (11/12, uninstall red, three ensure_line entries) is stale. Current state: one ensure_gitignore_block manifest entry (ensureGitignoreBlock, rig/lib/payload.js); uninstall removal is implemented in rig/lib/lifecycle.js. Evidence, all green on HEAD 051a819c: tests/rig-bootstrap.test.js::RIG-148 — default Claude install writes a .gitignore block covering Rig-owned paths; ::RIG-148 — gitignore block is idempotent: re-running bootstrap does not duplicate it; ::RIG-148 — uninstall removes the gitignore block and preserves pre-existing user content; tests/installed-router-hygiene.test.js::RIG-148 — manifest writes a gitignore block for Rig-owned install paths."
gh issue comment 126 -R $REPO --body "Verified 2026-10-13. Evidence green on HEAD 051a819c: tests/rig-bootstrap.test.js::vendored rig router installs addressable as 'rig' on native hosts, matching routing.md fallback (RIG-149); tests/installed-router-hygiene.test.js::RIG-149 — prefix self-collision guard is present for the rig router skill."

# B3. Redesign deferrals: close as not planned with a backlog link
for n in 62 63 42 43 <NEW_156>; do
  gh issue close $n -R $REPO --reason "not planned" --comment "Closed as not planned, label redesign. Never started; owner deferred to the redesign, 2026-10-13. Listed with reasons on the redesign backlog: $BACKLOG_URL. This is a deferral, not a delivered fix."
done
```

## Phase C: newly fixed items, after the fix reaches QA

Not executable yet. Each closes as completed only after the exact commit
containing its proving test reaches QA (01 approach, step 3). Fill the SHA and
test name from the subplan handover, then run:

```sh
# For each of: 69 (RIG-127.11), 70 (RIG-127.12), 78, 79, 80 (RIG-135.1-.3),
# 108 (RIG-145), 109 (RIG-146), 110 (RIG-147), <NEW_155> (RIG-155)
gh issue close <N> -R $REPO --reason completed --comment "Fixed in <QA_SHA> (QA). Proving test: <tests/file.test.js::exact title>."
```

## After execution

- Add the RIG-155 and RIG-156 issue numbers to the board cards and ticket files.
- Re-run the live read-only audit (`gh issue list --state all --json number,state,stateReason,labels`) and confirm: no issue closed as completed without a fix; every closed issue has a comment naming a test, commit or backlog entry; the redesign backlog lists exactly RIG-116, 122, 130, 133, 156.
- The sync check from [08](08-coherence-and-upkeep.md) makes this permanent.
