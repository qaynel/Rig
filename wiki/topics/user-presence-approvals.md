# User-presence approvals

## What it is

Approval uses a verified host-native user-presence protocol when one exists,
otherwise a user-configured external SSHSIG signer. If neither is available,
Rig refuses the action and reports approval unavailable; it never silently
skips presence. [Gate 1 D6](../gate1/business-spec.md)

This holds for Path B onboarding as well as for policy activation. Every
approval verifies against one trust root, the Gate 1 key shipped as
`.rig/trust/gate1.allowed-signers` ([one trust root](../reasoning/2026-10-20-one-trust-root-owner-decision.md)).
Onboarding `apply` re-verifies an SSHSIG receipt over the message
`rig-plan-approval\nrepository=<SHA256(realpath(target))>\ndigest=<proposal digest>\n` under the `rig-plan-approval`
namespace. The clone binding rejects a genuine signature copied from an identical
proposal in another repository. See the [October23 repair scope](../specs/close-everything/2026-10-23-binding-review-followup.md). A `verified: true` field in the receipt carries no weight, a missing
trust root is a refusal rather than a pass, an identity other than the root's
principal is refused, and `host-native` refuses outright because no host yet
ships an attestation Rig can re-check. There is no independent signer list, and
the installer ships no template for one.
[Reasoning](../reasoning/2026-09-01-path-b-hardening-issue1-approval.md)

The [October23 five-gap freeze](../reasoning/2026-10-23-five-gap-final-freeze.md) verifies the clone-bound real-signature rejection and unchanged trust root.

## Why it is this way

Chat wording, tool access, urgency, a TTY prompt, or an agent-controlled key can
all be produced inside the agent's authority. The fallback therefore requires a
credential outside that authority, while allowing host-native mechanisms where
their protocol genuinely establishes a live user act. [Gate 2 §8.4](../gate2/technical-spec.md#84-user-presence-approval-and-the-one-trust-root)

## What binds it

`D6` requires refusal instead of bypass. `AD-20` fixes the three outcomes:
host-native presence, external signature, or refusal, with no fourth path.
`AT-PRESENCE-*` tests activation and the one-root rule. A plan approval also
binds the bytes it approves, not only the plan's wording: the proposal carries
a per-skill tree and projected-bytes digest that `apply` and `check` re-derive.
[Byte-binding trace](../reasoning/2026-09-01-path-b-hardening-issue2-bytebinding.md)
[Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Repository flags, unattended signing keys, TTY confirmation alone, and any second
signer list or recovery ceremony were rejected because an agent could trigger
or synthesize them. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen approval rule: [Gate 1 §2](../gate1/business-spec.md)
- Protocol selection: [Gate 2 §8.4](../gate2/technical-spec.md#84-user-presence-approval-and-the-one-trust-root)
- Key-property correction: [advanced grilling GA-11 and D19](../sources/logs/advanced-grilling.md)

## What is still open

The owner amendment that rewrites `AT-PRESENCE-2` and the fixtures that wrote
retired signer lists is prepared and awaits the owner's re-sign. [Status](../status.md)
