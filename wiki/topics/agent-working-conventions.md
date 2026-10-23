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
