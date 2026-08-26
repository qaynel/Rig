# Testing strategy

## What it is

Testing begins with Gate 1's independent acceptance cases, transcribes them into
an executable specification gate, then implements behavior in tracer-bullet
slices. Development runs are diff-scoped, CI is whole-repository, and dependent
testing rungs fail fast while reporting later rungs as not run. CI runs selected
executable services only when they are repo-CI-applicable at their active grade;
for lint-format, that means Evidence only. [Gate 2 §9.2 and §13–14](../gate2/technical-spec.md#13-acceptance-traceability)

## Why it is this way

The existing green suite proves inventory and non-emptiness rather than the
frozen behavior, so extending it would preserve false confidence. Exact ID-set
equality, required target existence, result-count assertions, and semantic
service review make omission visible. [Known traps](../index/traps.md)

## What binds it

`G7`–`G9` define Rig's TDD, debugging, and independent-review doctrine. `AD-18`
drives the executable oracle, and every Gate 2 §13 row names a mechanism and
target. [Foundational log](../sources/logs/grill-decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Implementation-authored acceptance, trusting exit status alone, file-presence
tests, no-op bindings, parallel template authoring, and a missing target counting
as pass were rejected. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen oracle: [Gate 1 acceptance](../gate1/acceptance.md)
- Traceability and slices: [Gate 2 §13–14](../gate2/technical-spec.md#13-acceptance-traceability)
- Captured testing sources: [testing vision](../sources/reference/testing-pipeline-vision.raw.md) and [mutation taxonomy](../sources/reference/mutation-testing-taxonomy.raw.md)
- First real interrupted-apply evidence: [AT-INSTALL-1 resolution trace](../reasoning/2026-08-20-resolve-at-install-1.md)
- Cleanup survey rulings: [reasoning trace](../reasoning/2026-08-20-cleanup-survey-decisions.md)

## What is still open

The executable specification gate now exists and runs first:
`node scripts/check-advanced-spec.js` verifies the owner signature over the
five-file manifest before any code test, and the 73 cases (D24 + D28) report
73 pass / 0 fail. That closes the gap this section used to describe and opens
a different one.

**A green oracle alone is not evidence that the product works.** The 2026-08-22
fresh review found that the oracle bound behavior only by direct
`require(file)[name]`, so 68/68 was compatible with a library no shipped code
path could reach. That total-unreachability claim is now superseded: an
active-runtime install journals `.rig/bin/rig`, and an end-to-end regression
uses that installed command to plan, apply, and check the lint-format leaf.

That is a property of how the oracle binds, not a defect in any one test, and it
is worth stating plainly because it is the successor to the older trap on this
page. The previous version was "the suite asserts inventory, not behavior." This
one is "the suite asserts behavior, at a seam the product does not use." Both
produce a green suite that means less than it looks like it means.

Those two checks used to return `failures: []` unconditionally. They no longer
do. `authorshipReport()` opens each fragment file; `contractFor()` reads
declared host-contract fields instead of inventing them. The signed cases still
assert `failures: []`, which now means no defects were found. The remaining
honest limit is narrower: the signed oracle still binds many functions by
direct `require`, and one installed lint-format tracer does not prove every
runtime module or behavior is wired through a shipping caller.
[fresh review](../reasoning/2026-08-22-mvp-release-review.md) ·
[Status](../status.md#what-exists-in-the-code-today)

The structural half of that limit is now guarded: a production caller-graph
test scans every runtime library module and fails if one is imported only by
tests. Behavioral shipping-path cases separately exercise installed
lint-format, managed graft apply, commit validation, MCP enforcement, and the
release-review wrapper. This does not make direct-require oracle cases redundant;
it ensures their modules cannot silently become library-only again.

A third mechanism of the same family showed up 2026-08-27 in RIG-115's
per-AT-LF-case branches: each branch's acceptance test passes for a slice of
its guarantee narrower than the acceptance text states, and nothing checks
whether the union of sibling branches' passing tests reconstructs the whole
guarantee. Named as [guarantee sharding](../mistakes/guarantee-sharding.md) —
see [`mistakes/`](../mistakes/) for this family of anti-patterns going
forward, kept separate from this page's own two instances above.
Instances: [RIG-138 / #93](https://github.com/qaynel/Rig/issues/93),
[RIG-139 / #94](https://github.com/qaynel/Rig/issues/94),
[RIG-140 / #95](https://github.com/qaynel/Rig/issues/95).
[reasoning trace](../reasoning/2026-08-27-guarantee-sharding-mistake.md)

The prevention side is `AT-PROC-1`, a workflow-doctrine acceptance criterion
(not a Gate 1 case — no owner signature, no set-equality gate) requiring the
union of a split guarantee's sibling-branch tests to cover every enumerated
call site and conjunct. `tests/guarantee-coverage.test.js` is its executable
target: red by design until RIG-138/139/140 landed, green since
[2026-08-27](../reasoning/2026-08-27-rig138-139-140-shell-trust-fix.md). Full
text: [guarantee sharding § acceptance criteria](../mistakes/guarantee-sharding.md#acceptance-criteria-at-proc-1).
