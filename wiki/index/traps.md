# Traps

Things that have already cost this project time. Every one was discovered the
hard way. Read this before believing anything looks fine.

---

## The suite is green and means nothing

This was true of all 19 `tests/advanced-*.test.js` files as of 2026-08-19: 238
tests passed, `advanced-catalogue` and `advanced-services` passed 6/6, and 432
files still contained `TODO(Slice 10)`. Most of those files assert inventory
and non-emptiness, and a file containing the literal text `TODO` is
non-empty — calibrated to pass against placeholder content, not a foundation
to extend.

One leaf has since broken this pattern on purpose:
`advanced-lint-format.test.js` was rewritten to reject `TODO`/placeholder
content and exercise the real formatter/linter/CI-fix commands, and
`advanced-apply.test.js` exercises apply's real manifest/resume mechanics
(see [status](../status.md)). The other 18 files and 428 remaining
`TODO(Slice 10)` fragments are still exactly this trap. A green suite still
tells you nothing until a given file is checked against this list.

## `node --test <missing-file>` exits 0

It prints `Could not find` and returns success. A traceability row naming a
deleted test file therefore reads as green.

Gate 2 §13 and §10 require stat-ing every named target and asserting each
actually reported results. **Implement that; do not trust exit codes.**

## `npm test` has no specification gate

Until Slice 1 lands, green tells you nothing about specification health. The gate
that is supposed to run first and short-circuit the code tests does not exist —
`scripts/check-advanced-spec.js` has never been written.

## The default branch is `prod`

`origin/main` does not exist. Conductor's workspace metadata says `main` and is
wrong. Nothing may reference `main` or `master` — not a workflow, not a CI
config, not a release script.

D10 removed the branch dependency from Gate 1 integrity, but the branch name
still governs CI configuration and release tagging.

## Commit `8dcaa49` is mislabelled

Titled "Implement Advanced a-la-carte catalogue and delivery CLI". It actually
contains the 432 placeholders and an implementation built against a design that
was subsequently withdrawn. Do not read it as delivered work.

## `scripts/uninstall.js` is not a head start

Leftover from an older, unrelated plugin. It deletes a config file and a
status-line entry. It has nothing to do with the uninstall feature D11 describes.

## A live review receipt can look like a stale one

Through 2026-08-20, `gate2-v0.5-round3` in [`sources/reviews/`](../sources/reviews/)
was bound to the **current** technical-spec digest with verdict fail, while the
other two receipts there were void — bound to superseded bytes. It is easy to
skim the void/live split by which receipt is oldest and get it backwards; the
habit of treating receipts as historical was correct for the first two and
wrong for the third. (Editing Gate 2 to resolve round-3's blocker finding has
since voided round-3 too — see [status](../status.md) — so as of this writing
all three are void. The lesson still applies to whatever the next live receipt
is.) Always compare `target_digest` against the live file before concluding
anything.

## A matching digest over stale content is worse than a stale one

If Gate 2's header is re-pinned to current Gate 1 digests while its body is still
written against an older case set, the document *looks* current and is not. Do
not re-pin ahead of rewriting.

## Concurrent sessions edit these files

A session on another machine has amended Gate 1 and Gate 2 while another had
uncommitted changes. It merged cleanly, but re-read before editing and re-check
digests after. Do not assume the bytes you loaded are still the bytes on disk.

## `rg` is not installed

Use `grep -RIn`.

## Freeze blockers and release blockers are different lists

Conflating them deadlocks the project: Gate 2 cannot freeze until the work it
authorises is finished, and that work cannot start until it freezes. Version 0.2
had exactly that shape.

Gate 2 §17.1 lists freeze blockers — properties of the *document*, checkable
against the specification alone. §17.2 lists release blockers — properties of the
*built product*. **Do not merge them back together.**

## A partially applied control must never report as enabled

While an install's manifest header says `complete: false`, `policy status`, the
install line, and every run report must state the install is incomplete and
report no control as enabled, installed, or protecting anything. An incomplete
baseline that reports itself active is the exact failure D14 exists to prevent.
