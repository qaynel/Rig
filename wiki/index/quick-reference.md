# Quick reference

Routing by **task**, not by date. Find the row that matches what you are about
to do, read the "Read first" cell, and stop there unless it does not answer you.

**This page is capped at 150 lines.** Keep only rows that can change a decision.

Not a replacement for [the primer](../agent-primer.md) (62 lines), which is
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
| **Touch Gate 1, the oracle, signing, or a re-sign** | [Gate 1 signing](../topics/gate1-signing.md) | 240 | [The two gates](../topics/the-two-gates.md) (113) · `gate1/` is frozen — never edit it |
| **Change the installer, graft, or onboarding** | [Onboarding flow](../topics/onboarding-flow.md) | 572 | [Graft mechanics](../topics/graft-mechanics.md) (107) · [Install manifest and removal](../topics/install-manifest-removal.md) (139) |
| **Add or change a host** | [Host and CI coverage](../topics/host-and-ci-coverage.md) | 144 | [Onboarding flow](../topics/onboarding-flow.md) (572) for the projection path |
| **Edit a Tier 1 skill or rule** | [Agent working conventions](../topics/agent-working-conventions.md) | 185 | `rig/tier-1/routing.md` is the router; skills exist in three byte-identical copies — see the note below |
| **Change the catalogue, skill shelf, or services** | [The catalogue](../topics/the-catalogue.md) | 105 | [Catalogue contract](../topics/catalogue-contract.md) (124) · [Services and reports](../topics/services-and-reports.md) (146) |
| **Touch policy, approvals, or safety** | [The policy model](../topics/policy-model.md) | 56 | [Safety baseline](../topics/safety-baseline.md) (42) · [One-use approvals](../topics/one-use-approvals.md) (63) · [Action evaluator](../topics/action-evaluator.md) (42) |
| **Write or change tests** | [Testing strategy](../topics/testing-strategy.md) | 347 | [Acceptance cases](acceptance-cases.md) (266) for the `AT-*` register |
| **Work on trust boundaries or failure paths** | [Trust and failure boundaries](../topics/trust-and-failure-boundaries.md) | 410 | [Drift and secret controls](../topics/drift-and-secret-controls.md) (68) |
| **Ship, release, or cut a version** | [Distribution and release](../topics/distribution-and-release.md) | 92 | [Review receipts](../topics/review-receipts.md) (64) · [Delivery plan](../topics/delivery-plan.md) (167) |
| **Change the wiki itself** | [Reasoning convention](../reasoning/README.md) | — | Trace bodies are immutable; frontmatter is not. `.claude/skills/wiki-maintenance/SKILL.md` owns the routine. |
| **Propose a workflow, product, or architecture change** | [The overhaul](../topics/the-overhaul.md) | 274 | The live workstream, its rejected options, and the five open decisions that gate it |
| **Understand the product before proposing anything** | [What Rig is](../topics/what-rig-is.md) | 169 | [Status](../status.md) (30) for what is true right now |

---

## Standing facts worth knowing before you touch code

These are here because agents keep rediscovering them.

- **Skill payloads exist in three byte-identical copies** —
  `rig/tier-1/skills/<name>/SKILL.md`, `.claude/skills/rig-<name>/SKILL.md`,
  and `.agents/skills/rig-<name>/SKILL.md`. `scripts/check-rule-copies.js`
  fails the build if they drift. Edit all three, or the gate goes red.
- **`wiki/gate1/` and `wiki/gate2/` are off-limits.** Gate 1 is signed; any
  edit invalidates the signature and needs a human re-sign.
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
| Authorities (they decide things) | `gate1/`, `gate2/` | **Off-limits** |
| Sources (the record) | `sources/` | Immutable |
| Reasoning traces (dated thinking) | `reasoning/` | Body immutable, frontmatter mutable |
| Mistakes (named anti-patterns) | `mistakes/` | Rewritten freely |
| Archive (out of live navigation) | `archive/` | Do not read unless hunting a known file |

Full map: [Home](../Home.md) (128 lines).

---

## Open policy contradiction — read this before citing markdown-only

`CLAUDE.md` still states that Tier 1 must remain markdown-only in installed
repositories, with no runtime, secrets, or sync engine. **The intent owner
retired that policy on 2026-09-04** (grilling answer B2): Tier 1 is meant to be
dynamic scripts plus markdown plus MCP, and a sync engine is explicitly wanted.

The correction has not yet been applied to `CLAUDE.md`. Until it is, do not
reject an approach on markdown-only grounds — flag the contradiction instead.
Source: [grilling 2026-09-04](../reasoning/2026-09-04-structural-workflow-fix-grilling.md).
