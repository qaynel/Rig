# The action evaluator

## What it is

One evaluator normalizes shell commands, built-in web actions, and
network-capable MCP calls into a common action identity, applies the active
policy, and returns allow, deny, one-use-approval, or an honest enforcement gap.
[Gate 2 §8.6](../gate2/technical-spec.md#86-common-action-evaluator)

## Why it is this way

Separate per-tool policies would create inconsistent authorization and ambiguous
precedence. One policy makes the user's intent stable across surfaces while
axis adapters remain responsible for validating vendor events and enforcing the
decision in their native protocol. [Gate 1 AT-BASE-2](../gate1/acceptance.md#b-default-baseline-and-user-control)

## What binds it

`AD-22` fixes the normalized cross-surface model; `AD-20` and `AD-21` supply the
approval paths. `AT-BASE-2` and action-specific cases require mechanical
enforcement where a surface exists and an explicit gap elsewhere. [Decision index](../index/decisions.md)

## What was rejected

Split safety/network authorities, policy-by-chat, silent skip on unsupported
surfaces, and generic success bindings were rejected because they let the same
action receive conflicting or fabricated treatment. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Cross-surface business rule: [Gate 1 §2](../gate1/business-spec.md)
- Evaluator contract: [Gate 2 §8.6](../gate2/technical-spec.md#86-common-action-evaluator)
- Host adapter boundary: [Gate 2 §11.1](../gate2/technical-spec.md#111-host-contracts)

## What is still open

**Resolved.** The evaluator and the host-axis contracts (all 19 researched
hosts, six CI providers) are implemented and pass the green full test suite.
The round-3 terminology conflict between host claims and control evidence is
also resolved, in Gate 2 v0.6: §1/§11.1 disambiguate the three senses of
`verified`, including `AT-BASE-2`'s "verified enforcement surface".
[Status](../status.md)
