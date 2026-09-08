---
date: 2026-09-04
source: agent
topics: agent-working-conventions, testing-strategy, the-two-gates
decisions:
status: current
supersedes:
tags: interdependency, design
summary: Architectural root-cause of the four workflow symptoms is one asymmetry — a mandatory write path against an advisory, unbounded read path — and the fix is a bounded, phase-scoped, mandatory consultation index; scoped to four slices for the workflow-only PR.
---

# Structural workflow fix — design against the grilling answers

Provenance: office-hours session on PR #143 (74 commits, ~31k added / 10
removed) produced a context brief and six candidate tranches (A–F). A parallel
grilling session closed sections A–G. This trace is the structural design
against those answers. It is a design, not a ship plan; the ship decision is
handed back to the intent owner at the end.

Inputs: the handoff brief (five tranches + F), the completed grilling results
(A1–A4, B1–B4, C1–C4, D1–D4, E1–E3, F1–F3, G1–G2, plus seven grilling-agent
notes), and the standing deferred design in
[[2026-09-02-closed-loop-workflow-and-context-realignment]].

---

## Part 1 — Root cause

E1 carried a caveat: the four symptoms are "all symptoms of a common disease —
the real ask is an architectural root-cause analysis, not per-symptom
treatment." This part answers that.

**The disease: Rig's knowledge system pairs a mandatory write path with an
advisory, unbounded read path, and has nothing addressable in between.**

The write path is mandated in the top-level project file. `CLAUDE.md` requires
a dated reasoning trace at least every three minutes of active work, requires
the wiki to move in the same change as anything that moves what is true, and
requires hub and index updates alongside. The result is measurable: 185 traces,
1.3 MB under `wiki/reasoning/`, 3.6 MB of `wiki/` total.

The read path is advisory everywhere it appears. `wiki/agent-primer.md` says to
follow its links "only as far as the task requires." `rig/tier-1/routing.md`
§Task weight lets a single-step task skip the read entirely. `index/traps.md`
(297 lines) and `index/rejected.md` (100 lines) are described as pages to read,
never as artifacts a phase is obliged to consult before closing.

And there is no bounded middle. `wiki/status.md` is 49 generated lines of
chronological trace titles. There is no way for an agent to ask "what does this
project already know about the thing I am about to touch?" and receive an
answer whose size it can predict. The only two available read modes are *skip*
(cheap, uninformed) and *follow the links* (informed, unbounded).

Every symptom in E1's ranking is that one asymmetry, seen from a different
angle:

| Symptom (E1 rank) | The same asymmetry, expressed as |
|---|---|
| Context burn (1) | The two read modes are skip or unbounded-follow. There is no bounded mode, so a careful agent pays an unpredictable price and a fast agent pays nothing and learns nothing. |
| Regression loop (2) | A fix pass cannot cheaply load the invariants the original code already satisfied. Each fix is locally correct and globally regressive. Review re-discovers the class instead of the class being consulted before the fix. |
| Re-sign multiplier (3) | The same shape one level up. The signature covers a document that mixes frozen acceptance criteria with unfrozen prose, with no addressable boundary between the two, so a prose edit costs a human ceremony. |
| Wiki bloat (4) | Production is mandated and consumption is optional. Produce exceeds consume, without bound, by construction. |

**This is not a theoretical reading.** Grilling note 2 records the diagnosing
session itself asking the intent owner a question whose answer was already
written in `wiki/reasoning/2026-08-31-path-b-adapt-scope.md` and
`2026-08-30-office-hours-path-a-path-b-scoping.md`. The owner's response —
*"just from the name, you should have gone to the wiki... this is the exact
reason why wiki had to be there"* — is the defect reproducing inside the
session convened to diagnose it. An advisory read path is not a weak read
path; it is an absent one under load.

The closed-loop trace reached the adjacent conclusion in different words:
*"the wiki is a ledger; a ledger does not act."* That framing named the missing
arrows (consult-before, derive-after). This trace adds why the arrows have not
been drawable: there is no bounded thing to consult. An obligation to read 297
lines of chronological prose at every phase boundary would make E1's
first-ranked symptom worse, so any honest fix has to produce the bounded index
and the obligation in the same edit.

---

## Part 2 — The fix, in one line

**Make the read path bounded and mandatory instead of unbounded and optional.**

That single move is why this is one architectural edit and not four symptom
treatments:

