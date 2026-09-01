---
date: 2026-08-24
source: intent owner
topics: the-two-gates, specification-gate, catalogue-contract, testing-strategy, graft-mechanics
decisions: D25, D26, D27
status: historical
---

# The pipeline, the single lock, and why the freeze question keeps mis-firing

Owner ruling given during the RIG-108/112/113/115/120 grilling session. Recorded
verbatim in intent; this trace is the permanent source, the hubs are the
synthesis. The owner said this is the third or fourth time the process has had to
be re-explained, so it is etched here and in the gate hub so it stops recurring.

## The pipeline (canonical)

A task enters one of two ways:

1. **A new feature** — we get the user's **business specs** first: the full use
   cases, what the feature is for.
2. **An identified problem / bug** — we get a **solution**: a bug report → root
   cause analysis → a proposed solution.

Then, in both cases:

- **Explore the codebase and existing documentation.** A new feature builds on
  top of what already exists (a Python codebase's next feature is not written in
  Java). This exploration is a real step, not a formality.
- **Technical specs = genuine open questions only.** The technical spec is *not*
  a restatement of the business intent. It is exactly the questions that
  **cannot be inferred** from the existing codebase or existing documentation —
  the real architectural forks: "does this belong in this class or that class?",
  "if I introduce this, does that become irrelevant?" Each layer must **add new
  context**, not echo the layer above. If a technical "question" is answerable
  from the code or the docs, it does not belong in the technical spec.
- **Acceptance criteria.** The observable definition of done: *this process
  works.* For a bug, acceptance is that the exact failure no longer occurs.
- **Testing infrastructure** is built **from** the acceptance criteria — this is
  a near-automatic derivation lined up *with* authoring acceptance, not a
  separate downstream phase. 90–100% of the testing strategy falls out of the
  acceptance criteria directly. For a bug, the tests are expanded to pin the
  exact failing behavior (the failing conditional, the wrong-type value, the
  missing branch) so it can never return.

## Business intent is optional (D25)

Business intent is **highly recommended and surfaced through every host we
deliver to, but optional.** If a feature must ship fast, the technical specs
alone are acceptable. The ideal remains business intent first, then technical
specs. This relaxes the prior "all four artifacts present" reading of the gate:
the gate still requires acceptance + tests (the locked oracle) and a *present*
technical spec; business intent is recommended, not mandatory.

## There is exactly one lock (D26)

**One lock. It locks the tests and the acceptance criteria together.** Once
locked, the coding agent operates strictly within those expectations; it writes
the smallest correct solution inside the frozen shell. The lock exists for one
reason: to stop the agent moving its own goalpost — changing the acceptance so
its own code passes. That is reward-hacking: you would never let an agent
writing a test rewrite the question so the test passes. Some hosts are more prone
to this than others, but the lock removes the possibility rather than trusting
post-training.

The only way to change a locked expectation is the **user**, through the
hardware key — that is exactly why the key exists: so the agent cannot reach in
and change the target. An agent may *propose* a change to a locked test; it can
never *make* one.

The system must be **simple**: one lock, one key, one re-sign to change. Not a
web of separate freezes.

## Freeze timing — the answer to the recurring question (D27)

**Nothing is locked until all three are in place and sound:**

1. a clear solution/spec that the owner agrees with,
2. refined acceptance criteria, and
3. testing infrastructure built on that acceptance criteria.

"Not yet frozen" is the **normal, correct default** for anything still being
designed — it is **not** a pending action or an open decision. A document that
reads "designed but not frozen" is describing a healthy in-progress state, not
asking to be frozen now.

### Why the freeze question kept mis-firing (RIG-112 root cause)

RIG-112 ("freeze the catalogue contract now?") was a **mis-raised question.** Its
origin is one descriptive line in `topics/catalogue-contract.md` — "The contract
is designed but not frozen or implemented" — sitting in a "What is still open"
section. The ticket-burndown pass read that *state* as an outstanding *action*
and manufactured a freeze/no-freeze decision from it. There was never a decision
to make: by the doctrine above, the catalogue contract is simply pre-freeze until
its solution + acceptance + tests are all done and sound. The fix is to phrase
in-progress state as state, never as a latent "freeze now?" prompt, so the
question does not regenerate from the wiki.

## Consequences for the open tickets

- **RIG-112:** no freeze. The mechanical CI-over-115 confirmation and any
  stronger specificity heuristic proceed under the ordinary gate. The freeze
  happens only when the catalogue contract's solution, acceptance, and tests are
  all in place and the owner agrees — as a normal end-of-pipeline step, not a
  standing question.
- **RIG-108:** see [[RIG-108]] — module behaviors documented; graft kept.
- **RIG-113/RIG-115:** the lint-format skill is loaded with owner-supplied
  context on what good software/linting is; acceptance and tests are authored
  then locked once (never before). Owner will supply the good-code knowledge base
  and, if needed, the specific lint-format test cases.
