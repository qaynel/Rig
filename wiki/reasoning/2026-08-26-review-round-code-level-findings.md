---
date: 2026-08-26
source: review
topics: enforcement-and-git-dispatch-wiring, host-and-ci-coverage, testing-strategy, distribution-and-release
decisions:
---

Owner asked for the review again ("try again") after the 2026-08-25 gate-red
finding. Two things happened in this session, in order — recording both
because the first one was wrong for a reason worth keeping on record.

## First pass: reproduced red, wrongly, against a stale checkout

`npm test` on the local `qa-prod-finishing-up` checkout reproduced the same 26
failures as 2026-08-25 exactly. A four-axis code review (spec/scope,
correctness, architecture, test gaps) was run against that checkout and found
real-looking defects tracing to [[RIG-126]], [[RIG-127]], [[RIG-128]],
[[RIG-129]], [[RIG-131]].

This was wrong. The owner then said: "I pulled in the resolution of 6
tickets" — prompting a check of `git log HEAD..origin/qa-prod-finishing-up`,
which showed the **local checkout was 11 commits behind the remote branch of
the same name**. Five ticket PRs (#28 RIG-129, #29 RIG-128, #30 RIG-131, #31
RIG-127, #32 RIG-126) plus the closing PR (#34, RIG-134 gate lock) had all
already been reviewed and merged into `origin/qa-prod-finishing-up` on GitHub
the previous day. The owner's "I pulled them into this branch" referred to
that GitHub-side merge; the local workspace had never fetched it. Every
failing test in both the 2026-08-25 and this session's first-pass report was
therefore a stale-checkout artifact, not a real defect in the merged work —
**the owner's original claim was correct.**

Fixed by: `git stash push -u` (preserved the pre-pull working tree, including
this session's own edits, rather than discarding them — see stash entry
`pre-pull-2026-08-26`, not yet dropped, pending owner review), then
`git merge --ff-only origin/qa-prod-finishing-up` (clean fast-forward, no
conflicts), then a full dependency install and re-run.

## Second pass: real state, verified

Post-pull, `npm test` is fully green: root suite 474/474, pi-extension suite
15/15, `rig-mcp` suite 6/6. [[RIG-126]], [[RIG-127]], [[RIG-128]], [[RIG-129]],
[[RIG-131]], and [[RIG-134]] all show `READY FOR COMMIT` on the real,
now-current ticket board — six tickets, matching the owner's count exactly.

The four-axis review was re-run by hand against the real, current code (not
re-delegated, to avoid re-spending the same investigation) — specifically
checking whether the defects found in the first pass still exist in the
merged version, since a green suite does not by itself prove a defect was
fixed; it only proves the tests that exist pass.

**Confirmed fixed by the real merge** (no longer present, or now covered by a
passing test): the `contractFor`/`mcp-hosts.js` descriptor-writer parity gap,
the repo-level JSON merge writer's fail-open behavior, the missing
`host-review`/`select` onboarding commands, the pi capability mis-citation,
and the traceability checker itself now exists and runs. These are exactly
what the six merged PRs claim to have done, and the evidence now agrees.

**Still open, unowned or under-covered, confirmed present in the real
current code:**

- **[[RIG-127]] 127.11 (new, GitHub #69) — uninstall can hard-crash on a corrupted legacy
  global config.** `removeGlobalConfig()` in `global-writes.js:198-204` calls
  `readJson()` at line 200 (raw `JSON.parse`, no try/catch). There is one
  unguarded call site: `uninstall()` in `lifecycle.js:187`, at line 222;
  `uninstall.js`'s `uninstall()` only delegates to it, it does not add a
  second call. A corrupted global file throws uncaught mid-uninstall. No test
  feeds a corrupted global file into an uninstall run, so the now-green suite
  does not exercise this path. The sibling function for the same failure mode
  (`removeGlobalMcp`, `global-writes.js:173-176`) already catches it; this
  one doesn't.
- **[[RIG-127]] 127.12 (new, GitHub #70) — legacy pre-RIG-104 managed-block records
  over-strip.** `lifecycle.js:280-286`: a record with no block name falls
  back to a wildcard regex (global flag) matching *any* managed block in the
  file, not just the one the record owns. Narrow — only affects an upgrade
  path from a pre-RIG-104 install — but real.
- **Unowned — `rig/mcp-runtime/` is an uncalled-for duplicate of the
  `rig-mcp/` package tree, and the duplicate copy of the shared instruction
  bundle has already diverged from the canonical one** (confirmed by diff:
  57 lines of difference, missing whole sections). Introduced in commit
  `716875c` (2026-08-24, the OpenClaw global MCP opt-in work), predates every
  one of the six merged tickets, so none of them touched it. No ticket
  currently owns this; needs an owner call.
- 127.10's adjacent gap stands as before: the linked-worktree roundtrip test
  runs the sequence that would catch a leftover `.rig/install-id` but never
  asserts on it.
- [[RIG-132]]'s ratchet-title naming drift (packet says one test title, the
  shipped test uses another; [[RIG-131]]'s checker doesn't catch the
  mismatch because [[RIG-132]]'s acceptance section doesn't use the checked
  arrow format) — unaffected by the pull, still true, low severity.

## Bottom line

The branch is genuinely green and the six tickets genuinely earned
`READY FOR COMMIT` — the owner's report was accurate throughout; the gap was
a local checkout that hadn't fetched the merge. Three items remain unowned or
uncovered by any current test: a crash path and an over-broad deletion inside
the newly-hardened uninstall path, and a duplicated, already-diverged
instruction bundle with no ticket. None of the three shows up as a red test
today, which is exactly why they were still there after six tickets went
green.
