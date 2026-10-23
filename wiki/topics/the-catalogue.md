# The à-la-carte catalogue

## What it is

Rig provides one canonical engineering-services catalogue with 115 services,
organized as `family → group → service → grade`. Each service offers
cumulative `minimal / mid / maximal` guidance, mapped to Policy, Context, and
Evidence assurance within its declared scope. Recommendations are advisory;
the user's host agent proposes relevant services and the user can review the
selection. [Catalogue contract](catalogue-contract.md)

The skill catalogue is separate from service selection. Core workflow skills
come from the central corpus; optional third-party skills are fetched from
pinned upstream sources during onboarding when selected. The skill index and
upstream metadata are not a second services catalogue.
[Onboarding flow](onboarding-flow.md) ·
[upstream trace](../reasoning/2026-10-14-closure-shelf-removal.md)

## Current release shape

The service definitions and authored guidance live in
[`rig/corpus/catalogue.json`](../../rig/corpus/catalogue.json) and
[`rig/corpus/services/`](../../rig/corpus/services/). Each entry names its
scope, dependencies, grade guidance, checks, evidence, and coverage limits.
The authored-service gate checks for boilerplate and repeated content. A
configuration-only check does not claim live-infrastructure assurance.
[Authored-service gate](authored-service-gate.md) ·
[authorship proof](../reasoning/2026-10-14-closure-authorship-complete.md)

The earlier duplicate service catalogue and its untailored fragments under
`rig/catalog/` were removed; `rig/corpus/` is the sole services source. The
separate skill index remains for pinned optional upstream metadata.
[Duplicate retirement](../reasoning/2026-10-17-retire-the-duplicate-services-catalogue.md)

## Why

Fixed install bundles could not express repository-specific needs. Services
remain individually selectable, and their grades show what evidence is
available for each selected service. The user's host agent uses repository
context to propose a small useful set; the installer does not choose services
from repository shape.
[Owner-locked direction](../reasoning/2026-08-31-path-b-product-direction.md)

## What was rejected

Installing every optional skill into every repository, replacing existing
tooling with parallel copies, and inferring project needs from language or
framework labels were rejected. The installed agent receives the capability
catalogue and makes a contextual proposal for the user to review. The first
adaptation evaluation records the evidence that led to this direction; its
old recommendation to prune at install time is historical.
[Adaptation evaluation](../archive/2026-08/path-a-and-path-b-onboarding.md)

## Authorities and sources

- Frozen intent: [business specification](../gate1/business-spec.md)
- Working design: [technical specification](../gate2/technical-spec.md#5-catalogue-contract)
- Historical catalogue direction: [D24 record](../archive/2026-08/release-install-and-distribution.md)
- Current release state: [QA/prod closeout](the-overhaul.md)

## What is still open

The 115 services meet the current Policy authorship contract. Any future grade
advancement needs repository use and additional evidence; prose alone does not
raise a service's assurance. [Release checkpoint](the-overhaul.md)
