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

Round 3 found that Gate 2 calls recovery credentials hardware-backed without
the limitation D19 established, and lacks a fraudulent-registration case. Gate
2 must resolve both before freeze. [Status](../status.md#the-blocker-round-3-failed)
