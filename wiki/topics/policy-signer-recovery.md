# Policy-signer recovery

## What it is

A lost everyday policy signer may be replaced only through a distinct,
pre-registered `sk-*` SSHSIG recovery identity under the `rig-policy-recovery`
namespace. Registration requires a credential already in force; losing every
registered credential is a permanent dead end for that trust state. [Gate 1 D20](../gate1/business-spec.md)

## Why it is this way

An unregistered new key or reset command would let whoever controls the current
machine appoint the replacement trust root. Pre-registration preserves continuity
with a prior valid state, a separate failure domain avoids circular recovery,
and terminal exhaustion prevents an ever-weaker fallback chain. [Advanced grilling GA-14](../sources/logs/advanced-grilling.md#ga-14--policy-signer-recovery-2026-08-19)

## What binds it

`D20`, `GA-14a`–`GA-14g`, and `AD-30` define registration, presence floor,
side effects, disclosure, and exhaustion. `AT-PRESENCE-2` is the added frozen
case. Recovery does not apply to the Gate 1 signer. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Forced reset, reinitialization as fallback, same-key recovery, a fresh
unregistered key, ordinary confirmation UI, an unlimited chain, and implicit
side effects triggered by an agent were rejected as trust-root bypasses.
[Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen recovery intent: [Gate 1 D20](../gate1/business-spec.md)
- Ceremony and receipt: [Gate 2 §8.4](../gate2/technical-spec.md#84-user-presence-approval-signer-setup-and-recovery)
- Full decision history: [advanced grilling GA-14](../sources/logs/advanced-grilling.md#ga-14--policy-signer-recovery-2026-08-19)

## What is still open

**Resolved 2026-08-21.** Round 3 found that Gate 2 called recovery credentials
hardware-backed without D19's limitation and lacked a fraudulent-registration
case. Gate 2 v0.6 now gives recovery credentials the declared-and-disclosed
class treatment — Rig verifies the signature and listing, records and discloses
the declared `sk-*` class, and the user attests the floor — and names the
user-verification registration ceremony as what stops an agent holding a valid
credential from self-appointing a key it could later operate unattended. The
v0.10 `AT-PRESENCE-2` §13 test row now asserts only the enforceable parts:
pre-loss registration, fingerprint/namespace distinctness, receipt validity,
exhaustion, side effects, and declared-class disclosure. It does not claim a
Node test can prove a hardware touch. v0.11 also closes the platform fallback:
if OpenSSH cannot request user verification, registration refuses with
`user_verification_unavailable` rather than creating a weaker recovery path.
`AD-30` amended.
[Gate 2 re-trace trace](../reasoning/2026-08-21-gate2-lint-format-retrace.md)
[Round-6 correction trace](../reasoning/2026-08-21-gate2-v0.10-round6-corrections.md)
[v0.11 correction](../reasoning/2026-08-21-gate2-v0.11-carried-review-corrections.md)
[Status](../status.md)
