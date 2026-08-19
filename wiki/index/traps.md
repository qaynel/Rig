# Traps

Things that have already cost this project time. Every one was discovered the
hard way. Read this before believing anything looks fine.

---

## The suite is green and means nothing

238 tests pass. `advanced-catalogue` and `advanced-services` pass 6/6. And **432
files still contain `TODO(Slice 10)`**.

The 19 `tests/advanced-*.test.js` files assert inventory and non-emptiness, and a
file containing the literal text `TODO` is non-empty. They are calibrated to pass
against placeholder content. They are not a foundation to extend — a meaningful
rewrite has to make most of them fail first.

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

Three receipts sit in [`sources/reviews/`](../sources/reviews/). Two are void —
bound to superseded bytes. The third, `gate2-v0.5-round3`, is bound to the
**current** technical-spec digest, and its verdict is fail.

The habit of treating receipts as historical is correct for the first two and
wrong for the third. Always compare `target_digest` against the live file before
concluding anything.

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
