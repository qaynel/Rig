# Services and reports

## What it is

Every selected service has exactly one honest disposition: executable first,
otherwise service-specific convention or a predicate-backed surfaceless result.
The runner iterates selected-service receipts so a missing binding cannot vanish.
Reports persist failures, vacuous results, and coverage gaps; routine passes are
omitted. [Gate 2 §9](../gate2/technical-spec.md#9-runnable-services-and-reports)

## Why it is this way

The earlier implementation treated non-empty placeholders and no-op bindings as
success. The current contract requires observed launch/result evidence and names
missing or malformed behavior as a nonzero coverage gap. Reports remain local,
redacted, and failure-centric so CI output cannot become a secret map.
[Advanced grilling GA-10](../sources/logs/advanced-grilling.md#ga-10--re-grill-after-implementation-audit-2026-07-25)

## What binds it

`D4`, `D15`, `AD-15`, and `AD-16` define disposition and reporting. `AT-SHAPE-5`,
`AT-REPORT-1`, and per-service cases require honest execution, vacuity, gaps,
redaction, and no uploaded artifacts. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Generic success bindings, silent skips, marker-only hooks, advisory-only CI,
fake executable stubs, and committed/uploaded finding detail were rejected as
false green or disclosure paths. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen outcome rules: [Gate 1 §2 and acceptance](../gate1/business-spec.md)
- Binding and report schemas: [Gate 2 §9](../gate2/technical-spec.md#9-runnable-services-and-reports)
- Testing vision: [captured reference](../sources/reference/testing-pipeline-vision.raw.md)

## What is still open

The service runner and meaningful bindings do not exist. Slice 8 builds the
runner; Slice 14 authors all leaves; the final release gate reviews both.
[Gate 2 §14](../gate2/technical-spec.md#14-ordered-tracer-bullet-slices)
