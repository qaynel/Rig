# Catalogue contract

## What it is

The catalogue contract gives every family, group, service, grade slice, and
dependency a canonical identity. Grades are cumulative and dependencies pull
only named slices; a dependency never replaces the user's selection or raises
its grade. [Gate 2 §5.1–5.4](../gate2/technical-spec.md#5-catalogue-contract)

The signed AT-PB-1 oracle pins the active 115-service corpus at
`rig/corpus/catalogue.json` and `rig/corpus/services/`. The corpus has
service-specific identity, minimal, mid, maximal, and slice guidance, and the
signed AT-SHAPE-6 oracle rejects generic-baseline wording in authored service
fragments. Coherence and corpus-contract proofs also pass
([closeout trace](../reasoning/2026-10-14-closure-coherence-green.md)). The
older unsigned-candidate account is preserved as historical evidence
([candidate evidence](../reasoning/2026-10-14-closure-candidate-advisories.md)).
The [QA candidate-preparation checkpoint](../reasoning/2026-10-18-qa-closeout-followup-candidate-prep.md)
records a disposable-install assertion for the shipped skills README and direct
checks of these signed authority statements.

## Why it is this way

Stable leaf identities make selection, receipts, reports, and compatibility
deterministic. Strictly growing check-ID sets prove that `maximal` adds depth
instead of quietly becoming a different service. Razor-scoped dependencies
preserve user control while avoiding warn-and-stop installs. [Gate 1 §2](../gate1/business-spec.md)
[Advanced grilling GA-9a and GA-9k](../sources/logs/advanced-grilling.md)

The skill shelf follows the same identity rule: two sources may not silently
share a declared name. Catalogue generation rejects the collision and names
both source locations rather than changing one skill's identity to fit its
directory. [Duplicate-name trace](../reasoning/2026-09-01-path-b-hardening-issue5-dupname.md)

## What binds it

`AD-3` fixes source ownership, `AD-4` fixes cumulative grades, and `AD-5` fixes
dependency resolution. `GA-16` fixes lint-format's hybrid-plus product promise,
`GA-19` makes its ecosystem applicability repository-derived rather than a
fixed roster, and `GA-20` sets the whole repository as its discovery boundary.
`GA-21` requires semantic command discovery. `AT-SHAPE-3` and `AT-SHAPE-4`
are the frozen observable tests. `GA-22` replaces the prototype's tool-feature
ladder with the cumulative Policy → Context → Evidence capability model, and
Gate 2 `AD-32` now realizes it as the `minimal/mid/maximal` names of the same
cumulative dial (§5.7). `AD-33` fixes lint-format's component model and `AD-34`
its plan-bound read-only execution (§5.8/§9.4).
[Decision index](../index/decisions.md) [Acceptance index](../index/acceptance-cases.md)

## What was rejected

Dependency-grade escalation, whole-group pulls, grade-specific service IDs,
duplicate full prose per host, YAML, and a template engine were rejected as
either user-choice violations or unnecessary machinery. [Gate 2 §2.1](../gate2/technical-spec.md#21-rejected-approaches)

## Authorities and sources

- Business rules: [Gate 1 §2 and §5](../gate1/business-spec.md)
- Exact schema and algorithms: [Gate 2 §5](../gate2/technical-spec.md#5-catalogue-contract)
- Original rulings: [advanced grilling](../sources/logs/advanced-grilling.md)
- First convention-leaf ruling: [reasoning trace](../archive/2026-08/lint-format-vertical-slice.md)
- Bounded first-leaf design: [lint-format vertical slice](../specs/lint-format-vertical-slice.md)
- Lint-format hybrid-plus product promise: [reasoning trace](../archive/2026-08/lint-format-vertical-slice.md)
- Open-ended, repository-derived ecosystem scope: [reasoning trace](../archive/2026-08/lint-format-vertical-slice.md)
- Whole-repository discovery boundary: [reasoning trace](../archive/2026-08/lint-format-vertical-slice.md)
- Semantic command discovery: [reasoning trace](../archive/2026-08/lint-format-vertical-slice.md)
- Exact Policy → Context → Evidence capability model: [reasoning trace](../archive/2026-08/lint-format-vertical-slice.md)
- Universal model with lint-format-only current focus: [reasoning trace](../archive/2026-08/lint-format-vertical-slice.md)
- Strict duplicate skill names: [reasoning trace](../reasoning/2026-09-01-path-b-hardening-issue5-dupname.md)
- Frozen-test drift during duplicate-name hardening: [reasoning trace](../reasoning/2026-09-01-path-b-hardening-issue5-test-drift.md)
- Final duplicate-name hardening review: [reasoning trace](../reasoning/2026-09-02-path-b-hardening-final-review.md)
- Partial, truthful lint-format coverage: [reasoning trace](../archive/2026-08/lint-format-vertical-slice.md)
- Gate 2 grade-ladder and lint-format mechanism design: [reasoning trace](../archive/2026-08/lint-format-vertical-slice.md), [Gate 2 §5.7–§5.8](../gate2/technical-spec.md#57-the-policy--context--evidence-grade-ladder-d21-ga-2223)

## Current delivery

The catalogue is implemented as a completed family → group → service → grade
contract. All 115 services have service-specific guidance, declared checks and
an explicit assurance ceiling. A selected service uses available repository
tools; a missing tool is a named coverage gap with setup guidance, never a
passing result. The historical lint-format-first discussion below explains the
origin of the model; it is not current delivery scope.

The repository boundary is whole-repository: root projects, workspaces, nested
packages, and polyglot components all participate in discovery and the proposed
plan. The user may deselect components before apply; discovery does not bypass
plan approval or make every discovered mutation automatic.

Within each component, Rig discovers lint/format behavior semantically from the
component's manifests, tool configuration, and declared tasks. Fixed script
names are not the contract, and Rig does not bypass a repository-owned workflow
just because it recognizes the underlying binary. Ambiguous matches require the
user to choose.

The grade split is exactly cumulative Policy → Context → Evidence: Level 1
governs a proposed repository change against explicit policy; Level 2 adds
system-wide relationship reasoning; Level 3 adds mechanically or empirically
verifiable behavioural evidence. The selected grade is the target and the
ceiling: evaluation climbs to it and no further. "Lowest level capable of a
definitive answer" short-circuits on **failure**, not on a clean pass — a
lower-grade failure may stop early (a change that fails governance cannot earn a
higher assurance), but a clean lower-grade result runs through to the selected
grade, and the reported assurance is the highest grade actually completed. A
clean Policy pass under a Context or Evidence selection never becomes the final
verdict while the selected grade's own work is still unrun (Gate 2 v0.7,
[reasoning trace](../archive/2026-08/gate-model-and-the-one-lock.md)).
Conventional syntax, formatting, type, and ordinary static analysis are commodity
inputs rather than this ladder's differentiator.

This method is universal across catalogue services, but domain ownership stays
per leaf. Policy, context, and evidence for lint-format concern only the
lint-format domain; examples from security or infrastructure illustrate the
method without transferring those capabilities into this leaf.

If Rig cannot build the minimum Policy level for every discovered component,
lint-format may still install for the covered components. The proposed plan
names every excluded component for user approval, reports it as unprotected,
and suppresses the whole-repository support claim. An advisory-only fallback
does not count as coverage.

The earlier closure work is retained as historical reasoning in
[2026-10-13-catalogue-04-discovery](../reasoning/2026-10-13-catalogue-04-discovery.md).
