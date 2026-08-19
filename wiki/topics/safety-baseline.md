# The safety baseline

## What it is

Rig enables independent agent-tech-safety controls by default: sanitation,
drift prevention, secret handling, network/tool policy, and git/CI floors. The
user may disable any or all of them; Rig must then stop enforcing them and state
truthfully what did not run. [Gate 1 §2](../gate1/business-spec.md)

## Why it is this way

Default-on gives a new installation a useful safety posture, while complete
user control avoids turning Rig into an undeclared policy owner. Implementations
ship dormant and policy wiring activates only the selected controls, so installed
code is never confused with evidence that protection ran. [Gate 2 §8.1](../gate2/technical-spec.md#81-independent-controls-and-enforcement-surfaces)

## What binds it

`GA-9h` and `GA-9i` separate baseline safety from product security; `AD-12`
requires dormant implementations and truthful wiring. `AT-BASE-*` and the
control-specific cases test default enablement, disablement, and honest gaps.
[Decision index](../index/decisions.md) [Acceptance index](../index/acceptance-cases.md)

## What was rejected

A non-disableable baseline, one coarse switch, hidden enforcement after
disablement, and safety controls in `rig.json` were rejected. They either remove
user authority or mix capability selection with authorization. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen user-control rules: [Gate 1 §2](../gate1/business-spec.md)
- Control surfaces: [Gate 2 §8.1](../gate2/technical-spec.md#81-independent-controls-and-enforcement-surfaces)
- Policy state and evidence: [Gate 2 §8.2–8.9](../gate2/technical-spec.md#82-authoritative-policy-schema)

## What is still open

The policy and control mechanisms are candidate design only. Gate 2's round-3
findings must be resolved before implementation slices 3–7 begin. [Status](../status.md)
