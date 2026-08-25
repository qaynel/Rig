# The policy model

## What it is

Safety authorization lives in strict `.rig/network-policy.json`, separate from
catalogue selection in `rig.json`. Proposed bytes are inert; activation validates
and hashes the exact bytes, verifies current-user approval, then commits an
immutable active snapshot. [Gate 2 §8.2–8.3](../gate2/technical-spec.md#82-authoritative-policy-schema)

## Why it is this way

Separating capability choice from action authority prevents an agent from
smuggling consent through catalogue edits. Exact-byte revision identity avoids
normalization ambiguity. Delegated policy editing is session-only proposal
authority and never activation authority, so it creates no persistent grant an
agent can later replay. [Gate 1 §2, D12–D13](../gate1/business-spec.md)

## What binds it

`AD-2` separates the files; `AD-19` fixes strict parsing, exact hashing, active
snapshots, and non-persistence. `D12` and `D13` keep delegation ephemeral and
self-activation impossible while Rig claims protection. [Decision index](../index/decisions.md)

## What was rejected

Safety toggles in `rig.json`, split network authorities, canonicalized approvals,
persistent delegation, an invariant policy tier, and a second file containing
self-activation rules were rejected because they introduce precedence or replay
paths without improving authority. [Gate 2 §2.1](../gate2/technical-spec.md#21-rejected-approaches)

## Authorities and sources

- Product rules: [Gate 1 §2](../gate1/business-spec.md)
- Schema and activation: [Gate 2 §8.2–8.3](../gate2/technical-spec.md#82-authoritative-policy-schema)
- Lifecycle rulings: [advanced grilling GA-12](../sources/logs/advanced-grilling.md#ga-12--the-lifecycle-re-grill-2026-07-28)

## What is still open

**Resolved.** The schema and activation path are implemented and pass the
green full test suite. The round-3 request for clearer language separating
control evidence status from the removed host-tier vocabulary is also resolved,
in Gate 2 v0.6 (§1/§11.1 record the three senses of `verified`; `AD-26`
amended). [Status](../status.md)
