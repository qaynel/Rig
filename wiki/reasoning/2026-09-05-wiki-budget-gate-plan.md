---
date: 2026-09-05
source: agent
topics: the-overhaul, agent-working-conventions, testing-strategy
decisions:
status: historical
supersedes:
tags: interdependency, trap
summary: Implementation plan for the wiki budget gate filed at docs/superpowers/plans/2026-09-05-wiki-budget-gate.md — five caps measured against the live tree, a ratchet-only waiver ledger instead of a permanently-red suite, entry into npm test via a new test file because package.json scripts is a signed Gate 1 oracle, and reachability scoped to the four mandated reads because the literal rule would break the wiki's own hub-cites-trace contract.
---

# Wiki budget gate — implementation plan

Office-hours D3 answer B ("reachability + free deletions + splits, forward
cap") named a gate to build before any parallel debloat agent is deployed: a
query tool extending `scripts/build-wiki-index.js`, plus
`scripts/check-wiki-budget.js` in `npm test` asserting a non-empty summary on
every trace, a byte cap per hub, a row cap per index, and historical traces off
the default path — landed red.

The plan is at
`docs/superpowers/plans/2026-09-05-wiki-budget-gate.md`, five tasks, written
against the measurements below. Nothing has been implemented.

## Measurements taken against the live tree (branch qa-prod-v7)

| Fact | Value |
|---|---|
| Reasoning traces | 194 |
| Traces with a non-empty `summary:` | 87 (**107 missing**) |
| Traces with no frontmatter block at all | 12 |
| `status:` distribution | 139 historical / 26 none / 23 current / 6 superseded |
| Hubs over 12,000 B | 5 of 29 (onboarding-flow 36,775 · trust-and-failure-boundaries 26,607 · testing-strategy 21,267 · gate1-signing 15,190 · the-overhaul 14,349) |
| Indexes over 200 rows | 5 (traps 327 · decisions 314 · timeline 311 · invariants 308 · acceptance-cases 266) |
| Indexes over 20,000 B | 2 (decisions 55,724 · acceptance-cases 20,492) |
| Orientation cost: `agent-primer.md` + the 12 pages it links | **211,775 B ≈ 53k tokens** |
| Non-`current` traces linked from the four mandated reads | **0** |
| Non-`current` traces cited from `topics/` and `index/` | **85** |

The 211,775 figure supersedes the 86,288 in
[[2026-09-05-overhaul-scope-measurements]] §M2, which counted primer + Home +
status + decisions + glossary. This one counts the primer plus every page the
primer actually names, which is what a full-cadence task opens.

## Four decisions the plan makes, and why

**1. The gate ships green behind a ratchet-only waiver ledger, not red.** The
instruction was "land it red." `CLAUDE.md` § Checks says do not push on a red
suite, and a permanently-red `npm test` disables every other check in the
repository for everyone. `scripts/check-wiki-budget.js --update-waivers`
writes one key per current violation at its current value (~120 keys);
thereafter the gate fails on a waived value that **grew**, on a waiver whose
file is now **within budget** (stale), and on any **new** violation with no
waiver. The debt is enumerated and can only shrink, and the ledger doubles as
the partitionable work list for the parallel slices. Hard-red remains one
edit away: commit `{}` instead of running `--update-waivers`.

**2. The gate enters `npm test` as `tests/wiki-budget.test.js`, not through
`package.json`.** `package.json`'s `scripts` object is a Gate 1 oracle
surface — `scripts/check-advanced-spec.js` byte-compares it against the signed
`wiki/gate1/package-scripts.json`. [[2026-09-04-gate1-package-scripts-break-and-revert]]
records this exact mistake: wiring `check-size-hints.js` into `test:code` made
the suite red and needed a re-sign the agent cannot perform.
`scripts/wiki-maintenance.js:157-163` already documents the accepted
workaround — a file picked up by the existing `tests/*.test.js` glob enforces
the same failure without touching the oracle. The plan takes that shape.

**3. Reachability is scoped to the four mandated reads, not to every hub.**
Enforcing "no `status: historical` trace reachable from the default path"
literally would require deleting **85** trace citations from `topics/` and
`index/`. `wiki/reasoning/README.md` *requires* a hub to cite the trace it
synthesises ("a trace filed without those follow-ups is invisible to anyone
who arrives by subject"). The literal rule therefore orders agents to break
the wiki's own filing contract. What is enforceable and correct: the four
pages a full-cadence task always opens — `agent-primer.md`, `Home.md`,
`status.md`, `index/quick-reference.md` — link only `current` traces. That
holds today at 0 violations, so it ships as a ratchet against regression
rather than as debt. Hubs one hop deeper keep their citations; the bounded
query, not link surgery, is what stops an agent browsing into them.

**4. A fifth assertion was added: a total byte cap on the entry path.** The
four described assertions are all per-file, and per-file caps do not bound the
sum. Five hubs could each sit at 11,999 B with orientation cost unchanged. The
sum is the symptom the diagnosis rests on, so the plan caps it at 100,000 B
against a measured 211,775. It is one rule and one constant, and it is flagged
in the plan as removable if the reviewer wants exactly four.

## Trap recorded

Filing this plan's own trace grows `wiki/status.md`, and both `status.md` and
`index/quick-reference.md` are inside the entry-path budget. So the plan's
final task trips its own `entry-path-bytes` waiver. That is not a defect in
the gate — it is the gate working, and it is the first real test of the
ratchet. The plan's remedy order is: demote stale `current` traces to
`historical` (a legal frontmatter edit that shrinks the generated status page),
then trim the page you grew, and only then hand-edit the single waiver value
with a written reason. Regenerating the whole ledger to absorb your own
addition is forbidden, and is precisely the +2,334-line failure mode from
[[2026-09-05-overhaul-scope-measurements]] §M1.

## Not in the plan

The parallel debloat slices — the 107-trace summary backfill, the five hub
splits, the five index splits, and the `wiki/archive/` deletions (272 K) —
are follow-on work that the waiver ledger enumerates. `wiki/gate1/acceptance.md`
(76,926 B) and `wiki/gate1/business-spec.md` (63,583 B) are excluded from all
of it: they are signed, and reflowing them triggers the re-sign multiplier.
