# User-presence approvals

## What it is

Approval uses a verified host-native user-presence protocol when one exists,
otherwise a user-configured external SSHSIG signer. If neither is available,
Rig refuses the action and reports approval unavailable; it never silently
skips presence. [Gate 1 D6](../gate1/business-spec.md)

## Why it is this way

Chat wording, tool access, urgency, a TTY prompt, or an agent-controlled key can
all be produced inside the agent's authority. The fallback therefore requires a
credential outside that authority, while allowing host-native mechanisms where
their protocol genuinely establishes a live user act. [Gate 2 §8.4](../gate2/technical-spec.md#84-user-presence-approval-signer-setup-and-recovery)

## What binds it

`D6` requires refusal instead of bypass. `AD-20` fixes the three outcomes:
host-native presence, external signature, or refusal, with no fourth path.
`AT-PRESENCE-*` tests activation and recovery boundaries. [Decision index](../index/decisions.md)
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

The round-3 review asks Gate 2 to qualify its recovery-key language and test
fraudulent recovery registration while an everyday credential is valid.
[Status](../status.md#the-blocker-round-3-failed)
