# Catalogue contract

## What it is

The catalogue contract gives every family, group, service, grade slice, and
dependency a canonical identity. Grades are cumulative and dependencies pull
only named slices; a dependency never replaces the user's selection or raises
its grade. [Gate 2 §5.1–5.4](../gate2/technical-spec.md#5-catalogue-contract)

## Why it is this way

Stable leaf identities make selection, receipts, reports, and compatibility
deterministic. Strictly growing check-ID sets prove that `maximal` adds depth
instead of quietly becoming a different service. Razor-scoped dependencies
preserve user control while avoiding warn-and-stop installs. [Gate 1 §2](../gate1/business-spec.md)
[Advanced grilling GA-9a and GA-9k](../sources/logs/advanced-grilling.md)

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
- First convention-leaf ruling: [reasoning trace](../reasoning/2026-08-20-lint-format-confirmations.md)
- Bounded first-leaf design: [lint-format vertical slice](../specs/lint-format-vertical-slice.md)
- Lint-format hybrid-plus product promise: [reasoning trace](../reasoning/2026-08-20-lint-format-hybrid-plus.md)
- Open-ended, repository-derived ecosystem scope: [reasoning trace](../reasoning/2026-08-20-lint-format-open-ecosystem.md)
- Whole-repository discovery boundary: [reasoning trace](../reasoning/2026-08-20-lint-format-whole-repository.md)
- Semantic command discovery: [reasoning trace](../reasoning/2026-08-20-lint-format-semantic-discovery.md)
- Exact Policy → Context → Evidence capability model: [reasoning trace](../reasoning/2026-08-20-linting-harness-capability-model.md)
- Universal model with lint-format-only current focus: [reasoning trace](../reasoning/2026-08-20-universal-capability-model-leaf-first.md)
- Partial, truthful lint-format coverage: [reasoning trace](../reasoning/2026-08-20-lint-format-partial-coverage.md)
- Gate 2 grade-ladder and lint-format mechanism design: [reasoning trace](../reasoning/2026-08-21-gate2-lint-format-retrace.md), [Gate 2 §5.7–§5.8](../gate2/technical-spec.md#57-the-policy--context--evidence-grade-ladder-d21-ga-2223)

## What is still open

The contract is designed but not frozen or implemented. The authored-service
gate must later prove that mechanically valid leaves also carry real,
service-specific meaning. [Authored-service gate](authored-service-gate.md)

For lint-format, the product promise is hybrid-plus. Rig preserves and adapts to
the repository's existing toolchain by default. If no supported setup exists,
Rig may offer one; if Rig knows a better supported alternative, it brings that
choice to the user. Setup or replacement never happens without the user's
decision. The exact meaning of “better” and the generated setup contract still
need to be bounded in the lint-format grilling.

Ecosystem breadth itself is not bounded by a predetermined language or package
manager list. Rig must derive and build what is relevant from the repository it
lands in. Truthful failure behavior when the needed capability cannot be built
remains open.

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
[reasoning trace](../reasoning/2026-08-21-gate2-v0.7-round4-corrections.md)).
Conventional syntax, formatting, type, and ordinary static analysis are commodity
inputs rather than this ladder's differentiator.

This method is universal across catalogue services, but domain ownership stays
per leaf. Policy, context, and evidence for lint-format must concern only the
lint-format domain; examples from security or infrastructure illustrate the
method without transferring those capabilities into this leaf. Current work
specifies and proves only lint-format. The other leaves inherit the universal
method later and are not being authored now.

If Rig cannot build the minimum Policy level for every discovered component,
lint-format may still install for the covered components. The proposed plan
names every excluded component for user approval, reports it as unprotected,
and suppresses the whole-repository support claim. An advisory-only fallback
does not count as coverage.
