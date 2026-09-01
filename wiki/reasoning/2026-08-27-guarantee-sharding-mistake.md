---
date: 2026-08-27
source: agent
topics: trust-and-failure-boundaries, one-use-approvals, testing-strategy
decisions:
status: historical
---

The user pasted a transcript from a separate session reporting three findings
against `rig/lib/lint-format.js`:

1. AT-LF-20's "one execution per approval" sets `approval.used = true` on an
   in-memory JS object with no persistence — it does not survive a process
   boundary, which is how a real plan/execute flow actually runs.
2. AT-LF-21/24's symlink-containment check is wired into `runReadOnly` only.
   `runGrade` — the path that actually runs lint/format commands — still uses
   `cmd.cwd` unguarded, leaving the same escape open on the guarantee's more
   central execution path.
3. AT-LF-23's acceptance text requires both a memory ceiling and a wall-clock
   timeout; only the timeout is implemented or tested anywhere in the diff.

Asked whether this was symptomatic of something larger, I checked the current
branch (`diagnose-error-root-cause`, at `b54db94`) and found none of these
three mechanisms exist there at all — no `.used` field, no `taskCwd`, no
containment call in `runReadOnly` or `runGrade`. The transcript was not
describing this branch. `git branch -a` showed a cluster of sibling branches
under the RIG-115 epic, one per AT-LF case:
`rig-115-at-lf-20-single-use-approval`, `rig-115-at-lf-22-network-denial`,
`rig-115-at-lf-24-symlink-escape`, `rig-115-runreadonly-timeout`,
`rig-115-task-isolation`, plus a later `rig-124-timeout-duration-investigation`.

I checked each named branch's copy of `rig/lib/lint-format.js` directly:

- `rig-115-at-lf-20-single-use-approval`: line 421 checks `approval.used`,
  line 441 sets `approval.used = true`. Confirmed in-memory only — no write to
  disk, no clone-local store, nothing that would be visible in a second
  process holding the same approval object. This project already has a
  durable one-use pattern documented at Gate 2 §8.5
  ([one-use approvals](../topics/one-use-approvals.md)); this branch does not
  use it.
- `rig-115-at-lf-24-symlink-escape`: line 502 defines `taskCwd(target, rel)`
  wrapping `containedPath`; line 617 calls it inside `runReadOnly`. `runGrade`
  at line 528 still reads `cwd: cmd.cwd || process.cwd()` with no call to
  `taskCwd` or `containedPath` anywhere in the function. Confirmed: the guard
  exists in the file and is wired to exactly one of the two commands paths
  that need it.
- `rig-124-timeout-duration-investigation`: only `timeout: cmd.timeout_ms ||
  10 * 60 * 1000` and `ETIMEDOUT` handling exist. No `maxBuffer`, no
  `--max-old-space-size`, no `ulimit`, no RSS/cgroup check, on this branch or
  any other branch I found. AT-LF-23's "or" requirement is half-built,
  everywhere.

## The generalization

This is not three unrelated implementation bugs, each fixable in isolation.
It is one decomposition mistake recurring three times: **a single
cross-cutting guarantee was split into independently-branched,
independently-tested tickets, and each ticket's acceptance test proves only
its own named slice, not the guarantee.** Nobody's test, and nobody's job at
merge time, covers the seam between slices — so every branch can be green
while the guarantee the epic exists to deliver is still false.

Concretely, in each case the *acceptance case narrowed to fit the branch*
instead of the branch being scoped to fully prove the acceptance case:

- AT-LF-24 says "no symlink escape." The branch proved "no symlink escape in
  `runReadOnly`" without anyone asking whether `.cwd` is consumed anywhere
  else — it is, in `runGrade`, which is the path that does the guarantee's
  actual work.
- AT-LF-23 says "memory ceiling or timeout." The branch that got built is
  literally named for the timeout half, so that is the only half that has a
  test.
- AT-LF-20 says "one execution per approval." The branch proved it within one
  process lifetime because nothing in the ticket asked what "approval" means
  once a process boundary is crossed — which is the normal case for a
  plan/execute flow that spans two agent turns.

This is the same higher-order failure already on record in this wiki, just
with a different mechanism each time:

- [Traps](../index/traps.md): "The oracle is green at a seam the product does
  not use" — ten modules with passing tests and zero production callers.
- [Traps](../index/traps.md): "A validator that returns `failures: []` as a
  literal" — a check that could not fail for any input, because it never
  read what it claimed to verify.
- [Testing strategy](../topics/testing-strategy.md#what-is-still-open): "A
  green oracle is not evidence that the product works," stated as the
  successor to the inventory-only trap.

Four occurrences across unrelated guarantees, unrelated implementers, and
unrelated mechanisms (an unreachable module, a hardcoded return, an
under-wired guard, a half-built "or") means the failure sits upstream of any
one implementation: it is in the step where a guarantee gets divided into
tickets, before any code is written. `rig-grilling` turns intent into
acceptance criteria; nothing at that step currently asks "list every call
site and process boundary this guarantee must hold at" before the guarantee
is split into independently-assignable branches. `rig-execution` verifies
evidence before a completion claim on independent work; nothing at that step
currently re-checks the seams between branches once each branch's own test is
green.

## Naming it

Filed as [`mistakes/guarantee-sharding.md`](../mistakes/guarantee-sharding.md)
— a new wiki directory for named anti-patterns with a direct, concrete
example each, distinct from `index/traps.md`'s chronological narrative log.
The user asked for this explicitly: an example-driven "do not do this"
reference agents can consult before decomposing a guarantee into branches,
not another paragraph buried in a mixed list.
