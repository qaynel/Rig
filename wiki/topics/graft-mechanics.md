# Graft mechanics

## What it is

Rig adapts into an existing repository through typed operations with explicit
ownership classes. User files receive delimited managed blocks or structured
namespaced merges; Rig-owned files are materialized separately. Apply uses an
exclusive lock, preimage compare-and-swap, and receipt-last commit. [Gate 2 §7](../gate2/technical-spec.md#7-graft-mechanics)

## Why it is this way

Typed operations make preservation and reversal testable. Arbitrary shell plans
or whole-file replacement would turn onboarding into unbounded code execution
and make it impossible to distinguish Rig-owned bytes from user work. Shared
service prose is materialized once and host files point to it to limit drift.
[Gate 1 AT-SHAPE-1](../gate1/acceptance.md#a-archetype--the-shared-service-shape-every-catalogue-service-must-pass)

## What binds it

`AD-9` defines typed operations, `AD-10` defines locking/CAS/receipt order, and
`AD-11` centralizes service prose. D11 and D14 add removal and interrupted-install
requirements. [Decision index](../index/decisions.md)

## What was rejected

Blind copies, arbitrary shell operations, malformed-config fallback, duplicate
service prose per host, and deleting user files were rejected as clobber or
trust-boundary failures. [Gate 2 §2.1](../gate2/technical-spec.md#21-rejected-approaches)

## Authorities and sources

- Frozen no-clobber behavior: [Gate 1 §2](../gate1/business-spec.md)
- Operation and ownership model: [Gate 2 §7.1–7.3](../gate2/technical-spec.md#71-ownership-classes)
- Failure boundaries: [Gate 2 §10](../gate2/technical-spec.md#10-trust-safety-and-failure-boundaries)

## What is still open

Gate 2 currently contradicts itself about whether an apply failure rolls back
the whole transaction or leaves prior writes for resume. That boundary blocks
freeze and must be settled before the apply engine is implemented. [Status](../status.md#the-blocker-round-3-failed)
