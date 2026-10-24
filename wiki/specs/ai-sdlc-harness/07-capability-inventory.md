---
status: current
checked: 2026-10-23
owner: rig-product-design
---

# Capability inventory and gap analysis

Verified against this branch on 2026-10-23. **Repository facts** are checked
against code or a test run and marked ✓. **Claims** taken from the trace record
without re-verification are marked ◦ — the distinction is required by §5 of the
owner's directive and is not cosmetic: one trace-sourced claim in this session
turned out to be stale (see [11-drift-audit.md](11-drift-audit.md)).

## Summary

| | Count |
|---|---|
| Capabilities implemented for the current product (C9 uncommitted) | 6 |
| Partial — a mechanism exists, a named gap remains | 8 |
| Not started — no implementation | 7
| Planning-only source-inheritance contract | 1 |

The split matters for the roadmap: the gate, the corpus and the release
machinery are built; the richer memory layer and product-level orchestration are not.

## Full inventory

| ID | Capability | State | Evidence | What is missing |
|---|---|---|---|---|
| C1 | 8 KB active memory view | **none** | — | everything; foundational |
| C2 | Portable profile / transfer | **none** | — | everything; cheap once C1/C19 exist |
| C3 | Agent-driven onboarding and grafting | **done** | ✓ `tests/rig-bootstrap.test.js`, `tests/path-b-onboarding.test.js`, `tests/context-aware-onboarding.test.js` pass in the green gate | portable profile import and preference conflict reporting |
| C4 | Requirements clarification / specification | **partial** | ✓ `rig-grilling`, `rig-product-design` in `rig/corpus/skills/`; ✓ `tests/spec-driven-pipeline.test.js` | settled answers are not recorded as durable decisions, so they are re-grilled |
| C5 | Architecture / technical design | **done** | ✓ `wiki/gate2/technical-spec.md` bound by digest into the receipt | pipeline order still places design before lock; owner has settled lock-before-design for this programme |
| C6 | Scope-of-work generation | **none** | — | the whole phase; done by hand in the 10-14 run |
| C7 | Acceptance generation + owner freeze | **done** | ✓ 16-file manifest; ✓ `scripts/approve-gate1.js`; ✓ "Oracle verified: 16 files, 95 acceptance cases" from `check-advanced-spec.js` | a tested hardware-key (`sk-*`) path and lock-before-design workflow; both are now specified |
| C8 | Autonomous implementation + subagents | **partial** | ✓ `rig-tdd`, `rig-implementation`, `rig-execution` | bounded tier policy, escalation and child-context contract are unexpressed |
| C9 | Code review / remediation / regression | **done (uncommitted)** | ✓ `tests/release-blockers.test.js` 49/49; ✓ full gate green | graduation is reported, not enacted (→ C13) |
| C10 | CI/CD, testing, release-readiness | **done** | ✓ `npm test` exit 0, 1347 pass; ✓ `scripts/check-deployment-gate.js`; ✓ `scripts/clean-install-e2e.js` | nothing |
| C11 | Documentation / decision logging / knowledge | **partial** | ✓ wiki discipline, generated indexes, `scripts/wiki-query.js`, budget gate | documentation and close-out are not phases with owners |
| C12 | Pre-flight checks at transitions | **none** | — | the whole mechanism; the owner asked for it verbatim |
| C13 | Repeated-failure detection → prevention | **partial** | ✓ per-class history + round numbers + graduation report in `scripts/review-receipt.js` | nothing generates or lands the check |
| C14 | Controlled recursive improvement | **none** | — | everything; specified, highest risk, ships last |
| C15 | Interruption recovery / cross-session resume | **partial** | ✓ in-flight marker, exactly-once recovery, bounded infra streak (review phase only) | generalisation to all phases; a human-readable resume point |
| C16 | Cheap-model cost efficiency | **partial** | ✓ `--interim` cheap-model review path; ✓ outages no longer charged | bounded active context, cost routing, escalation and subagent contract |
| C17 | Trust / permission / security | **done** | ✓ one trust root (North star 13); ✓ spawn guard, secret hygiene, policy signing all green in the gate | boundaries for the two new surfaces (profile, graduated check) |
| C18 | One implementation per capability | **partial** | ✓ service merge policy, catalogue grades, `tests/installed-router-hygiene.test.js` | install-time overlap detection against the host's existing capabilities |
| C19 | Scoped durable memory and retrieval | **none** | — | provenance, semantic/lexical retrieval, consolidation, source trust boundaries |
| C20 | Automatic trace retention and fidelity | **none** | — | hot/warm/cold compaction, reference manifest, exact protected-evidence retention |
| C21 | Hardware-backed Gate 1 signing | **partial** | ✓ OpenSSH signing path and `sk-*` references | end-to-end supported-device verification and unavailable-device reporting |
| C22 | Source-level open-source inheritance | **planning only** | ✓ pinned source matrix and read-only inspection | narrow ports, attribution and port-specific checks after Gate 1 lock |

## The product gap, stated in one sentence

Rig has an install path, signed oracle and release checks; it does not yet carry a complete task from idea through learning with scoped memory, adaptive cost and cold-session recovery. These are distinct integration gaps, not one missing file.

## Where each owner-listed capability landed

The owner's §2 inventory, mapped, so nothing on their list is silently dropped:

| Owner's item | Capability |
|---|---|
| Persistent, bounded, reliable memory across sessions and projects | C1, C2, C15, C19 |
| User-specific engineering philosophy and transferable preferences | C2 |
| Agent-driven project onboarding and setup | C3 |
| Requirements clarification and specification development | C4 |
| Architecture and technical design | C5 |
| Scope-of-work generation | C6 |
| Acceptance-test generation and owner-controlled freezing | C7 |
| Autonomous implementation and subagent orchestration | C8 |
| Code review, defect remediation and regression prevention | C9 |
| CI/CD, testing and release-readiness verification | C10 |
| Documentation, decision logging and project knowledge maintenance | C11 |
| Controlled recursive improvement of the harness | C14 |
| Detection of repeated failures and promotion of validated lessons | C13 |
| Responsible reuse of existing open-source implementations | C22, [12-reuse-plan.md](12-reuse-plan.md) |
| Efficient operation with cheap models and limited tokens | C16 |
| Automatic wiki compaction and durable provenance | C20 |
| Hardware-backed signing path | C21 |

Recovered from the record and **not** on the owner's list — added because the
trace record shows them costing real time:

| Recovered capability | Where it came from |
|---|---|
| C12 pre-flight checks at transitions | owner's verbatim ask in the third message; absent from the §2 list |
| C18 one-implementation normalisation | owner's "two PR-review skills" objection |
| FR-18 concurrent-agent coordination | recorded workspace collisions, 2026-10-17 (×4 traces) |
| NFR-6 evidence economy | recorded: any byte change invalidates all evidence; four full-gate runs for one release |
