---
status: current
checked: 2026-10-24
owner: rig-product-design
---

# Rig AI-SDLC harness — contract, design and implementation

Contract, editable technical design and local implementation record. Originally authored 2026-10-23 under the owner's
stop-and-scope directive, then revised under the
[product-first directive](../../reasoning/2026-10-23-ai-sdlc-product-first-owner-directive.md)
and the [final-definition directive](../../reasoning/2026-10-24-final-product-definition-owner-directive.md).
The named decisions in that directive are approved; the expanded architecture
and acceptance package is a proposed design. Bounded implementation has since
landed in the working tree, but the public product is incomplete and
unpublished. Current counts and remaining boundaries are recorded in the [deployment tracker](23-deployment-tracker.md); the [prepared amendment](22-oracle-amendment-request.md) is unapplied. Exact source inheritance is in the reuse ledger below.
The [offline-search owner ruling](../../reasoning/2026-10-24-offline-semantic-search-owner-decision.md)
requires packaged local meaning-based memory search in the public release.
The 84-row contract includes its offline install and upgrade checks and the
owner's frozen token-efficiency obligations (R080–R084). The owner
then approved the direction and authorised bounded Gate 1 preparation; that work
is done. The proving tests exist in `tests/ai-sdlc/`, the traceability validator
ships in the install baseline, and the signer selects this programme under the
existing key. The new programme contract is signed; the separate 6.0.0 oracle remains
protected and untouched. See [signing instructions](../../gate1/ai-sdlc/signing-instructions.md)
for the recorded ceremony and status commands.

## Read in this order

| # | Document | Answers |
|---|---|---|
| 0 | [Executive architecture summary](00-executive-summary.md) | What is the system, in two pages |
| 1 | [Atomic approval candidate](15-gate1-contract.md) | Complete requirement, primary acceptance and proving-test graph |
| 2 | [Proving-test manifest](16-test-manifest.md) | Exact fixtures, planned executable test homes and graph-validator obligation |
| 3 | [Complete customer lifecycle](17-customer-lifecycle.md) | Thirteen phases and twenty mapped end-to-end journeys |
| 4 | [System interactions](18-system-interactions.md) | Source-controlled architecture and six critical sequences |
| 5 | [Work packages and public roadmap](19-work-packages-and-public-roadmap.md) | Dependency-aware coordinator handoff through public release |
| 6 | [Traceability audit](20-traceability-audit.md) | Old-to-new mapping, contradictions and honest sign readiness |
| 7 | [Product definition](01-product-definition.md) | Vision, users and original 22 functional/10 nonfunctional headings |
| 8 | [Open-source inheritance matrix](12-reuse-plan.md) | Pinned source, licence and selected disposition for all capabilities |

## Supporting current and historical views

| # | Document | Answers |
|---|---|---|
| 2 | [System architecture](02-architecture.md) | Components, contracts, data flow, trust boundaries |
| 3 | [Capability specifications](03-capabilities.md) | Each capability: problem, contract, approach, tests |
| 4 | [End-to-end lifecycle](04-lifecycle.md) | Full A–H journey, states and scenario-level roles |
| 5 | [Recursive improvement](05-recursive-improvement.md) | What may self-improve, and what stops it |
| 6 | [Delivery roadmap](06-roadmap.md) | Phases, dependencies, acceptance, risks |
| 7 | [Capability inventory and gap analysis](07-capability-inventory.md) | What exists, what is partial, what must be built |
| 8 | [Earlier acceptance matrix](08-acceptance-matrix.md) | Eighteen preserved supplemental checks |
| 9 | [Decision register](09-decision-register.md) | Owner-settled rulings and implementation choices |
| 10 | [Current-state preservation report](10-current-state.md) | Uncommitted work, release blockers, exact test results |
| 11 | [Scope-drift audit](11-drift-audit.md) | Requirements overlooked, narrowed or misread this session |
| 12 | [Open-source inheritance matrix](12-reuse-plan.md) | Pinned upstream source, licence, exact adaptation and verification per capability |
| 13 | [Prepared commits](13-commit-plan.md) | Reviewable change groups; stale command recipe withdrawn |
| 14 | [Draft transferable preferences](14-preference-profile-draft.md) | Agent-inferred one-page export to illustrate the approved active-view cap; content remains unapproved |
| 21 | [Open-source quality audit](21-open-source-quality-audit.md) | OpenSSF Baseline / GitHub-guide governance audit: covered vs missing, existing-release remediation vs product requirements, and proposed R085 (bundled-asset SBOM) held for owner approval |

The earlier builder-mode [design.md](design.md) is retained with a superseded marker as a
historical draft. Its assertion that the technical design is signed was
corrected by the [signature-scope audit](../../reasoning/2026-10-23-ai-sdlc-signature-scope-audit.md).

## Sources of truth this package is built from

- Owner vision, verbatim: [vision trace](../../reasoning/2026-10-23-ai-sdlc-harness-expansion-owner-vision.md)
- Owner frustrations, with citations: [frustration profile](../../reasoning/2026-10-23-owner-frustration-profile.md)
- The verified root cause: [circles diagnosis](../../reasoning/2026-10-23-why-the-cycle-runs-in-circles.md)
- Open-source evaluation: [harness survey](../../reasoning/2026-10-23-open-source-harness-survey.md)
- The one implemented repair: [review state machine](../../reasoning/2026-10-23-review-state-machine-positive-evidence.md)
- The product-first owner decisions: [directive](../../reasoning/2026-10-23-ai-sdlc-product-first-owner-directive.md)
- The final traceability and public-product directive: [owner source](../../reasoning/2026-10-24-final-product-definition-owner-directive.md)
- The offline semantic search decision: [owner source](../../reasoning/2026-10-24-offline-semantic-search-owner-decision.md)
- Settled, never re-asked: the North star block at the top of `CLAUDE.md`

## The one-paragraph thesis

Rig's product is an agent-led engineering journey from idea to verified
delivery. The signed contract protects the developer's intent; the central
corpus supplies one adaptable workflow; model routing spends the least capable
resource that can safely do each task; layered memory and automatic trace
retention make the work resumable and progressively better. The 8 KB active
view is one part of that architecture. The deliverable is a coherent lifecycle
with real source-level open-source inheritance, not a set of disconnected
subsystems.
