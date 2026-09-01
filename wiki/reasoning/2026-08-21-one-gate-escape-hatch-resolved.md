---
date: 2026-08-21
source: intent owner
topics: the-two-gates
decisions:
status: historical
---

# One-gate escape hatch — resolved (Option A)

Follow-up to [one-gate streamlining intent](2026-08-21-one-gate-streamlining-intent.md).
The intent owner resolved the open point on how a *locked* test gets corrected
when it turns out wrong mid-implementation.

**Chosen: key-holder amends, instant re-sign (Option A).**

- Only the key holder can change a locked intent/test artifact. When they do, it
  is a quick re-sign — not a fresh grilling cycle.
- The agent may *propose* "this locked test looks wrong because X" but can never
  change it. The signature over the digest is what enforces this: an agent edit
  makes the signature stale and the gate fails.
- This keeps the one property that matters — the agent cannot move its own
  goalpost — while making the human's corrections cheap. Rejected Option B (a
  wrong locked test forces a full return to grilling) because it rebuilds the
  gate friction this branch exists to remove.

**Two defaults adopted alongside it:**

- Rig flags which acceptance criteria it *inferred* from existing documentation
  versus which the user gave it, so the sign-off is never blind.
- Rig checks the existing record — wiki, then README / reasoning traces /
  `CLAUDE.md` / other markdown — before spending the developer's time on a
  question.
