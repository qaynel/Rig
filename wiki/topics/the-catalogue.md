# The à-la-carte catalogue

## What it is

The catalogue is Rig's product surface for engineering capabilities: four
families, divided into groups and 115 independently selectable services, each
with its own grade. A repository scan recommends selections, but the user may
choose any service and grade. [Gate 1 §4–5](../gate1/business-spec.md)

## Why it is this way

Fixed install tiers could not express repo-specific needs and had accumulated
packaging names that no longer matched the product. GA-9 dissolved that stack;
GA-9g removed tier naming entirely, and GA-9k fixed the uniform grain at
`family → group → service → grade`. [Advanced grilling, delivery model](../sources/logs/advanced-grilling.md#delivery-model-ga-9-2026-07-21--à-la-carte-capability--grade-supersedes-the-fixed-tier-stack)

## What binds it

`GA-6`, `GA-9`, and `GA-9a`–`GA-9n` define the model and family contents.
`AD-3`–`AD-5` define its source contract; `AT-SHAPE-2`–`AT-SHAPE-6` define the
observable shape every service must satisfy. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Fixed packages, persisted group selections, grade-specific service identities,
whole-group dependency pulls, and scan-gated installation were rejected because
they hide or override the user's actual per-service choice. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen intent and inventory: [Gate 1 §4–5](../gate1/business-spec.md)
- Data contract: [Gate 2 §5](../gate2/technical-spec.md#5-catalogue-contract)
- Catalogue decisions: [advanced grilling GA-9](../sources/logs/advanced-grilling.md)
- Product-direction review: [reasoning trace](../reasoning/2026-08-19-product-direction-review.md)
- First-attempt retrospective (what not to do): [reasoning trace](../reasoning/2026-08-20-first-attempt-retrospective.md)
- Cleanup survey rulings: [reasoning trace](../reasoning/2026-08-20-cleanup-survey-decisions.md)

## What is still open

All 115 leaves are release commitments, but only the lint-format probe has real
authored behavior; 428 placeholder fragments remain. This is implementation work after Gate 2 freeze,
not a reason to narrow the catalogue. The intent owner attributes the stall to
context rot, and how the leaves get authored — horizontal freeze-then-burn vs
vertical slice-first — is an open delivery fork. [Product-direction review](../reasoning/2026-08-19-product-direction-review.md)
[Status](../status.md)
