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
[RIG-138 / #93](https://github.com/qaynel/Rig/issues/93).
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
[RIG-139 / #94](https://github.com/qaynel/Rig/issues/94).
Branch `rig-115-at-lf-24-symlink-escape` adds `taskCwd(target, rel)`
(`rig/lib/lint-format.js:502`, wrapping `containedPath`) and calls it inside
`runReadOnly` (`:617`). `runGrade` — the function that actually executes
lint/format commands, i.e. the guarantee's central path — still reads
`cwd: cmd.cwd || process.cwd()` at `:528` with no containment call anywhere
in the function. The branch's test passes because it only exercises
`runReadOnly`. The guard exists in the file; it just isn't reachable from the
path that matters most.

**AT-LF-23 — "memory ceiling *or* wall-clock timeout."**
[RIG-140 / #95](https://github.com/qaynel/Rig/issues/95).
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

## Acceptance criteria (AT-PROC-1)

A workflow-doctrine acceptance criterion, not a Gate 1 product case — it does
not touch the frozen 68-case oracle or its set-equality gate
([`index/acceptance-cases.md`](../index/acceptance-cases.md)), and needs no
owner signature to exist or change. It governs how a guarantee may be split
into branches, the same way `rig-grilling`/`rig-execution` govern process
rather than product behavior.

**Given** a guarantee stated in acceptance text spans more than one call site
and/or more than one logical conjunct (every "and"/"or" in the text), **and**
implementation of that guarantee is split across more than one branch or PR:
**pass** requires the union of every sibling branch's passing tests to
exercise each enumerated call site and each conjunct independently — there
must exist at least one test that fails if that site or conjunct alone
regresses. **Fail** is any call site or conjunct with zero test that would
catch it regressing alone, checked both when the guarantee is first split
(`rig-grilling`) and again at merge time against the landed bytes, not the
plan-time snapshot (`rig-execution`).

Executable target: [`tests/guarantee-coverage.test.js`](../../tests/guarantee-coverage.test.js)
turns the four worked examples above into real, non-tautological regression
tests against `rig/lib/lint-format.js`:

| Sub-case | Proves | Status on this branch (2026-08-28) |
|---|---|---|
| `AT-PROC-1a` | AT-LF-20 survives an independently-constructed approval object for the same `plan_digest`, not just the object the caller happened to mutate. | **Green.** `executePlan` now durably consumes the approval under `target/.rig/lint-format/executions/<digest>.json` via an atomic exclusive create, keyed by `plan_digest` rather than object identity. |
| `AT-PROC-1b` | `runGrade` refuses a `cwd` that escapes the repository via a symlink, at parity with `runReadOnly`. | **Green.** `runGrade` now takes a `target` parameter and both functions route through a shared `taskCwd()` wrapping `containedPath`. |
| `AT-PROC-1c` | A command exceeding a declared `memory_limit_mb` is killed and reported as `memory_exceeded`, distinct from `timeout`. | **Green.** See the enforcement-design note below. |
| `AT-PROC-1d` | `runGrade` applies AT-LF-22's network isolation to ungranted commands, refuses with `network_isolation_unavailable` when the host cannot provide it, and still runs explicitly granted commands. | **Green (2026-08-28).** `runGrade` now shares `argvWithNetworkIsolation` and its per-command grant gate with `runReadOnly`; the regression test covers isolation and unavailable-tool paths. |

These were deliberately red by design as TDD specs for what RIG-138/139/140/143
had to turn green, not assertions that the fix already existed — the fix
landed on this branch (commit implementing this section) rather than by
merging any of the five sibling `rig-115-at-lf-*` branches as-is, since those
branches' own tests were the narrow slices this page is about. A skipped or
vacuously-passing version of any of the three would have repeated the exact
mistake this page is named for.

**Enforcement design for AT-LF-23.** `spawnSync` (what `runGrade` and
`runReadOnly` use, and what the frozen `tests/advanced-oracle.test.js`
requires them to keep using — see below) blocks the caller's event loop until
the child exits, so nothing in that call can observe an intermediate RSS
sample. A hard kernel cap (`RLIMIT_AS`) avoids that problem but is only
reliably enforced on Linux, not macOS, and there is no POSIX-rlimit
equivalent on Windows. The chosen design is a polling watchdog delegated to a
separate process, [`rig/lib/memory-guarded-exec.js`](../../rig/lib/memory-guarded-exec.js):
it spawns the real command asynchronously, samples RSS via `ps -o rss=` every
15ms, and `SIGKILL`s on crossing `memory_limit_mb`, reporting the outcome
through a result file. The caller (`runCommand` in `lint-format.js`) stays a
plain, synchronous `spawnSync` on this wrapper — enforcement moved to a
different process, not to a different (async) calling convention. This is
still a best-effort cap, not a kernel guarantee: a single allocation fast
enough to complete inside one poll interval can still land before the kill
signal does. `AT-PROC-1c`'s fixture allocates in twenty 10MB chunks with a
short pause between each rather than one instant burst, both because that is
closer to how a real runaway process actually grows and because the first
version of this fixture (one instant 200MB `Buffer.alloc`) was flaky —
roughly 1-in-8 local runs raced past the watchdog before the first poll fired.

**Constraint discovered during implementation, not before.** The first
implementation attempt made `runGrade`/`runReadOnly` `async` (needed for live
RSS polling with a plain in-process `setInterval`), which broke four tests in
`tests/advanced-oracle.test.js` — `AT-LF-7`, `AT-LF-8`, `AT-LF-9`, `AT-LF-11`
— because that file is a frozen Gate 1 testing-infrastructure file
(`wiki/gate1/testing-infrastructure.manifest`, digest-checked by
`scripts/check-advanced-spec.js`) that calls both functions synchronously and
cannot be edited by an implementer. The separate-process watchdog design
above was adopted specifically to keep both functions synchronous and avoid
touching frozen files. Add "does the fix change a frozen call site's sync/async
contract" to the call-site/conjunct enumeration this page's check already
asks for — this branch's own attempt is a fourth instance of the same family
of oversight, caught by `npm test` before landing rather than after.

It also binds [RIG-120 / #68](https://github.com/qaynel/Rig/issues/68): the
release ceremony must not treat RIG-115 as Done — or the five `AT-LF-20`–
`AT-LF-24` slices as proving the shell-trust guarantee — until this check
passes against the landed bytes. [RIG-138 / #93](https://github.com/qaynel/Rig/issues/93),
[RIG-139 / #94](https://github.com/qaynel/Rig/issues/94), and
[RIG-140 / #95](https://github.com/qaynel/Rig/issues/95) are closed by this
fix landing with `tests/guarantee-coverage.test.js` green and the full gate
passing.
