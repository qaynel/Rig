# What Rig is

## What it is

Rig is a curated, host-agnostic toolbox for installing agent workflows into an
existing repository. Tier 1 is a markdown-only bootstrap; the active delivery
design adds a default-on agent-safety baseline and a user-selected engineering
catalogue without adding a Rig model runtime or model key. [Gate 1 §1–2](../gate1/business-spec.md)

## Why it is this way

The foundational design chose doctrine over bundled runtimes and one shared
router over independent host implementations. Advanced grilling then locked the
"brain" choice to B1: Rig authors configuration and the host agent performs the
work. That keeps the install portable and leaves model execution with the host
the user already chose. [Foundational decisions G1–G6](../sources/logs/grill-decisions.md)
[Advanced grilling GA-1–GA-2](../sources/logs/advanced-grilling.md)

## What binds it

The binding rulings are `G1`–`G6`, `G10`, `GA-1`, `GA-2`, and `GA-9g`. Gate 1
defines the current outcome and explicitly separates agent-tech safety from the
Product-Security catalogue family. [Decision index](../index/decisions.md)
[Gate 1 §2](../gate1/business-spec.md)

## What was rejected

A thin fork, a Rig-owned runtime, a Rig model key, a mutable memory database,
and fixed Basic/mid/Advanced install packages were rejected. The old tier
taxonomy remains only as historical evidence and compatibility context.
[Rejected approaches](../index/rejected.md)

## Authorities and sources

- Current intent: [Gate 1](../gate1/business-spec.md)
- Technical shape: [Gate 2 §3–4](../gate2/technical-spec.md#3-current-state-trace)
- Origin: [foundational log](../sources/logs/grill-decisions.md) and [advanced log](../sources/logs/advanced-grilling.md)
- Historical taxonomy: [superseded tier docs](../sources/superseded/deprecated-tier-taxonomy/README.md)
- Product-direction review: [reasoning trace](../reasoning/2026-08-19-product-direction-review.md)
- First-attempt retrospective (what not to do): [reasoning trace](../reasoning/2026-08-20-first-attempt-retrospective.md)

## What is still open

The product identity is settled; delivery is not. Gate 2 is still a failed
candidate and the catalogue implementation must not start until it freezes.
The intent owner frames Tier 2 not as a competitor to Tier 1 but as its
repo-targeted refinement: the same workflow, onboarding only the context and
skills relevant to the specific project. [Product-direction review](../reasoning/2026-08-19-product-direction-review.md)
[Current status](../status.md)
