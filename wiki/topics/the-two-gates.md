# The two gates

## What it is

Gate 1 owns **what** Rig must do: frozen business intent and independently
authored acceptance cases. Gate 2 owns **how**: one technical authority traced
to the exact Gate 1 bytes. Implementation starts only after both are frozen.
[Gate 1 handoff](../gate1/business-spec.md) [Gate 2 §1](../gate2/technical-spec.md#1-gate-1-restatement)

## Why it is this way

The separation prevents an implementer from weakening a difficult requirement
or writing tests that merely bless its own code. The process is separation of
contexts, not staffing: one maintainer may use distinct grilling, design,
implementation, and review sessions. [Acceptance cases AT-GATE-1–4](../gate1/acceptance.md#0-ordered-completion-gates)

## What binds it

`GA-10a` makes the technical spec the sole Gate 2 authority; `D8`/`GA-13`
require independent review; `D10`, `D17`, and `D19` protect Gate 1 integrity.
`AD-18`, `AD-28`, and `AD-29` make those requirements executable. [Decision index](../index/decisions.md)

## What was rejected

Implementation-authored acceptance, multiple competing plan authorities,
branch protection as the Gate 1 trust root, and self-declared reviewer-model
identity were rejected because none establishes the required independence.
[Rejected approaches](../index/rejected.md)

## Authorities and sources

- Gate 1: [business intent](../gate1/business-spec.md) and [acceptance](../gate1/acceptance.md)
- Gate 2 candidate: [technical specification](../gate2/technical-spec.md)
- Workflow doctrine: [router](../../rig/tier-1/routing.md)

## What is still open

Gate 1 is frozen. Gate 2 v0.5 has a live failing review receipt, so its
mechanisms are candidate decisions and implementation remains blocked.
[Status](../status.md)
