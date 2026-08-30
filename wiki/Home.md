# Rig — project wiki

Everything this project knows about itself: what it is, why every part of it is
shaped the way it is, and what is true right now.

**Start here:** [status](status.md) if you are picking the work up cold ·
[Tickets](Tickets.md) for the live board ·
[the MVP roadmap](specs/mvp-roadmap.md) if you are here to build ·
[what Rig is](topics/what-rig-is.md) if you have never seen this project ·
[the two gates](topics/the-two-gates.md) if you want to know how decisions get made ·
[glossary](glossary.md) if a term or ID is unfamiliar ·
[timeline](index/timeline.md) if you are reading an older page and want to know
what it might have wrong.

**If you are an agent working on this project:** this wiki is your first source
of truth. Read it before grepping the code, keep it in sync with the branch, and
update it as part of your change — never as an afterthought.

---

## The five kinds of page

| Kind | Where | What it is |
|---|---|---|
| **Topics** | [`topics/`](topics/) | 28 hubs, one per subject. Each tells the whole story of one thing: what it is, why, what binds it, what was rejected. **Synthesis** — written here, citing the sources. |
| **Indexes** | [`index/`](index/) | Flat lookups across everything: every decision, every acceptance case, every rejected idea, every trap. |
| **Authorities** | [`gate1/`](gate1/), [`gate2/`](gate2/) | The documents that actually decide things. Frozen or candidate. Nothing here is rewritten by the wiki. |
| **Sources** | [`sources/`](sources/) | The record: decision logs, captured reference material, review receipts, superseded designs. Held as written — see the [sources index](index/sources.md) for a linked way in. |
| **Mistakes** | [`mistakes/`](mistakes/) | One file per named anti-pattern, each anchored to the concrete example that proves it happened, with a check to run before repeating its shape. Not a narrative log — see [`index/traps.md`](index/traps.md) for that. **Synthesis**, checked directly. |

Plus [`reasoning/`](reasoning/) — where new thinking lands, verbatim and dated, and
[`specs/`](specs/) — subordinate scope and status documents.

**The rule that keeps this honest:** topics are rewritten freely; sources and
reasoning traces are never edited. When they disagree, the source wins and the
topic is wrong.

---

## Topics

**What the product is**
[what Rig is](topics/what-rig-is.md) ·
[the à-la-carte catalogue](topics/the-catalogue.md) ·
[catalogue contract](topics/catalogue-contract.md) ·
[onboarding flow](topics/onboarding-flow.md)

**How decisions get made and held**
[the two gates](topics/the-two-gates.md) ·
[Gate 1 signing](topics/gate1-signing.md) ·
[the specification gate](topics/specification-gate.md) ·
[review receipts](topics/review-receipts.md) ·
[the authored-service gate](topics/authored-service-gate.md)

**Safety, consent, and control**
[the safety baseline](topics/safety-baseline.md) ·
[the policy model](topics/policy-model.md) ·
[user-presence approvals](topics/user-presence-approvals.md) ·
[policy-signer recovery](topics/policy-signer-recovery.md) ·
[one-use approvals](topics/one-use-approvals.md) ·
[the action evaluator](topics/action-evaluator.md) ·
[enforcement and git-dispatch wiring](topics/enforcement-and-git-dispatch-wiring.md) ·
[drift and secret controls](topics/drift-and-secret-controls.md)

**Getting in and out of a repository**
[graft mechanics](topics/graft-mechanics.md) ·
[install manifest and removal](topics/install-manifest-removal.md) ·
[user-global writes](topics/user-global-writes.md) ·
[sanitation and remediation](topics/sanitation-and-remediation.md) ·
[services and reports](topics/services-and-reports.md)

**Coverage and shipping**
[host and CI coverage](topics/host-and-ci-coverage.md) ·
[trust and failure boundaries](topics/trust-and-failure-boundaries.md) ·
[distribution and release](topics/distribution-and-release.md) ·
[testing strategy](topics/testing-strategy.md) ·
[the delivery plan](topics/delivery-plan.md)

**How agents work here**
[agent working conventions](topics/agent-working-conventions.md)

---

## Indexes

- [**Decisions**](index/decisions.md) — all decision IDs across four schemes, one line each.
- [**Reasoning trace index**](index/reasoning.md) — generated current and historical trace lookup.
- [**Acceptance cases**](index/acceptance-cases.md) — the 73 frozen cases and where each is traced.
- [**Rejected**](index/rejected.md) — every approach considered and turned down, with the reason.
- [**Traps**](index/traps.md) — the things that have already cost this project time.
- [**Mistakes**](mistakes/) — named anti-patterns with a direct example and a check, not a chronological log.
- [**Invariants**](index/invariants.md) — propositions that must always hold; seeded from traps and the six merged tickets, filled in by every ticket close.
- [**Timeline**](index/timeline.md) — how the design moved, by date.
- [**Path map**](index/path-map.md) — old `project-dev-docs/` paths to their wiki homes.
- [**Sources**](index/sources.md) — every log, captured reference, review receipt, and superseded design, one linked way in.

---

## The authorities

As of 2026-08-21 the two gates were collapsed into [one gate](topics/the-two-gates.md):
one signed freeze over the oracle, with the technical spec checked for presence
rather than frozen.

| Document | Standing |
|---|---|
| [`gate1/business-spec.md`](gate1/business-spec.md) + [`gate1/acceptance.md`](gate1/acceptance.md) + testing infrastructure | **The oracle — owner-approved, signed, and green.** D24 keeps 68 acceptance IDs and broadens the MVP to all 115 Policy leaves; D28 extends the set to 73 with RIG-115's shell-trust guarantees. The completed test manifest is covered by the owner signature with both documents. |
| [`gate2/technical-spec.md`](gate2/technical-spec.md) | **Checked for presence, not frozen.** The working technical design the code adapts to. No longer a second freeze and no longer blocks implementation; its open review findings are ordinary design work. |
| [`specs/`](specs/) | Subordinate. Scope, status, coverage, and roadmap aids. They may describe work; they cannot override the gate. |

See [status](status.md) for current work. `v5.0.0` is published.

---

## Adding to this wiki

New reasoning goes in [`reasoning/`](reasoning/) — see
[the convention](reasoning/README.md). Paste the thinking, it gets filed
verbatim under its date, and the topics it touches get updated to cite it.
Never edit a trace after filing; correct the topic instead.
