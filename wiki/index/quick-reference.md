# Quick reference

Routing by **task**, not by date. Find the row that matches what you are about
to do, read the "Read first" cell, and stop there unless it does not answer you.

**This page is capped at 150 lines.** Keep only rows that can change a decision.

Not a replacement for [the primer](../agent-primer.md), which is
still the one mandated read. This is the layer under it.

---

## Before you start anything

| Read | Lines | Why |
|---|---|---|
| [Traps](traps.md) | 327 | Things that already cost this project time. Skim headings; read only the matching one. |
| [Rejected](rejected.md) | 124 | Approaches already turned down, with reasons. Check before proposing one. |
| [Mistakes](../mistakes/) | 2 files | Named anti-patterns with a concrete example and a check to run. |
| [Glossary](../glossary.md) | 67 | If a term or ID is unfamiliar. Terms win over older documents unless a frozen gate says otherwise. |

---

## By task

| I am about to… | Read first | Lines | Then, only if needed |
|---|---|---|---|
| **Touch Gate 1, the oracle, signing, or a re-sign** | [Gate 1 signing](../topics/gate1-signing.md) | 57 | [Gate 1 and Gate 2](../topics/the-two-gates.md) (37) · `gate1/` is frozen — never edit it |
| **Change the installer, graft, or onboarding** | [Onboarding flow](../topics/onboarding-flow.md) | 72 | [Graft mechanics](../topics/graft-mechanics.md) (117) · [Install manifest and removal](../topics/install-manifest-removal.md) (163) |
| **Add or change a host** | [Host and CI coverage](../topics/host-and-ci-coverage.md) | 136 | [Onboarding flow](../topics/onboarding-flow.md) (72) for the projection path |
| **Edit a skill, rule, or standard** | [Agent working conventions](../topics/agent-working-conventions.md) | 63 | `rig/corpus/` is the canonical shipped source; follow its routing and projection checks |
| **Change the catalogue, skill shelf, or services** | [The catalogue](../topics/the-catalogue.md) | 65 | [Catalogue contract](../topics/catalogue-contract.md) (132) · [Services and reports](../topics/services-and-reports.md) (148) |
| **Touch policy, approvals, or safety** | [The policy model](../topics/policy-model.md) | 56 | [Safety baseline](../topics/safety-baseline.md) (42) · [One-use approvals](../topics/one-use-approvals.md) (68) · [Action evaluator](../topics/action-evaluator.md) (42) |
| **Write or change tests** | [Testing strategy](../topics/testing-strategy.md) | 39 | [Acceptance cases](acceptance-cases.md) (266) for the `AT-*` register |
| **Work on trust boundaries or failure paths** | [Trust and failure boundaries](../topics/trust-and-failure-boundaries.md) | 398 | [Drift and secret controls](../topics/drift-and-secret-controls.md) (68) |
| **Ship, release, or cut a version** | [Distribution and release](../topics/distribution-and-release.md) | 69 | [Review receipts](../topics/review-receipts.md) (70) · [Delivery plan](../topics/delivery-plan.md) (45) |
| **Change the wiki itself** | [Reasoning convention](../reasoning/README.md) | — | Trace bodies are immutable; frontmatter is not. `.claude/skills/wiki-maintenance/SKILL.md` owns the routine. |
| **Propose a workflow, product, or architecture change** | [Rig router](../../rig/corpus/routing.md) | — | Route to the named skill; read the relevant Gate 1 intent and Gate 2 technical design before proposing changes |
| **Understand the product before proposing anything** | [What Rig is](../topics/what-rig-is.md) | 56 | [Status](../status.md) (129) for what is true right now |

---

## Standing facts worth knowing before you touch code

These are here because agents keep rediscovering them.

- **`rig/corpus/` is the canonical source** for the shipped workflow. Native
  host files are projections; run the repository's copy checks when changing
  a projected skill or rule.
- **Gate 1 is owner-signed.** Do not edit its protected files; a proposed
  change needs an owner-applied amendment and a new signature. Gate 2 is the
  working technical design, checked for presence rather than frozen.
- **`wiki/status.md` and `wiki/index/reasoning.md` are generated.** Never
  hand-edit. Change trace frontmatter and run
  `node scripts/build-wiki-index.js`.
- **`npm test` is the full gate.** `npm run test:rig` is a fast subset and is
  not a substitute. Do not push on a red or unrun suite.
- **The wiki has a budget and `npm test` enforces it.** Caps in
  `wiki/budget.json`, current debt in `wiki/budget.waivers.json`. Waived values
  may shrink, never grow. Run `node scripts/check-wiki-budget.js` before you
  add a page.
- **`node scripts/wiki-query.js --topic <slug>` is the bounded read.** Capped
  at 40 rows, newest first, one summary line each. Use it instead of opening a
  hub when you already know the subject.

---

## Where each kind of page lives

| Kind | Path | Mutable? |
|---|---|---|
| Topic hubs (synthesis, one per subject) | `topics/` | Rewritten freely |
| Indexes (flat lookups) | `index/` | Rewritten freely; two are generated |
| Authorities (they decide things) | `gate1/`, `gate2/` | Gate 1 frozen by owner signature; Gate 2 is a working design |
| Sources (the record) | `sources/` | Immutable |
| Reasoning traces (dated thinking) | `reasoning/` | Body immutable, frontmatter mutable |
| Mistakes (named anti-patterns) | `mistakes/` | Rewritten freely |
| Archive (out of live navigation) | `archive/` | Do not read unless hunting a known file |

Full map: [Home](../Home.md) (129 lines).

---

## Dynamic onboarding and release

The user's host agent reads the installed onboarding instructions, inspects
the repository, and proposes a small, useful graft for the user to review.
Rig code does not choose capabilities from repository shape. For QA and
production, follow the ordered [deployment policy](../../rig/corpus/standards/change-management.md);
do not carry evidence across a change to the candidate bytes.
