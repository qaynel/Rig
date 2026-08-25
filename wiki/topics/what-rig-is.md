# What Rig is

## What it is

Rig is a packaged, forward-deployed, host-agnostic agentic harness for an
existing repository. It reads the current repo and project context, chooses how
best to install the harness with the tools Rig ships, and helps the user set it
up while respecting existing infrastructure instead of replacing it. Tier 1 is
a markdown-only bootstrap; the beta delivery focuses on the user-selected
engineering catalogue without adding a Rig model runtime or model key.
**Beta note:** The mandatory agent-technology safety baseline is included. The
Product-Security catalogue remains independently selectable, and no Rig model
runtime or model key is introduced.
[Gate 1 §1–2](../gate1/business-spec.md)
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

A later office-hours session tested this identity against a candidate fork
(DeepSeek Harness, "DSH") — a full agent-runtime host, the opposite category
from Rig's config-only doctrine layer. The resolution: Rig's moat is the
adaptation-onto-existing-infra engine, not any instruction set, and a DSH-style
shell may be adopted only as an optional, frozen, tier-1-only delivery medium
for the no-host segment — reach, not moat — never chased upstream.
[`GA-36`](../index/decisions.md) [DSH envy and the audience fork](../reasoning/2026-08-23-dsh-envy-and-the-audience-fork.md)
[DSH routes to models, not hosts](../reasoning/2026-08-23-dsh-routes-to-models-not-hosts.md)
[DSH is a delivery medium, not the moat](../reasoning/2026-08-23-dsh-delivery-medium-not-moat.md)

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
- Beta safety posture: [reasoning trace](../reasoning/2026-08-23-beta-safety-posture.md)
- Universal capability model, lint-format first: [reasoning trace](../reasoning/2026-08-20-universal-capability-model-leaf-first.md)
- DSH audience-fork question, opened then resolved: [envy and the fork](../reasoning/2026-08-23-dsh-envy-and-the-audience-fork.md), [DSH routes to models not hosts](../reasoning/2026-08-23-dsh-routes-to-models-not-hosts.md), [delivery medium not moat](../reasoning/2026-08-23-dsh-delivery-medium-not-moat.md)

## What is still open

The product identity, broad Policy delivery, and plan-time model-assisted
secret-triage disclosure are implemented. Production release still needs fresh
independent review evidence over the final PR bytes and explicit tag
publication. [Current status](../status.md)

The audience-fork question (whether to widen reach with a DSH-derived shell) is
closed as `GA-36`: adaptation quality is the moat and is still unproven, and a
DSH shell is at most an optional, frozen, tier-1 reach play. What remains open
is proof, not architecture — whether Rig's merge-not-overwrite pass on a real
repository actually produces a better result, and whether anyone wants to
install it.

Rig's universal service-depth method is Policy → Context → Evidence: govern,
understand, then prove the change, while using the lowest level that can reach a
definitive answer. All 115 leaves carry Policy contracts; lint-format retains
the deeper repository-specific Context and rerunnable Evidence proof.
