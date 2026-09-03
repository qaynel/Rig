# User-presence approvals

## What it is

Approval uses a verified host-native user-presence protocol when one exists,
otherwise a user-configured external SSHSIG signer. If neither is available,
Rig refuses the action and reports approval unavailable; it never silently
skips presence. [Gate 1 D6](../gate1/business-spec.md)

This holds for Path B onboarding as well as for policy activation. Onboarding
`apply` re-verifies an SSHSIG receipt against the repository-owned
`.rig/allowed-signers` list, over the message
`rig-plan-approval\ndigest=<proposal digest>\n` under the `rig-plan-approval`
namespace. A `verified: true` field in the receipt carries no weight, a missing
allowed-signers file is a refusal rather than a pass, and `host-native` refuses
outright because no host yet ships an attestation Rig can re-check. The
installer ships `.rig/allowed-signers.example.md` and never writes the live
list. [Reasoning](../reasoning/2026-09-01-path-b-hardening-issue1-approval.md)

## Why it is this way

Chat wording, tool access, urgency, a TTY prompt, or an agent-controlled key can
all be produced inside the agent's authority. The fallback therefore requires a
credential outside that authority, while allowing host-native mechanisms where
their protocol genuinely establishes a live user act. [Gate 2 §8.4](../gate2/technical-spec.md#84-user-presence-approval-signer-setup-and-recovery)

## What binds it

`D6` requires refusal instead of bypass. `AD-20` fixes the three outcomes:
host-native presence, external signature, or refusal, with no fourth path.
`AT-PRESENCE-*` tests activation and recovery boundaries. A plan approval also
binds the bytes it approves, not only the plan's wording: the proposal carries
a per-skill tree and projected-bytes digest that `apply` and `check` re-derive.
[Byte-binding trace](../reasoning/2026-09-01-path-b-hardening-issue2-bytebinding.md)
[Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Repository flags, unattended signing keys, TTY confirmation alone, and ordinary
confirmation popups for recovery were rejected because an agent could trigger
or synthesize them. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen approval rule: [Gate 1 §2](../gate1/business-spec.md)
- Protocol selection: [Gate 2 §8.4](../gate2/technical-spec.md#84-user-presence-approval-signer-setup-and-recovery)
- Key-property correction: [advanced grilling GA-11 and D19](../sources/logs/advanced-grilling.md)

## What is still open

The round-3 request to qualify Gate 2's recovery-key language and test
fraudulent recovery registration while an everyday credential is valid is
**resolved** in v0.6 (declared-and-disclosed class per D19; the `AT-PRESENCE-2`
§13 row now tests enforceable registration, distinctness, receipt, exhaustion,
side-effect, and declared-class disclosure rules; `AD-30` amended). [Status](../status.md)
