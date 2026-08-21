# What Rig is

## What it is

Rig is a packaged, forward-deployed, host-agnostic agentic harness for an
existing repository. It reads the current repo and project context, chooses how
best to install the harness with the tools Rig ships, and helps the user set it
up while respecting existing infrastructure instead of replacing it. Tier 1 is
a markdown-only bootstrap; the active delivery design adds a default-on
agent-safety baseline and a user-selected engineering catalogue without adding a
Rig model runtime or model key. [Gate 1 §1–2](../gate1/business-spec.md)
[Packaged harness clarification](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)

## Why it is this way

The foundational design chose doctrine over bundled runtimes and one shared
router over independent host implementations. Advanced grilling then locked the
"brain" choice to B1: Rig authors configuration and the host agent performs the
work. That keeps the install portable and leaves model execution with the host
the user already chose. [Foundational decisions G1–G6](../sources/logs/grill-decisions.md)
[Advanced grilling GA-1–GA-2](../sources/logs/advanced-grilling.md)

The intent owner later sharpened that product spirit: Rig exists to be a
dynamic, plug-and-play agentic harness that adapts as the project grows, takes
in project context, and lets most updating happen through the host. Rig should
make the host and repository more productive rather than duplicate or displace
what is already there. [Product-spirit hybrid trace](../reasoning/2026-08-20-product-spirit-hybrid.md)

The same posture now explicitly frames Rig as a packaged forward-deployed
harness: it lands in the repository, evaluates what is already there, and
complements that setup with delivered Rig tools rather than trying to become a
parallel infrastructure stack. [Packaged harness clarification](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)

## What binds it

The binding rulings are `G1`–`G6`, `G10`, `GA-1`, `GA-2`, `GA-9g`, `GA-17`,
and `GA-22`–`GA-23`. Gate 1 defines the current outcome and explicitly separates
agent-tech safety from the Product-Security catalogue family.
[Decision index](../index/decisions.md)
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
- Product spirit and hybrid posture: [reasoning trace](../reasoning/2026-08-20-product-spirit-hybrid.md)
- Packaged forward-deployed harness clarification: [reasoning trace](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)
- Universal capability model, lint-format first: [reasoning trace](../reasoning/2026-08-20-universal-capability-model-leaf-first.md)

## What is still open

The product identity is settled; delivery is not. Gate 2 is still a failed
candidate and the catalogue implementation must not start until it freezes.
The intent owner frames Tier 2 not as a competitor to Tier 1 but as its
repo-targeted refinement: the same workflow, onboarding only the context and
skills relevant to the specific project. [Product-direction review](../reasoning/2026-08-19-product-direction-review.md)
[Current status](../status.md)

Rig's universal service-depth method is Policy → Context → Evidence: govern,
understand, then prove the change, while using the lowest level that can reach a
definitive answer. This is recorded globally but is being specified and proven
only through lint-format now; it does not authorize horizontal authorship of
the remaining catalogue.
