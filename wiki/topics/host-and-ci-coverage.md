# Host and CI coverage

## What it is

Every host axis and CI provider follows one uniform emission contract. A host
axis is either `emitted`, with a complete adapter contract and passing
byte-landing test, or `unsupported`, with vendor evidence that no surface exists.
CI integrates additively and never guesses a provider. [Gate 2 §11](../gate2/technical-spec.md#11-host-and-ci-coverage-one-uniform-path)

## Why it is this way

An earlier verified/unverified tier advertised a distinction Rig had not
implemented and encouraged per-host claims that automated evidence could not
support. The 2026-08-17 amendment removed the tier and made build set equal
release set: correct bytes at correct paths are the release evidence, while the
single registry header states that enforcement has not been observed firing.
[Timeline](../index/timeline.md#2026-08-17--the-host-tier-amendment)

## What binds it

`AD-13`, `AD-17`, `AD-23`, and `AD-24` define uniform host and CI paths. D1–D3
are explicitly unwound. Host/CI acceptance cases require exact rosters,
preservation, real fixtures, provider choice, and byte landing. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Verified/unverified tiers, per-host claim strings, hard-coded advertised lists,
promotion events, acknowledgement prompts, umbrella citations, and advisory-only
CI verification were rejected. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen uniform-path intent: [Gate 1 §2](../gate1/business-spec.md)
- Host and provider contracts: [Gate 2 §11](../gate2/technical-spec.md#11-host-and-ci-coverage-one-uniform-path)
- Captured evidence: [host/CI reference](../sources/reference/host-ci-capability-verification.raw.md) and [config-surface reference](../sources/reference/host-config-surfaces-verification.raw.md)
- Hermes first-class plugin ruling: [reasoning trace](../reasoning/2026-08-20-hermes-first-class.md)

## What is still open

No host axis currently has the complete candidate contract, and all six CI
providers need adapter/fixture evidence. Gate 2 also needs to disambiguate the
word `verified` in policy evidence from the removed host tier. [Status](../status.md#the-blocker-round-3-failed)