- **Bounded** attacks context burn (E1's first-ranked symptom). "Read as far as
  the task requires" is replaced by "load these N rows for this phase and these
  paths." Net loaded context is expected to fall, not rise. This is tranche D's
  goal reached as a property of the fix rather than as a separate tranche.
- **Mandatory** closes the regression loop (E2 and E3's answer, and the one
  that bites the next PR regardless). Known defect classes are consulted at
  write time.
- Consulting at write time *is* C1's global 1:2 feature:hardening principle —
  "hardening is done inline at the point of writing, not deferred to a separate
  review phase" — expressed as a mechanism instead of an intention.
- It **does not touch review**. Review keeps every axis and every severity it
  has today, and gains one obligation (derivation). This satisfies E2's hard
  anti-solution guardrail: the loop count drops without review softening.

The unit of the bounded index already exists in this repo and is
underpopulated: `wiki/mistakes/` (2 files today, against roughly 30 named
patterns sitting in `traps.md` prose). Its `README.md` already states the right
contract — pattern, exact example, why it passed anyway, and **the check** —
and already states the right posture: *"A mistake file exists to be checked
against, not read once."* The missing pieces are machine-legible routing
fields and something that queries them.

---

## Part 3 — Scope

C1 fixes the next PR hard: **workflow-fix only, at most 4 commits over 4
hours**, with two follow-on PRs after it in order — (i) re-architect around
dynamic `.rig` onboarding, (ii) AHE in practice or in spirit, whichever is
cheapest on infra. D3 adds a soft diagnostic at 5 commits: crossing it fires an
investigation into whether something deeper is wrong, not a merge block.

So the design below is four slices, one commit each, with a verification
command per slice.

### Slice 1 — the addressable ledger and its prefilter

Extend the `wiki/mistakes/*.md` frontmatter contract with the routing fields
the closed-loop trace specified, plus one:

- `pattern` — kebab-case short name.
- `enforcement_site` — which phase or check must catch it. Values:
  `grilling-closeout`, `product-design-closeout`, `tdd-closeout`,
  `code-review-checklist`, `ci-grep`.
- `check` — the concrete question or command.
- `paths` — glob hints for the files this pattern lives in. This is the field
  the closed-loop design did not have, and it is what makes the query bounded
  by *task* and not only by phase. Grilling a signing feature should not load
  filesystem-write traps.

Then `scripts/mistakes.js`:

- `query --site <site> [--paths <glob>...]` — prints matching rows as a compact
  block: name, one-line pattern, check. Nothing else. Bounded output is the
  entire point of the script, so it carries a hard cap and says so when it
  truncates.
- `check` — asserts every entry has the four fields and that the README index
  table matches the directory.

Verification: `node scripts/mistakes.js query --site code-review-checklist`
returns rows within the cap; `--site nonsense` returns empty and exits 0;
`node scripts/mistakes.js check` exits 0.

### Slice 2 — backfill, bounded to what has actually recurred

Not all thirty traps. A full backfill is an open-ended sweep and would eat the
4-hour budget by itself. Backfill only classes with evidence of recurrence,
capped at roughly eight entries:

- The `traps.md` entries that already record a second occurrence. The
  highest-value row in the repository is the oracle-green-at-an-unused-seam
  family, whose own text says *"Recurred at finer grain, 2026-08-29, after the
  guard above existed"* — a pattern that defeated the guard written to stop it
  is exactly what a consulted ledger is for.
- The finding classes from PR #143's own review passes, which are already
  written down across the `2026-09-02` and `2026-09-03` traces and need
  extraction, not rediscovery.

Everything else stays as prose in `traps.md` and is converted later, outside
this PR.

Verification: `node scripts/mistakes.js check` exits 0 with the new entries;
each new entry cites the trace that discovered it, per the `mistakes/README.md`
filing order.

### Slice 3 — phase closeouts and the `consulted:` stamp

Each of `rig-grilling`, `rig-product-design`, `rig-tdd`, and `rig-code-review`
gains a closeout section that: runs the prefilter for its own site and the
task's touched paths; answers each returned row *applies* or *does not apply,
because*; and emits a `consulted:` block in the phase output naming the rows.

`rig-code-review` additionally gains the derivation arrow from the closed-loop
design (Part 2B): the review does not close until every finding class either
maps to an existing ledger row or has a new row filed.

**The replacement discipline is load-bearing, not cosmetic.** The closeout must
*replace* the advisory "read the wiki as far as the task requires" instruction
at that phase, not sit alongside it. If it only adds, the design has made
E1's first-ranked symptom worse and is a defect on its own terms.

Verification: skill payloads contain the closeout; `node
scripts/check-rule-copies.js` keeps `.claude/skills/` and `.agents/skills/`
byte-identical.

### Slice 4 — CI backstop and wiki sync

`scripts/check-mistakes-ledger.js`, wired into `npm test`, asserting: every
entry is well-formed; the README index matches the directory; and every skill
named as an `enforcement_site` actually contains a closeout that invokes the
prefilter. That last assertion is the one that keeps the obligation from
rotting back into advice.

Then regenerate `wiki/status.md` via `node scripts/build-wiki-index.js`, update
the `agent-working-conventions` hub, and add the decision row.

Verification: `npm test` green.

---

## Part 4 — The honest limit

The `consulted:` stamp is self-reported. CI can prove the ledger is
well-formed and that the closeout instruction exists in the skill; it cannot
prove an agent truly read the row it stamped. Claiming otherwise would buy an
optimizer with the same blind spot the AHE paper is honest about at ~2× random
on regression detection, which the handoff explicitly warns against.

What actually bites is the `ci-grep` subset: rows whose `check` field is a
runnable command get promoted into real `scripts/check-*.js` over time and
become fail-closed with zero human effort forever. The stamp is the observable
channel that tells you *which* rows deserve promotion — it is instrumentation,
and it should be described as instrumentation, not as enforcement.

---

## Part 5 — What this design deliberately excludes, and why

- **Tranche F (decouple the oracle from prose) is retired by A2.** The handoff
  called it the single highest-leverage edit. A2 says otherwise: the owner
  would still tie the signature to the document and wants that kept. What they
  actually asked for is different work — B3's bulk re-sign flow (sign one,
  some, or all invalidated items) and A2's single-physical-auth packaging (the
  agent triggers Gate 1 approval and packages the lock and delta together; the
  human does one Touch ID instead of two approvals). That is a signing-UX PR,
  not a workflow PR, and it is not in C1's next-PR scope.
