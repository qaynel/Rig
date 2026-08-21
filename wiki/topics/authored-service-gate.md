# The authored-service gate

## What it is

Every one of the 115 catalogue leaves must pass both mechanical authorship
checks and a fresh-context semantic/MECE review. File presence, non-empty text,
or a shared template is not evidence that a service has been meaningfully
authored. [Gate 2 §5.6](../gate2/technical-spec.md#56-authored-service-gate)

## Why it is this way

The repository already contains 432 placeholder files that satisfy shallow
inventory tests. GA-10 made every leaf a production commitment after that audit,
so the gate is explicitly designed to detect syntactic completion without
service-specific semantics. [Advanced grilling GA-10](../sources/logs/advanced-grilling.md#ga-10--re-grill-after-implementation-audit-2026-07-25)

## What binds it

`GA-10b`, `GA-10c`, `AD-15`, and `AT-SHAPE-5/6` require real content and exactly
one honest disposition per service. Slice 2 creates the gate; Slice 14 authors
the leaves sequentially. [Decision index](../index/decisions.md)
[Gate 2 Slices 2 and 14](../gate2/technical-spec.md#14-ordered-tracer-bullet-slices)

## What was rejected

Parallel bulk authoring, template-driven generation, mechanical presence as a
semantic proxy, and generic convention fallbacks were rejected because they
recreate the placeholder failure at greater scale. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen service obligation: [Gate 1 AT-SHAPE-5/6](../gate1/acceptance.md#a-archetype--the-shared-service-shape-every-catalogue-service-must-pass)
- Exact checks: [Gate 2 §5.6](../gate2/technical-spec.md#56-authored-service-gate)
- Audit history: [advanced grilling GA-10](../sources/logs/advanced-grilling.md)
- First-leaf behavior ruling: [reasoning trace](../reasoning/2026-08-20-lint-format-confirmations.md)
- Bounded first-leaf design: [lint-format vertical slice](../specs/lint-format-vertical-slice.md)
- Vertical lint-format production ruling: [reasoning trace](../reasoning/2026-08-20-vertical-lint-format-production.md)
- Current first-leaf production context: [reasoning trace](../reasoning/2026-08-20-lint-format-production-context.md)
- Production grilling gap audit: [reasoning trace](../reasoning/2026-08-20-lint-format-production-grilling-audit.md)
- Release-contract reconciliation for audit questions 1–3: [reasoning trace](../reasoning/2026-08-20-lint-format-grilling-release-contract.md)
- Lint-format hybrid-plus product promise: [reasoning trace](../reasoning/2026-08-20-lint-format-hybrid-plus.md)
- Exact Policy → Context → Evidence capability model: [reasoning trace](../reasoning/2026-08-20-linting-harness-capability-model.md)
- Universal model with lint-format-only current focus: [reasoning trace](../reasoning/2026-08-20-universal-capability-model-leaf-first.md)
- Current state and ordered path to production for this leaf: [lint-format roadmap](../specs/lint-format-roadmap.md)

## What is still open

No leaf has passed this gate because the gate itself is unimplemented. The
lint-format leaf has focused authored-content tests and real service-specific
content, but production still requires the actual mechanical gate plus a fresh
exact-digest semantic/MECE review receipt. [Status](../status.md#what-exists-in-the-code-today)

The lint-format leaf now has a hybrid-plus promise: preserve repository-owned
tools, offer supported setup when needed, and surface a better Rig-supported
alternative for the user to decide. Checks and CI remain read-only. This is not
evidence that the authored-service gate has passed, and the current
`convention-only` label no longer describes the whole promised lifecycle.

The intended grades are now Policy → Context → Evidence, not formatter-only →
formatter-plus-linter → CI-plus-fix. This method is universal, but every leaf
must apply it only inside its owned domain. Current authorship remains focused
on lint-format as the first proof; no other leaf gains authored status from the
universal ruling.
