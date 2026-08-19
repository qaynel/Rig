# Onboarding flow

## What it is

The default staged flow is `inspect → host review → recommend → plan → apply →
check`. Sanitation precedes profiling, recommendations remain advisory, and the
user approves a content-bound plan before any write. [Gate 2 §6](../gate2/technical-spec.md#6-staged-onboarding-data-flow)

## Why it is this way

The order prevents untrusted repository harness content from influencing the
agent before it is inspected, while separating advice from authority. Planning
before applying makes every intended mutation reviewable and lets the apply
stage enforce hashes rather than rediscover intent. [Gate 1 §2](../gate1/business-spec.md)
[Advanced grilling GA-9b–GA-9c](../sources/logs/advanced-grilling.md)

## What binds it

`AD-6` fixes the stages, `AD-7` constrains inspection, `AD-8` separates
remediation, and `AD-14` keeps the full menu available. `AT-BASE-1`,
`AT-SHAPE-2`, and `AT-SCAN-*` define the observable behavior. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

A combined scan/profile/install command, automatic remediation, recommendation
as a gate, and silent host/config fallback were rejected because they collapse
distinct consent and trust boundaries. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen ordering and user control: [Gate 1](../gate1/business-spec.md)
- CLI seams and stage outputs: [Gate 2 §6](../gate2/technical-spec.md#6-staged-onboarding-data-flow)
- Sanitation mechanics: [Gate 2 §8.7](../gate2/technical-spec.md#87-sanitation-and-bounded-remediation)

## What is still open

The round-3 review found contradictory partial-apply behavior between §6.6 and
§7.6. Gate 2 must decide the rollback/resume boundary before this flow can
freeze. [Current blocker](../status.md#the-blocker-round-3-failed)
