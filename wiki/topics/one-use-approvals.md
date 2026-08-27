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

Branch `rig-115-at-lf-20-single-use-approval` (RIG-115, AT-LF-20) set
`approval.used = true` on the in-memory approval object only — no clone-local
persistence, so the flag did not survive the process boundary a real
plan/execute flow crosses. It was one instance of a larger pattern, not an
isolated bug: see [guarantee sharding](../mistakes/guarantee-sharding.md) and
[reasoning trace](../reasoning/2026-08-27-guarantee-sharding-mistake.md).

Fixed in `rig/lib/lint-format.js`'s `executePlan`/`consumePlanApproval`
([reasoning trace](../reasoning/2026-08-27-rig138-139-140-shell-trust-fix.md),
closes [RIG-138 / #93](https://github.com/qaynel/Rig/issues/93)): consumption
is now a clone-local file at
`target/.rig/lint-format/executions/<sha256(plan_digest)>.json`, created with
an atomic exclusive (`wx`) write, so a second, independently-constructed
approval object for the same `plan_digest` — including one reloaded in a
second process — is refused. `rig/lib/enforcement.js`'s
`consumeOneUseApproval` and `rig/lib/policy.js`'s `grantApproval` were not
touched by this fix and still have the matching defect for their own
callers: `grantApproval` writes a durable approval file, but nothing reads it
back and durably marks it used — the write half of this pattern exists
generically, the consume half does not, for anything outside lint-format.
