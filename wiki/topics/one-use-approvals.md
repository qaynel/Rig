# One-use approvals

## What it is

A one-use approval is clone-local, bound to the complete normalized action and
policy context, and atomically consumed before dispatch. It cannot be shared,
retargeted, replayed, or reused after the relevant context changes. [Gate 2 §8.5](../gate2/technical-spec.md#85-one-use-approvals)

## Why it is this way

Exact action binding permits a user to approve one otherwise-denied operation
without broadening permanent policy. Atomic consumption closes concurrent replay;
clone-local storage prevents one repository installation from authorizing
another. Native credential expiry and context changes already provide meaningful
invalidation, so Rig adds no arbitrary timer. [Gate 1 §2](../gate1/business-spec.md)

## What binds it

`GA-10j` and `AD-21` define the lifecycle. The one-use acceptance cases cover
full identity, atomic consumption, replay refusal, clone isolation, and
invalidation. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Repository-shared grants, category-only identity, persistent or self-extending
delegation, and Rig-imposed session/minute timers were rejected as either replay
risks or state that expires unchanged user intent. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- User-control intent: [Gate 1 §2](../gate1/business-spec.md)
- Exact lifecycle: [Gate 2 §8.5](../gate2/technical-spec.md#85-one-use-approvals)
- Trust boundary: [Gate 2 §10](../gate2/technical-spec.md#10-trust-safety-and-failure-boundaries)

## What is still open

The mechanism is designed but not implemented. Policy recovery must invalidate
pending one-use approvals only after an authorized recovery receipt commits.
[Policy-signer recovery](policy-signer-recovery.md)

Branch `rig-115-at-lf-20-single-use-approval` (RIG-115, AT-LF-20) sets
`approval.used = true` on the in-memory approval object only — no clone-local
persistence, so the flag does not survive the process boundary a real
plan/execute flow crosses. Filed as [RIG-138 / #93](https://github.com/qaynel/Rig/issues/93).
It is one instance of a larger pattern, not an isolated bug: see
[guarantee sharding](../mistakes/guarantee-sharding.md) and
[reasoning trace](../reasoning/2026-08-27-guarantee-sharding-mistake.md). Any
implementation of atomic consumption here must be durable across processes,
matching this page's "clone-local, atomically consumed" definition above, not
just correct within one process's lifetime.
