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
