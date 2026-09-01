---
date: 2026-08-20
source: agent
topics: install-manifest-removal, delivery-plan, testing-strategy
decisions: AD-10
status: historical
---

Picked up a handoff from the lint-format vertical-slice session: its
AT-INSTALL-1 probe (interrupt an apply mid-write) failed — a late apply
failure rolled back already-applied lint-format writes and produced no
incomplete manifest at all. The task was to resolve AT-INSTALL-1 before any
further work.

## What this actually was

Not a fresh bug. `wiki/status.md`, `wiki/topics/install-manifest-removal.md`,
and the round-3 review receipt already documented this as the live Gate 2
blocker: §6.6/§10 (and AD-10) prescribed a full transactional rollback on any
apply failure, while §7.6 and Gate 1's frozen `AT-INSTALL-1` require the
opposite for the identical trigger — applied writes stay, the manifest
records how far the install got, and re-running resumes. The lint-format
probe was deliberately built to force this contradiction out of the spec and
into running code, per
[the vertical-slice handoff](2026-08-19-lint-format-vertical-slice.md). It
did exactly that: `rig/lib/apply.js` had a `backups`/`created`-tracking
rollback in its `catch` block and no `install-manifest.jsonl` mechanism
anywhere in the codebase.

## Why this wasn't actually an open design question

`wiki/index/rejected.md` already lists "transactional install with automatic
rollback as a second teardown path" as rejected at the business-spec level
(GA-12), for exactly the reason transactional installers are known to fail:
a failed rollback leaves worse debris than the original failure. Gate 2's
§6.6/§10/AD-10 rollback language was an unreconciled leftover of a decision
Gate 1 had already made the other way. There was no real tradeoff to weigh —
the manifest-and-resume model in §7.6 was always the intended single model;
it just hadn't propagated to §6.6/§10/AD-10 or to the implementation.

I checked the alternative before ruling it out: keep two models, rollback
only when a prior *complete* install already exists to protect (so a later
re-apply against a working install could safely revert), resume-only for a
first-ever transition-install. Gate 1's `AT-INSTALL-1` text is written
specifically about "a transition-install that fails partway," which doesn't
rule this split out on its face. But it adds a boundary nobody asked for and
Gate 1 gives no acceptance case that exercises re-apply-onto-a-complete-install
as its own scenario — and the rejected-approaches entry above rejects a
second teardown path outright, not just for the first-install case. Presented
this choice to the intent owner; the one-model resolution (manifest-and-resume
always, no rollback branch at all) was confirmed.

## What changed

**Gate 2 candidate** (`wiki/gate2/technical-spec.md`, digest now
`4926f253…`, was `c0333c36…`):
- AD-10: rollback replaced with the §7.6 manifest and no-rollback/resume
  description.
- §6.6 Apply: the four-bullet rollback list replaced with a paragraph
  describing record-before-mutate manifest writes and resume-on-retry, with
  the reasoning (rejected second teardown path) stated inline so it doesn't
  regress again.
- §10 Partial failure row: reworded to match.
- §2.1 Rejected approaches: added the rollback-as-second-teardown-path entry
  explicitly to this file, so it's not only recoverable via the Gate 1/GA-12
  citation.

Gate 1 was not touched. This edit resolves only the round-3 **blocker**
finding; three findings (two major, one minor) from that review remain open,
and a fresh round-4 review has not been run — Gate 2 is still a failed
candidate, just on fewer findings than before. See `wiki/status.md`.

**Implementation** (`rig/lib/apply.js`):
- Added `getInstallId` (clone-local, under `git rev-parse --git-path rig`,
  generated once, never committed — the existing D3/AD-25 identity pattern,
  reused rather than reinvented) and an append-only
  `.rig/install-manifest.jsonl` reader/writer.
- `writeOwned` now writes a `pending` manifest record, performs the write,
  then writes an `applied` record carrying the post-write digest. On resume,
  a path already `applied` whose on-disk digest still matches is skipped —
  no rewrite, no duplicate manifest entry.
- `ensureLineOwned` (the `AGENTS.md` pointer graft) now records ownership as
  `append_managed` rather than the default `create_owned`/`replace_owned`
  inference, since it is a §7.1 user-owned-file append, not a Rig-owned
  replace.
- The `catch` block no longer restores backups or deletes created files. It
  releases the lock and rethrows. `.rig/catalog-receipt.json` is still the
  last write, so its absence is the existing, already-truthful "not
  installed" signal — no separate `complete: false` header field was needed
  to represent that.
- Deliberately **not** built here: preimage content-addressed storage and the
  reverse-walk removal/uninstall path. Both are §7.6 features, but neither is
  needed to make an interrupted *apply* resume correctly, which is what
  AT-INSTALL-1 and this task were scoped to. They remain Slice 12's job
  (install resume **and complete removal** — the removal half is still
  unbuilt). Scoping this narrowly was a deliberate choice given the intent
  owner's own retrospective
  ([2026-08-20-first-attempt-retrospective.md](2026-08-20-first-attempt-retrospective.md))
  about over-building governance ahead of a proven need.

**Tests:**
- `tests/advanced-apply.test.js`: rewrote the test that had asserted the old
  rollback behavior (`apply rolls back host adapter and git hook writes on
  failure`) into `apply keeps host adapter and git hook writes in place on
  failure and resumes (AT-INSTALL-1)`. It forces a real write failure (a
  directory sitting where the receipt file needs to go), asserts writes
  before that point survive, then clears the obstruction and asserts resume
  completes without re-chaining the already-chained git hook backup.
- `tests/advanced-lint-format.test.js`: added a new probe re-running the
  vertical slice's own acceptance probe 3 directly — interrupt a lint-format
  apply (directory collision on `.rig/service-bindings.json`), assert
  earlier writes and their manifest `applied` records survive and no receipt
  exists, then clear the obstruction and assert resume completes with no
  duplicated manifest entry for a path applied before the interruption.
- Full `npm test` is green (264/264 in the main suite, 15/15 in
  pi-extension). One unrelated pre-existing failure
  (`csv: correct pandas one-liner passes` in `tests/correctness.test.js`)
  was confirmed present on the unmodified branch before this change and is
  not touched by it.

## What's still open

Round-3 findings 2–4 (AD-30/§8.4 vs D19; §1/`AT-BASE-2` vs §11.1/AD-26;
§8.8 vs `AT-SECRET-1`), a round-4 review, Gate 1 signing, and the Gate 2
freeze itself. See `wiki/status.md#ordered-next-steps`.
