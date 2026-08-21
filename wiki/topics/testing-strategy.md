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

The executable specification gate is missing, so the current advanced suite as a
whole is not credible release evidence. The apply and lint-format interrupted
install probes now exercise real `AT-INSTALL-1` manifest/resume behavior, but
Slice 1 must still make the full intended failure set observable before later
slices turn it green. [Status](../status.md#what-exists-in-the-code-today)
