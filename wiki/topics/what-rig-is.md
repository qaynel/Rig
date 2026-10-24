# What Rig is

Rig is a host-agnostic agent workflow and à-la-carte engineering catalogue,
installed into an existing repository from one central corpus. It includes a
mandatory agent-technology safety baseline and lets users select the
capabilities useful to their work. Rig does not ship a model runtime or model
key. [Gate 1 §1–2](../gate1/business-spec.md) ·
[corpus architecture](../reasoning/2026-09-08-dynamic-offboarding-architecture-brainstorm.md)

## Onboarding

The installer detects known host entrypoints and projects the corpus into the
repository. The user's own host agent then reads Rig's onboarding instructions,
inspects the project, and proposes the smallest useful set of skills and
services to graft onto existing infrastructure. Rig code does not infer
project needs from repository shape; the user reviews the proposed changes.
Repository-specific state stays under `.rig/`.
[Owner-locked Path B direction](../reasoning/2026-08-31-path-b-product-direction.md) ·
[Onboarding flow](onboarding-flow.md)

## Product shape

The corpus contains the workflow, standards, onboarding instructions, and
service catalogue. Native host files are deterministic projections for the
entrypoints the repository already uses. The service catalogue is organized
as `family → group → service → grade`; skills are organized by capability.
Third-party skills are fetched from pinned upstream sources during onboarding.
The former install-package tiers are retired; the legacy flag remains
compatible for one release. Scripts, Markdown, and MCP may ship as part of the
workflow. [Catalogue](the-catalogue.md) ·
[release and distribution](distribution-and-release.md)

## Why

Rig complements repository tooling instead of replacing it. One shared corpus
keeps the product consistent across hosts, while the repository's own agent can
use local context to choose how the workflow fits. The owner settled this
product direction as agent-led, adaptive onboarding with minimal grafts and
human review of consequential changes.
[Product direction archive](../archive/2026-08/path-a-and-path-b-onboarding.md) ·
[architecture record](../reasoning/2026-09-08-dynamic-offboarding-architecture-brainstorm.md)

The owner has directed a product-first AI-SDLC expansion: Rig should make the
host agent carry the engineering process from idea to delivery while the human
provides intent, product judgement and protected authorisations. The 8 KB
active memory view, adaptive model routing, automatic trace lifecycle and
source-level open-source integration are approved planning requirements, not
implemented claims. See the [owner directive](../reasoning/2026-10-23-ai-sdlc-product-first-owner-directive.md)
and the [in-flight research checkpoint](../reasoning/2026-10-23-product-first-scope-research-checkpoint.md).
The [architecture progress trace](../reasoning/2026-10-24-product-first-sow-architecture-progress.md)
records the first SOW correction: the active view is only one layer of the
complete product, with source-level reuse and lifecycle verification still in
flight.

The [product-first source and journey checkpoint](../reasoning/2026-10-24-product-first-source-and-journey-checkpoint.md) records the proposed full install-to-learning journey, pinned source-level inheritance and bounded automatic improvement. The [planning package](../specs/ai-sdlc-harness/README.md) is a proposal; current QA release state remains separate.

[Acceptance reconciliation checkpoint](../reasoning/2026-10-24-product-first-acceptance-reconciliation-checkpoint.md) records the current planning state and remaining checks.

[Wiki validation checkpoint](../reasoning/2026-10-24-product-first-wiki-validation-checkpoint.md) records the current check results.

[Source matrix finalisation checkpoint](../reasoning/2026-10-24-product-first-matrix-finalisation-checkpoint.md) records the scenario and matrix completion.

The [final-definition owner directive](../reasoning/2026-10-24-final-product-definition-owner-directive.md)
requires atomic bidirectional traceability and a polished public-product
roadmap. The [contract checkpoint](../reasoning/2026-10-24-final-product-contract-checkpoint.md)
and [architecture checkpoint](../reasoning/2026-10-24-final-product-architecture-checkpoint.md)
record the initial atomic proposal, full lifecycle, interaction diagrams and work
packages. The [traceability audit](../specs/ai-sdlc-harness/20-traceability-audit.md)
states the remaining signing prerequisites and the settled offline-search requirement.
The [traceability validation checkpoint](../reasoning/2026-10-24-final-product-traceability-validation.md)
records the draft graph audit and clean wiki checks.
The [planning handoff](../reasoning/2026-10-24-final-product-planning-handoff.md)
records the earlier open choice and signing prerequisites; the choice is now settled.
The [coverage refinement](../reasoning/2026-10-24-final-product-coverage-refinement.md)
records the earlier 76-row audit after four omitted obligations were made explicit.
The [offline-search owner ruling](../reasoning/2026-10-24-offline-semantic-search-owner-decision.md)
requires meaning-based recall from shipped local assets on a fresh public install;
the current [84-row contract](../specs/ai-sdlc-harness/15-gate1-contract.md)
keeps cited lexical search as a failure fallback. This is planned, not shipped.
The [planning validation](../reasoning/2026-10-24-offline-semantic-search-planning-validation.md)
records the earlier 79-row graph audit and remaining implementation evidence.
The [signing-readiness record](../reasoning/2026-10-24-ai-sdlc-signing-ready.md)
records the current 84-row contract, complete derived protected set and green
repository gate.

## What was rejected

Fixed install bundles, a Rig-owned model loop, and replacing working repository
infrastructure with parallel Rig copies were rejected. The obsolete tier
taxonomy is kept only in the archive for historical reference.
[Rejected approaches](../index/rejected.md) ·
[superseded taxonomy](../archive/deprecated-tier-taxonomy/README.md)

## Authorities and current work

- Product intent: [Gate 1](../gate1/business-spec.md)
- Technical design: [Gate 2](../gate2/technical-spec.md)
- Current QA/prod checkpoint: [closeout](the-overhaul.md)
- Archived product-origin discussion: [August product direction](../archive/2026-08/what-rig-is-product-direction-and-dsh.md)

## Public documentation

The [product overview](../../docs/vision.md), [architecture](../../docs/architecture.md)
and [installation guide](../../docs/install.md) explain the approved adaptation,
managed additions, and installed safety baseline. Rig source-release signing
and deployment checks are separate from installed target controls.
[Overhaul record](../reasoning/2026-10-17-documentation-overhaul.md) ·
[Review corrections](../reasoning/2026-10-17-documentation-review-corrections.md)

One-to-one traceability is now a shipped Rig capability rather than a habit of
this project: requirement, one primary acceptance criterion, one proving test,
evidence. `.rig/bin/check-traceability.js` lands on every default install and
the router makes it a pre-signing gate. The
[preparation record](../reasoning/2026-10-24-gate1-preparation-complete.md)
holds what was built and what is still unproven; the
[footprint measurement](../reasoning/2026-10-24-offline-embedding-footprint-measurement.md)
replaces the assumed cost of offline semantic search with a measured one.
