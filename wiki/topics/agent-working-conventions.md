# Agent working conventions

Rig's workflow lives in one canonical corpus. The installed repository's host
agent reads the onboarding instructions, inspects the repository, and proposes
the smallest useful set of capabilities to graft onto existing infrastructure.
Rig code does not infer which capabilities the repository needs.
[Product direction](../reasoning/2026-08-31-path-b-product-direction.md) ·
[onboarding flow](onboarding-flow.md)

## What it is

Start each task with [`rig/corpus/routing.md`](../../rig/corpus/routing.md).
It names the phase owner and the relevant skill. Multi-step work reads
[`wiki/agent-primer.md`](../agent-primer.md), checks the linked product and
technical record, and keeps the wiki current with the work. A long task records
what is done, in flight, and next at least every three minutes; regenerate the
status and trace indexes with `node scripts/build-wiki-index.js`.

The implementation rule favors deletion, reuse, standard-library and native
features, and the smallest working change. Validate trust boundaries and leave
one runnable check for non-trivial behavior. Communication gives the user the
real options and consequences, one recommendation, and one decision at a time.
The canonical rules are in `rig/corpus/rules/`; host entrypoints project them.

## Proposed full-product workflow

The owner directed a complete agent-led journey from onboarding and intent to signed acceptance, editable design, implementation, verification, release and continuous learning. The three-minute trace cadence remains; a later local compactor will retain source fidelity while moving old records out of the active view. Deterministic scripts and a suitable low-cost model come first, with bounded escalation to stronger judgement. This is a planning requirement, not current shipped behavior. [Owner directive](../reasoning/2026-10-23-ai-sdlc-product-first-owner-directive.md) · [source and journey checkpoint](../reasoning/2026-10-24-product-first-source-and-journey-checkpoint.md)

[Acceptance reconciliation checkpoint](../reasoning/2026-10-24-product-first-acceptance-reconciliation-checkpoint.md) records the current planning state and remaining checks.

The [final-definition owner ruling](../reasoning/2026-10-24-final-product-definition-owner-directive.md)
requires a deterministic bidirectional graph check before signing and before
worker dispatch. The [architecture checkpoint](../reasoning/2026-10-24-final-product-architecture-checkpoint.md)
records the proposed coordinator/worker boundaries, six interaction sequences
and public-release work packages; none is implemented by the planning pass.
The [validation checkpoint](../reasoning/2026-10-24-final-product-traceability-validation.md)
records the current draft coverage and wiki checks.
The [planning handoff](../reasoning/2026-10-24-final-product-planning-handoff.md)
states the next authorized preparation steps; its pending choice is now settled.
The [coverage refinement](../reasoning/2026-10-24-final-product-coverage-refinement.md)
records the current graph count and four newly explicit behaviors.
The [offline-search owner ruling](../reasoning/2026-10-24-offline-semantic-search-owner-decision.md)
requires a shipped local meaning-search path in the public product. The
current 84-row draft adds offline clean-install, zero-call, index-upgrade and
token-efficiency checks; lexical recall remains a cited failure fallback.

The [signing-readiness record](../reasoning/2026-10-24-ai-sdlc-signing-ready.md)
records the complete derived signing set, expected preimplementation-red
baseline and green repository gate.

## Why it is this way

One corpus avoids competing lifecycle instructions. Repository-aware choices
belong to the user's host agent, which can use the repository's real context;
the installer handles deterministic projection. The design preserves existing
infrastructure and adds only a useful gap.
[Product direction](../archive/2026-08/path-a-and-path-b-onboarding.md)

## What binds it

- [`CLAUDE.md`](../../CLAUDE.md) records owner-locked product decisions and
  points at canonical lifecycle standards.
- [`wiki/agent-primer.md`](../agent-primer.md) is the mandated first wiki read
  for multi-step work.
- [`rig/corpus/standards/ai-sdlc.md`](../../rig/corpus/standards/ai-sdlc.md)
  defines evidence for implementation and review.
- [`rig/corpus/standards/delivery-sop.md`](../../rig/corpus/standards/delivery-sop.md)
  orders multi-step execution; the
  [deployment policy](../../rig/corpus/standards/change-management.md) orders
  QA and production promotion.
- The post-release maintenance routine is the
  [`wiki-maintenance` skill](../../.agents/skills/wiki-maintenance/SKILL.md).
  Its trace-body immutability and Gate 1/Gate 2 restrictions apply when
  maintaining the wiki.

## What was rejected

Separate workflow copies, guessed per-host capability selection, and a
deterministic rule engine that maps repository types to installed skills were
rejected. The host agent makes those contextual choices after inspecting the
repository; Rig provides the shared tools and explicit approval points.
[Decision record](../archive/2026-08/path-a-and-path-b-onboarding.md)

## What is still open

The three-minute checkpoint is an instruction rather than an automated timer.
The closeout task list records the remaining release and owner actions:
[task list](../specs/close-everything/task-list.md) ·
[release checkpoint](the-overhaul.md).
