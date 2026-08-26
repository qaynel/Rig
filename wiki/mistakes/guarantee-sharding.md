# Guarantee sharding

## The pattern

Splitting one cross-cutting guarantee into independently-branched,
independently-tested tickets, where each ticket's acceptance test proves only
its own named slice. The guarantee quietly narrows to fit whichever branch
got assigned, instead of the branch being scoped to fully prove the
guarantee. Nobody's test — and nobody's job at merge time — covers the seam
between slices, so every branch can go green while the property the epic
exists to deliver is still false.

This is not "insufficient testing." Each branch below has a real, passing
test for exactly what it was asked to prove. The defect is upstream, at
decomposition time, before any code was written.

## The exact example

RIG-115 is the epic for safe, single-use, bounded plan execution in
`rig/lib/lint-format.js`. It was split into sibling branches, one per AT-LF
acceptance case: `rig-115-at-lf-20-single-use-approval`,
`rig-115-at-lf-22-network-denial`, `rig-115-at-lf-24-symlink-escape`,
`rig-115-runreadonly-timeout`, `rig-115-task-isolation`, and later
`rig-124-timeout-duration-investigation`. Three of them shard the same way:

**AT-LF-20 — "one execution per approval."**
Branch `rig-115-at-lf-20-single-use-approval`, `rig/lib/lint-format.js:421,441`:

```js
if (approval.used) { /* refuse */ }
...
approval.used = true;
```

`approval` is a plain JS object; the flag lives only in that object's memory
for the lifetime of the process holding it. A plan/execute flow normally
spans two agent turns in two processes. A second process handed the same
approval sees `used: false` and executes again. The branch's own test passes
because it never crosses a process boundary — nothing in the ticket asked it
to. This project already has a durable pattern for exactly this
([one-use approvals](../topics/one-use-approvals.md), Gate 2 §8.5); the
branch does not use it.

**AT-LF-21/24 — "no symlink escape."**
Branch `rig-115-at-lf-24-symlink-escape` adds `taskCwd(target, rel)`
(`rig/lib/lint-format.js:502`, wrapping `containedPath`) and calls it inside
`runReadOnly` (`:617`). `runGrade` — the function that actually executes
lint/format commands, i.e. the guarantee's central path — still reads
`cwd: cmd.cwd || process.cwd()` at `:528` with no containment call anywhere
in the function. The branch's test passes because it only exercises
`runReadOnly`. The guard exists in the file; it just isn't reachable from the
path that matters most.

**AT-LF-23 — "memory ceiling *or* wall-clock timeout."**
Branch `rig-124-timeout-duration-investigation` implements
`timeout: cmd.timeout_ms || 10 * 60 * 1000` and `ETIMEDOUT` handling. No
`maxBuffer`, `--max-old-space-size`, `ulimit`, or any RSS/cgroup check exists
on this branch or any other. The acceptance text names two independently
lethal conditions; the branch is named for one of them, so that is the only
one that got built.

## Why it passed anyway

Each branch had a correctly-written, correctly-passing test — for a
proposition narrower than the one the acceptance case actually states. Review
at branch level asks "does this test pass," which it does. Nothing asks "does
passing this test, summed with every sibling branch's passing test,
reconstruct the full guarantee" — because no single branch owns that
question, and the epic-level ticket that split the work never enumerated the
call sites, process boundaries, or logical conjuncts the guarantee spans.

This is the same higher-order shape as two entries already in
[`index/traps.md`](../index/traps.md) — a test suite green at a seam the
product never calls, and a validator hardcoded to `failures: []` — and the
open note in [testing strategy](../topics/testing-strategy.md#what-is-still-open):
*a green oracle is not evidence that the product works.* Different mechanism
each time (unreachable module, hardcoded return, under-wired guard, half-built
disjunction); same failure to verify the seam.

## The check

Before a guarantee is split into more than one branch or ticket:

- Enumerate every call site, process boundary, and logical conjunct
  (every "and"/"or" in the acceptance text) the guarantee must hold at.
  Write that list down as part of the ticket, not just the one slice being
  assigned.
- For each branch's acceptance test, ask: "if every sibling branch's test
  also passes, does the union prove the whole list, or just the parts that
  got named?" A "just the parts that got named" answer means the ticket split
  was wrong, not that another branch is needed.
- At merge time, re-run this question against the *current* state of every
  sibling branch, not the state it was in when split — branches drift
  independently, and a seam that was covered when the epic was planned can go
  uncovered silently as branches diverge.

This is a standing check for `rig-grilling` (guarantees should get their
call-site/conjunct list before being split into tickets) and `rig-execution`
(the seam check belongs at the point independent work is verified before a
completion claim), not a one-time fix to these three branches.

It also binds [RIG-120](https://github.com/qaynel/Rig-v0.1/issues/68): the
release ceremony must not treat RIG-115 as Done — or the five `AT-LF-20`–
`AT-LF-24` slices as proving the shell-trust guarantee — until this check
passes against the landed bytes. RIG-138, RIG-139, and RIG-140 are instances
of this pattern, not three independent follow-ups.
