---
name: rig-grilling
status: ready
description: Establish business intent, acceptance criteria, and the testing infrastructure that checks them, then freeze that oracle under one signature before implementation.
---

# Grilling: the gate

Use this for new features, ambiguous requests, expensive mistakes, and any work
whose definition of correct is not already frozen. This phase owns **what and
why** and produces the oracle the gate freezes; it never writes implementation.

## Process

1. Check the existing record first — the wiki, or a README, reasoning traces,
   `CLAUDE.md`, or whatever markdown exists — and derive as much intent and
   acceptance as it already supports before spending the developer's time on a
   question. Where you infer a criterion from that record, **declare it
   outright** ("this looks like how you test X, so I added it — remove it if
   wrong") so the sign-off is never blind.
2. State the user, problem, desired outcome, and explicit non-goals.
3. Pressure-test assumptions, failure modes, permissions, data boundaries,
   lifecycle, and observable edge cases.
4. Resolve ambiguity one decision at a time. Record a default only when it is
   reversible and low-risk.
5. Write acceptance criteria as externally observable examples.
6. Build the testing infrastructure that deterministically checks those criteria:
   the smallest runnable tests or exact cases that fail before implementation and
   pass only when the intent is met.
7. Verify the technical specification exists (from `rig-product-design`) — it is
   checked for presence, not frozen — then freeze the oracle (intent, acceptance,
   and tests) under one signature. That single freeze is the gate.

## Executable-Spec Progression

When the user asks to "spec this out" or otherwise requests a spec-driven flow,
use the existing owners through five checkpoints: **Why** establishes the user,
problem, current behavior, desired outcome, and measure of success; **Scope**
fixes boundaries, non-goals, failure modes, and the smallest valuable version;
**Technical interrogation** hands the agreed oracle to `rig-product-design`,
which reads the current system before resolving how; **Draft review** presents
the observable examples and working design for correction; **Gate** freezes
only after the owner agrees and the tests plus technical specification exist.
Do not create or route to a separate spec skill.

## Gate Contract

The gate protects one property: an agent cannot move its own goalpost. It is
enforced by the human signature taken before any code exists plus the
immutability of the signed oracle after — not by independent authorship. An
agent may draft the oracle, because the informed human signature is the
safeguard.

The implementation agent must not edit the frozen oracle. A wrong locked test
requires a filled unfreeze request that identifies the test, the change, and
evidence that the assertion is wrong, the specification changed, or a human is
recording their rationale without an agent. Only then may the human key holder
edit the oracle and re-run `node scripts/approve-gate1.js`; the evidence is
necessary and the human signature is authoritative. It is a quick re-sign, never
a full return to grilling; an agent may propose the change but can never make
it. The test verdict outranks an implementer's claim.

## Output

- Problem and outcome
- Users and business rules
- In scope / out of scope
- Acceptance examples and edge cases
- The testing infrastructure (test files or exact executable cases)
- A present, checked technical specification
- Open decisions that block the freeze

Source: mattpocock grilling doctrine, adapted for Rig's one-gate pipeline.
