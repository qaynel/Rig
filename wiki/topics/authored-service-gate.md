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

**D23 (2026-08-21) is a one-release exception, not a change to the gate's
standing scope.** `AT-SHAPE-6` still requires all 115 leaves eventually, but
for this release only, the specification gate evaluates it against
`development.code-quality.lint-format` alone — the other 114 leaves' current
placeholder state does not fail the gate this pass. This exists because the
gate's literal all-115 wording was never narrowed to match D21's release
boundary, and left unscoped would have kept `npm test` red forever on leaves
D21 already said don't block this release. It reverts to covering all 115
leaves next release unless a further amendment defines a standing "evaluate
only what ships" mechanism — deliberately deferred, not decided here. See
[the reasoning trace](../reasoning/2026-08-21-at-shape-6-one-release-exception.md)
and Gate 1's D23 revision note. **Gate 2 v0.10 carries this exception**
(§5.6, §12.3, §17.2, `AD-24`, and the `AT-SHAPE-6` row in §13) as checkable
acceptance criteria, not prose, and clarifies that Slice 2's code tests keep
the other 114 leaves red as catalogue status without making that expected state
a lint-format release `npm test` failure — see
[the retrace trace](../reasoning/2026-08-21-gate2-v0.9-at-shape-6-retrace.md)
and [the round-6 correction trace](../reasoning/2026-08-21-gate2-v0.10-round6-corrections.md).

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

**D24 (2026-08-21) suspends sequential authorship for this release only.** The
intent owner ruled that all 115 leaves are authored in one pass at agent
discretion, at the **Policy** rung, rather than one at a time with the owner in
the room. This overrides locked decision 8 (one at a time, single context, never
templated, never parallel) for the MVP release.

D24 does not claim the GA-10 reasoning was wrong. It claims that reasoning
targets a different artifact. What GA-10 rejected is generic content *presented
as coverage*: a fragment that reads as authored, satisfies the mechanical
checks, and thereby implies the service is handled when it is not. What D24
authorises is generic content *presented as generic*: a fragment that states
baseline practice for its domain and declares on its face that it is Policy-rung
and untailored. The declared grade is the entire difference. **A fragment
authored under D24 that reads as coverage is the old defect wearing new words.**

What D24 leaves untouched: the safety baseline. A missing or malformed binding
is still a named, nonzero coverage gap, never a silent skip and never a
fabricated pass. No leaf authored under D24 may claim Context or Evidence grade;
lint-format remains the only leaf permitted a higher claim, on its own evidence.

What D24 consciously sets aside, recorded rather than left implicit: under it the
agent authors the content **and** sets the bar that content is judged against,
because per-leaf owner review is waived. This release therefore does not
demonstrate the property Rig exists to prove. It is reversible one leaf at a
time by promotion under the ordinary gate.
[ruling](../reasoning/2026-08-21-mvp-agent-discretion-build.md) ·
[owner approval](../reasoning/2026-08-21-d24-owner-approval.md) ·
[roadmap](../specs/mvp-roadmap.md)

D24 is now in both Gate 1 files and **retires D23's one-release exception**.
`AT-SHAPE-6` covers all 115 leaves in the signed-oracle candidate; its
executable target must be red before authoring and green only when all leaves
carry real, declared Policy content.
[v0.12 retrace](../reasoning/2026-08-22-gate2-v0.12-d24-retrace.md)
