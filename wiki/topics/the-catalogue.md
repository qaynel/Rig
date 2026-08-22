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

`GA-17` adds the product posture behind that shape: when Rig faces a product
fork, choose the hybrid path that adapts to the repository and host instead of
pushing redundant Rig machinery over capabilities already present. The catalogue
exists to improve and amplify what the project already has, with host-side
context doing as much of the updating as possible. [Product-spirit hybrid trace](../reasoning/2026-08-20-product-spirit-hybrid.md)

That makes the catalogue the selection surface for a packaged harness, not a
replacement stack. Rig scans the current repository, recommends the delivered
tools that fit, and leaves the user's existing infrastructure in place unless
the user explicitly chooses a supported setup or alternative. [Packaged harness clarification](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)

## What binds it

`GA-6`, `GA-9`, `GA-9a`–`GA-9n`, and `GA-17` define the model, family contents,
and hybrid product posture. `AD-3`–`AD-5` define its source contract;
`AT-SHAPE-2`–`AT-SHAPE-6` define the observable shape every service must
satisfy. `GA-22`/`GA-23` and `AD-32` fix the Policy → Context → Evidence grade
ladder as the `minimal/mid/maximal` names within each service's domain, and
`AD-33`/`AD-34` add lint-format's component model and plan-bound read-only
execution as the first vertically-proven leaf. [Decision index](../index/decisions.md)
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
- Vertical lint-format production ruling: [reasoning trace](../reasoning/2026-08-20-vertical-lint-format-production.md)
- Consolidated lint-format production intent: [spec](../specs/lint-format-intent.md)
- Current first-leaf production context: [reasoning trace](../reasoning/2026-08-20-lint-format-production-context.md)
- Production grilling gap audit: [reasoning trace](../reasoning/2026-08-20-lint-format-production-grilling-audit.md)
- Release-contract reconciliation for audit questions 1–3: [reasoning trace](../reasoning/2026-08-20-lint-format-grilling-release-contract.md)
- Lint-format hybrid-plus product promise: [reasoning trace](../reasoning/2026-08-20-lint-format-hybrid-plus.md)
- Open-ended, repository-derived ecosystem scope: [reasoning trace](../reasoning/2026-08-20-lint-format-open-ecosystem.md)
- Whole-repository discovery boundary: [reasoning trace](../reasoning/2026-08-20-lint-format-whole-repository.md)
- Universal capability model, lint-format first: [reasoning trace](../reasoning/2026-08-20-universal-capability-model-leaf-first.md)
- First-attempt retrospective (what not to do): [reasoning trace](../reasoning/2026-08-20-first-attempt-retrospective.md)
- Cleanup survey rulings: [reasoning trace](../reasoning/2026-08-20-cleanup-survey-decisions.md)
- Product spirit and hybrid posture: [reasoning trace](../reasoning/2026-08-20-product-spirit-hybrid.md)
- Packaged forward-deployed harness clarification: [reasoning trace](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)
- Per-component, evidence-backed support-claim ruling: [reasoning trace](../reasoning/2026-08-21-lint-format-support-claim.md)
- Approved acceptance-authoring handoff and D21 amendment: [handoff](../specs/lint-format-grilling-handoff.md), [Gate 1 §7H](../gate1/acceptance.md), [acceptance index](../index/acceptance-cases.md)
- Gate 2 v0.6 lint-format re-trace and grade-ladder design: [reasoning trace](../reasoning/2026-08-21-gate2-lint-format-retrace.md), [Gate 2 §5.7–§5.8](../gate2/technical-spec.md#57-the-policy--context--evidence-grade-ladder-d21-ga-2223)

## What is still open

The release direction, product shape, and coverage boundary are settled:
lint-format is the first production leaf in normal Rig, with the default-on
safety baseline and the complete 19-host/six-provider commitment. **This is now
authoritative** — D21 (2026-08-21) amended frozen Gate 1 to narrow the release
condition to this one leaf; the other 114 remain committed but non-blocking for
this release. **Gate 2 has now been re-traced** (v0.6, 2026-08-21): `AT-LF-1`–
`AT-LF-19` are in §13 at exact 68-case equality and the grade ladder is
designed. Gate 2 is still a candidate — a fresh review and the Gate 1 signature
remain before production implementation.
[Status](../status.md)

Lint-format's product promise is also settled as hybrid-plus: existing tools
remain the default, Rig may offer setup or a better supported alternative, and
the user alone chooses whether to adopt it. Its ecosystem scope is open-ended:
Rig builds what is relevant to the repository it lands in rather than selecting
from a fixed ecosystem roster. Discovery covers the whole repository, including
workspaces, nested packages, and polyglot components. The basis for calling an
alternative better remains open.

Every service will eventually use the same cumulative Policy → Context →
Evidence grade method within its own MECE domain. Gate 2 §5.7 (`AD-32`) now
fixes how it works: Policy/Context/Evidence are the `minimal/mid/maximal` names
of the existing cumulative dial, the selected grade is a ceiling, and commodity
syntax/format/type/static output are inputs rather than grades.

**D24 (2026-08-21) changes the release shape from vertical to broad-and-shallow.**
The MVP now ships **all 115 leaves at the Policy rung**, authored in one pass at
agent discretion, each fragment declaring its grade and declaring that it is
untailored baseline practice. This supersedes D21's single-leaf release boundary
for this release. lint-format remains the only leaf with evidence behind it and
the only leaf permitted a claim above Policy. The universal grade ruling is now
permission to author the other leaves **at Policy only**; it is still not
permission to claim Context or Evidence for them.
[ruling](../reasoning/2026-08-21-mvp-agent-discretion-build.md) ·
[roadmap](../specs/mvp-roadmap.md)

### The catalogue now has two shelves

Commit `ff7cea5` (2026-08-21) vendored **55 upstream skills** plus `bin`/`lib`
plumbing into `rig/catalog/skills` and `rig/catalog/plumbing`, renamed into
Rig's namespace so each capability is callable by its Rig name. That commit
updated **zero wiki files**, so this hub is the first place the wiki records
them.

The two shelves are not the same kind of thing and the product must not present
them as one:

| Shelf | What it is | Governance |
|---|---|---|
| **115 service leaves** | Rig's own MECE capability model, `family → group → service → grade`. | Frozen oracle, authored-service gate, declared grade per fragment. |
| **55 swallowed skills** | Vendored upstream method, full judgment intact, renamed. The earlier 56 count was an inventory error. | None yet. Not gated, not graded, and **wired to nothing** — no reference from `rig/lib`, `rig/manifest.json`, `rig/bootstrap.sh`, `scripts`, `tests`, or `package.json`. |

Two consequences carried on the roadmap: the skills must be wired into
materialize and host discovery before they are installable at all, and each
installed copy must carry the approved upstream terms. Provenance is
now pinned to `garrytan/gstack` version `1.60.1.0` at commit `7c9df1c…`, and its
MIT copyright and permission notice is restored beside the vendored files.
That removes the unknown-licence defect; the owner approved distribution with
notice/provenance and no endorsement claim. The 55-count correction and wiring
design are recorded in the [v0.12 retrace](../reasoning/2026-08-22-gate2-v0.12-d24-retrace.md).
