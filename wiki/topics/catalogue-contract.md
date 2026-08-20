# Catalogue contract

## What it is

The catalogue contract gives every family, group, service, grade slice, and
dependency a canonical identity. Grades are cumulative and dependencies pull
only named slices; a dependency never replaces the user's selection or raises
its grade. [Gate 2 §5.1–5.4](../gate2/technical-spec.md#5-catalogue-contract)

## Why it is this way

Stable leaf identities make selection, receipts, reports, and compatibility
deterministic. Strictly growing check-ID sets prove that `maximal` adds depth
instead of quietly becoming a different service. Razor-scoped dependencies
preserve user control while avoiding warn-and-stop installs. [Gate 1 §2](../gate1/business-spec.md)
[Advanced grilling GA-9a and GA-9k](../sources/logs/advanced-grilling.md)

## What binds it

`AD-3` fixes source ownership, `AD-4` fixes cumulative grades, and `AD-5` fixes
dependency resolution. `AT-SHAPE-3` and `AT-SHAPE-4` are the frozen observable
tests. [Decision index](../index/decisions.md) [Acceptance index](../index/acceptance-cases.md)

## What was rejected

Dependency-grade escalation, whole-group pulls, grade-specific service IDs,
duplicate full prose per host, YAML, and a template engine were rejected as
either user-choice violations or unnecessary machinery. [Gate 2 §2.1](../gate2/technical-spec.md#21-rejected-approaches)

## Authorities and sources

- Business rules: [Gate 1 §2 and §5](../gate1/business-spec.md)
- Exact schema and algorithms: [Gate 2 §5](../gate2/technical-spec.md#5-catalogue-contract)
- Original rulings: [advanced grilling](../sources/logs/advanced-grilling.md)
- First convention-leaf ruling: [reasoning trace](../reasoning/2026-08-20-lint-format-confirmations.md)
- Bounded first-leaf design: [lint-format vertical slice](../specs/lint-format-vertical-slice.md)

## What is still open

The contract is designed but not frozen or implemented. The authored-service
gate must later prove that mechanically valid leaves also carry real,
service-specific meaning. [Authored-service gate](authored-service-gate.md)

For the lint-format tracer, convention means adapting to repository-owned
commands rather than installing a toolchain. Missing commands are a coverage
gap, and the maximal-grade fix command is recorded for explicit use but never
run by a check or CI.