- **Tranche C (scope guard) stays down.** The handoff already demoted it; A4
  confirms #143 grew through a deliberate fix-at-source review loop, not scope
  drift.
- **Tier 1's markdown-only overhaul** is follow-on PR (i) per C1 — but see
  Part 6, because its governing text needs correcting now regardless.
- **The AHE port** is follow-on PR (ii) per C1.
- **The wiki bloat sweep** (closed-loop Tranche 5) is E1-last and partially
  absorbed by slice 1's bounded query. Not in this PR.
- **No target number.** G1 declined one on Goodhart grounds. The directional
  observables from C3 and G2 — shorter commit histories, pass@1 on acceptance
  criteria, concrete scope stated up front, small line-change footprint,
  close-to-1:1 deletion-to-addition ratio — are tracked as signals and are not
  turned into thresholds anywhere in this design.

---

## Part 6 — Blocking contradiction surfaced by grilling

B2 states that markdown-only Tier 1 is dead policy: Tier 1 is meant to be
dynamic scripts plus markdown plus MCP, the à la carte overhaul was supposed to
replace the old Tier system the moment it landed, a sync engine is wanted, and
the only secret Rig needs is the physical signing key.

`CLAUDE.md` still asserts the opposite as current truth, twice — in
Architecture and again as its own paragraph: *"Tier 1 must remain markdown-only
in installed repositories: no installed runtime, secrets, sync engine, or
generated `.env` files."*

Grilling note 1 flags this as needing a direct correction in the origin
session. It is actively misleading: it is the first file any agent on this
repository reads, and it rules out three things the owner now wants. It does
not block the four slices above — they are authoring-time and markdown-only
either way — but it must not survive the PR unresolved.

---

## Part 7 — Premise corrections carried in from grilling

Recorded so a cold session does not re-derive the wrong frame:

- **F1/F3 — there is no stuck queue.** The handoff's "six signals in a week,
  zero shipped" implied a broken pipeline. The owner corrected it: the
  2026-09-02 closed-loop tranches were deliberately deferred so Path B could
  ship first. Serial prioritization, not a blocked queue. Office hours is the
  orientation and escalation layer, not the trigger layer; the trigger is the
  owner's own decision. **Consequence for this design:** no shipping mechanism
  needs to be invented. Handoff step 8's warning — that if the loop mechanism
  is unaddressed no tranche design matters — is discharged, because there is no
  mechanism to address.
- **B1 — three non-negotiables, ranked:** dynamic onboarding (the entire
  selling point), human signing (the codebase's defence against the agent
  self-certifying), spec-driven development (the human owns architecture, the
  agent owns syntax and documentation). None of the four slices touches any of
  them.
- **D2 — the wiki is for agents, not humans.** No human is expected to read it
  end to end. This is what makes "obligatory consultation" a legitimate design
  move: it is an agent-side gate, not a reading discipline imposed on a person.
- **D1/D4 — pause ceiling is about one week**, two weeks only with an
  exceptionally strong reason, and every day of a pause must earn its place.
  Four hours is well inside that.
- **A1 — why the oracle is signed at all:** to stop an agent in a context-rot
  or hallucination state from editing the acceptance criteria so its own wrong
  code passes. The agent must not mark its own homework. Any future signing
  work is constrained by this, not merely by convenience.
- **AHE = Agentic Harness Engineering** (grilling note 3), not yet in the
  glossary. Add it when follow-on PR (ii) opens.

---

## Part 8 — Session log

**2026-09-04 (this session, agent):** Design filed against the completed
grilling. Next action is the intent owner's: open slice 1, or resolve Part 6
first. Nothing implemented; the repository is unchanged apart from this trace
and its generated index entry.
