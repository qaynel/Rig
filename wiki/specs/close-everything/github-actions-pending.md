# GitHub tracker closeout

Part of [01 tracker sync](01-tracker-sync.md). This file records the attachment
done on 2026-10-24 and the owner-run closure procedure that is still waiting on
the tag. The owner chose to close issues only after the exact QA commit is
promoted, the release tag is published, and the public tagged-download smoke
test passes ([owner answer Q4](owner-questionnaire.md)). Follow step 8 of the
[change-management policy](../../../rig/corpus/standards/change-management.md).

## Attached 2026-10-24, not closed

QA merge `0256c663` (PR #153) listed closing keywords. GitHub did not attach
them because `qa-prod` is not the default branch. On 2026-10-24 each delivered
issue received a `[rig-qa-attach:…]` comment naming that SHA and the proving
test below. #125 and #126 received their `[rig-closeout:…]` corrections.
Redesign issues received deferral comments and are not closing keywords.

[PR #157](https://github.com/qaynel/Rig/pull/157) now carries `Closes` for the
delivered issues, so they close as completed when `qa-prod` merges to `prod`.
Until that merge, live state stays open and matches the candidate
`github_from` column. Do not close them by hand before the promotion. The
redesign five still close as not planned only after the tag and smoke test.
Detail: [2026-10-24 attachment](../../reasoning/2026-10-24-qa-closeout-issue-attachment.md).

## Current read-only audit (2026-10-17)

Audited through GitHub issue reads for `qaynel/Rig` after the 6.0.0 work was
prepared. Re-read every issue immediately before any write; a changed
precondition means stop and reconcile the board, ticket, and
[`tracker-transitions.json`](tracker-transitions.json) first.

| Issues | Rig items | Live state | Current disposition |
|---|---|---|---|
| #62, #63, #42, #43, #152 | RIG-122, 116, 133, 130, 156 | OPEN; each has `redesign` | Phase A complete; close as not planned after tag and download smoke |
| #78–80 | RIG-135.1–.3 | OPEN; reason `reopened` | Phase A complete; delivered fixes await QA and post-tag closure |
| #151 | RIG-155 | OPEN | Issue created; delivered fix awaits QA and post-tag closure |
| #127, #130, #138 | RIG-150, 153, 154 | OPEN | Delivered evidence is on the candidate; close after tag and smoke |
| #69–70, #108–110 | RIG-127.11–.12, RIG-145–147 | OPEN | Delivered fixes await QA and post-tag closure |
| #154–156 | RIG-157–159 | OPEN | Delivered release, coherence, and standards work awaits QA and post-tag closure |
| #125, #126 | RIG-148, RIG-149 | CLOSED as completed | #125 has a stale earlier comment; add corrected evidence once. #126 has implementation comments; add final test evidence once. |

Phase A is complete: the `redesign` label exists; #62, #63, #42, #43 and #152
carry it; #78–80 are reopened; and RIG-155/#151 and RIG-156/#152 exist and are
linked from the local board and ticket files. No Phase B or C closure has been
run. The corrective comments on #125 and #126 were posted on 2026-10-24 with
marker `[rig-closeout:RIG-148]` and `[rig-closeout:RIG-149]`; the idempotent
helper below will not add a second copy.

## Redesign closure reasons

These five items were never started and are deferred to the owner's redesign.
They close as **not planned**, retain the `redesign` label, and link to the
[backlog](../redesign-backlog.md). They are not delivered fixes.

| Issue | Item | Reason to include in the closing comment |
|---|---|---|
| #63 | RIG-116 | Promotion of other families beyond Policy needs observed beta demand; the redesign must decide the prune-to-stack direction first. The delivered catalogue work in subplan 04 does not implement this demand-ranked programme. |
| #62 | RIG-122 | The optional wiki-knowledge graft depends on the product vision for what Rig installs; the redesign owns that product decision. |
| #43 | RIG-130 | The finding-class ledger and convergence stopping rule change the review loop and were never approved for Coding or started. |
| #42 | RIG-133 | Replacing enumerated acceptance samples with signed properties and a generator changes the oracle signing design; this release instead uses the owner's batched re-sign of the existing oracle. |
| #152 | RIG-156 | A post-fix adaptation re-baseline has low information until adaptive integration exists; it was carved out of RIG-153 with unresolved target-copy, direction, SHA, judge, and model prerequisites. |

The backlog contains the full rationale and source links for each item. The
closing comment should name the item's specific reason above, say it was never
started and deferred by the owner, and link to the backlog. Do not use one
generic comment that obscures why an item is deferred.

## Post-release preconditions

Run this read-only check immediately before closure. All conditions must hold:

1. QA promotion used the exact approved QA SHA and its automated health run is
   green.
2. The `v6.0.0` GitHub release exists for that promoted commit.
3. T-6.8's public tagged-download smoke test and T-9.7's documented install
   flow have passed against that release.
4. The downloaded archive and installed product identify the same release tag.
5. Every delivered issue has a proving test recorded in the ticket/board, and
   each redesign issue is still open and labeled `redesign`.

```sh
set -eu
REPO=qaynel/Rig
TAG=v6.0.0

gh release view "$TAG" -R "$REPO" --json tagName,targetCommitish
gh run list -R "$REPO" --workflow release-eligibility.yml --limit 10
# Compare the release target with the promoted QA SHA and inspect the exact-SHA
# health/E2E run. Confirm T-6.8 and T-9.7 evidence before proceeding.
gh issue list -R "$REPO" --state all --limit 1000 \
  --json number,state,stateReason,labels,title
```

## Idempotent closure commands

Only run after every post-release precondition above passes. The helpers skip
issues already closed with the requested reason, add a marked comment only if
that marker is absent, and stop if a live state or label differs from the
read-only audit. A partial run can therefore be re-run safely after checking
the resulting issue state.

```sh
set -eu
REPO=qaynel/Rig
BACKLOG_URL="https://github.com/$REPO/blob/v6.0.0/wiki/specs/redesign-backlog.md"
: "${QA_SHA:?Set QA_SHA to the full promoted commit before running closures}"
test "${#QA_SHA}" -eq 40
case "$QA_SHA" in *[!0-9a-f]*) echo 'QA_SHA must be a full lowercase commit hash' >&2; exit 1 ;; esac

issue_json() {
  gh issue view "$1" -R "$REPO" --json state,stateReason,labels
}

comment_once() {
  issue=$1
  marker=$2
  body=$3
  seen=$(gh api "repos/$REPO/issues/$issue/comments" --paginate \
    --jq "any(.[]; .body | contains(\"$marker\"))")
  case "$seen" in *true*) return 0 ;; esac
  gh issue comment "$issue" -R "$REPO" --body "$body"
}

close_not_planned() {
  issue=$1
  marker=$2
  body=$3
  current=$(issue_json "$issue")
  state=$(printf '%s' "$current" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).state))')
  reason=$(printf '%s' "$current" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).stateReason||""))')
  labeled=$(printf '%s' "$current" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).labels.some(x=>x.name==="redesign")))')
  if [ "$state" = CLOSED ] && [ "$reason" = NOT_PLANNED ]; then
    comment_once "$issue" "$marker" "$body"
    return 0
  fi
  if [ "$state" != OPEN ] || [ "$labeled" != true ]; then
    echo "Refusing issue #$issue: expected OPEN with redesign label" >&2
    return 1
  fi
  gh issue close "$issue" -R "$REPO" --reason "not planned" --comment "$body"
}

close_completed() {
  issue=$1
  marker=$2
  evidence=$3
  body="$marker Fixed in $QA_SHA (QA). Proving evidence: $evidence"
  current=$(issue_json "$issue")
  state=$(printf '%s' "$current" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).state))')
  reason=$(printf '%s' "$current" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).stateReason||""))')
  if [ "$state" = CLOSED ] && [ "$reason" = COMPLETED ]; then
    comment_once "$issue" "$marker" "$body"
    return 0
  fi
  if [ "$state" != OPEN ]; then
    echo "Refusing issue #$issue: expected OPEN or CLOSED as completed" >&2
    return 1
  fi
  gh issue close "$issue" -R "$REPO" --reason completed --comment "$body"
}

# Redesign issues: each closing comment keeps the item's own deferral reason.
close_not_planned 63 '[rig-closeout:RIG-116]' "[rig-closeout:RIG-116] Never started; deferred to the owner's redesign. Beta demand and the prune-to-stack direction must determine which families are promoted beyond Policy. Catalogue completion in subplan 04 does not deliver this demand-ranked programme. Backlog: $BACKLOG_URL"
close_not_planned 62 '[rig-closeout:RIG-122]' "[rig-closeout:RIG-122] Never started; deferred to the owner's redesign. The optional wiki-knowledge graft depends on the product vision for what Rig installs. Backlog: $BACKLOG_URL"
close_not_planned 43 '[rig-closeout:RIG-130]' "[rig-closeout:RIG-130] Never started; deferred to the owner's redesign. The finding-class ledger and convergence stopping rule change the review loop and were never approved for Coding. Backlog: $BACKLOG_URL"
close_not_planned 42 '[rig-closeout:RIG-133]' "[rig-closeout:RIG-133] Never started; deferred to the owner's redesign. Replacing enumerated samples with signed properties and a generator changes oracle signing; this release uses the owner's batched re-sign of the existing oracle. Backlog: $BACKLOG_URL"
close_not_planned 152 '[rig-closeout:RIG-156]' "[rig-closeout:RIG-156] Never started; deferred to the owner's redesign. Re-baselining has low information before adaptive integration and still needs a clean target, chosen direction, pinned SHA, judge, and model. Backlog: $BACKLOG_URL"

# Correct stale historical comments on already-closed delivered issues once.
comment_once 125 '[rig-closeout:RIG-148]' '[rig-closeout:RIG-148] Correction: the delivered implementation uses one ensure_gitignore_block manifest entry; uninstall removes the owned block and preserves user content. Evidence on the promoted QA SHA: tests/rig-bootstrap.test.js (default install, idempotence, uninstall preservation) and tests/installed-router-hygiene.test.js (manifest contract).'
comment_once 126 '[rig-closeout:RIG-149]' '[rig-closeout:RIG-149] Final evidence on the promoted QA SHA: tests/installed-router-hygiene.test.js::RIG-149 — the routing fallback projects the skill it names on native hosts. The current router is rig-router.'

# Delivered issues: provide exact `tests/file.test.js::test title` evidence
# from the matching ticket's Done section before calling each helper.
# Example: close_completed 127 '[rig-closeout:RIG-150]' 'tests/...::...'
```

The table of still-open delivered issues is above. Add one `close_completed`
call for each after substituting the exact test title and confirming the test is
on `$QA_SHA`: #127, #130, #138, #69, #70, #78, #79, #80, #108, #109, #110,
#151, #154, #155, and #156. Do not close #125 or #126 again; their state is
already correct. The final live audit must agree with
[`tracker-transitions.json`](tracker-transitions.json), `wiki/Tickets.md`, and
the ticket files; the [coherence check](08-coherence-and-upkeep.md) is the
repeatable proof.

Before the post-release writes, record actual delivery for newly shipped items
in the board, ticket files and transition declarations together (`state: delivered`,
`github_to: CLOSED/COMPLETED`). Their current `open` declarations are intentional
pre-release states, not promises that closure already happened. Run coherence
in candidate mode before the writes and `--delivered` afterward.

Use these proof references for the prepared calls, after verifying each on
`$QA_SHA`; workflow evidence supplements unit tests where specified:

| Issue | Proving reference |
|---|---|
| #69 | `tests/install-uninstall-roundtrip.test.js::RIG-127.11 uninstall leaves a corrupted global config byte-identical and reports it best-effort` |
| #70 | `tests/install-uninstall-roundtrip.test.js::RIG-127.12 a legacy nameless managed-block record strips only the block Rig appended` |
| #78 | `tests/browse-cookie-import-descendants.test.js::no descendant survives a successful import (RIG-135.1)`; include platform CI |
| #79 | `tests/browse-skill-spawn-descendants.test.js::a timed-out browse skill leaves no forked descendant (RIG-135.2)`; include platform CI |
| #80 | `tests/browse-xvfb-descendants.test.js::stopping Xvfb leaves no process from its group (RIG-135.3)`; requires Linux evidence |
| #108 | `tests/guarantee-coverage.test.js::AT-PROC-1ac (RIG-145): runReadOnly confines each command and executes only the explicitly network-granted command` |
| #109 | `tests/advanced-oracle.test.js::AT-LF-20 a plan approval authorizes exactly one execution`; `tests/guarantee-coverage.test.js::AT-PROC-1a (AT-LF-20): signed approval replay is refused and a fresh approval can rerun the unchanged plan` |
| #110 | `tests/guarantee-coverage.test.js::AT-PROC-1ad (RIG-147): the library runner stays silent on an undeclared network; the installed CLI warns once` |
| #127 | `tests/installed-router-hygiene.test.js::RIG-150 — rig.md implementation rule names the skill, not a raw .rig/ path` |
| #130 | `tests/standards-contracts.test.js::adaptation rubric preserves distinct gates axes repeatability and calibration ceiling`; RIG-156 remains a redesign deferral |
| #138 | `tests/rig-mcp-bootstrap.test.js::root pretest bootstraps rig-mcp dependencies when absent` |
| #151 | Exact-SHA Linux/macOS clean-install workflow plus post-tag download evidence |
| #154 | Exact-QA release-eligibility and health run URLs, including clean-install E2E |
| #155 | `tests/coherence.test.js::repository check runs coherence and executed-test evidence gates` |
| #156 | `tests/ai-sdlc-standards.test.js::installed runtime ships standards and its checker and grafts existing docs` |

## Historical pre-sync audit (2026-10-13)

This snapshot is retained as history only; none of its pending Phase A commands
should be run again. Phase A was later completed and the current audit above is
authoritative.

At HEAD `051a819c`, #78–80 were closed prematurely as completed, redesign
issues #62/#63/#42/#43 were open without the label, and RIG-155/156 had no
GitHub issue. #125's comment reported 11/12 with the uninstall case red even
though the later fix landed. The local Phase A record is
[`01-tracker-sync.md`](01-tracker-sync.md); the historic command plan was
replaced by the guarded post-release steps above.
