---
date: 2026-08-24
source: intent owner
topics: agent-working-conventions
decisions:
status: historical
---

Raised by the intent owner: on a long or unattended task, an agent that only
writes things down at a finished step, or at the end, loses everything done
since the last write if the session is cut off partway through — including the
tokens already spent completing the in-progress work. Waiting for a step
boundary is not tight enough; the boundary itself might be an hour away.

Proposed checkpointing at meaningful moments — a step finishes, a fact or
decision emerges, roughly every 15–30 minutes of unattended work. The intent
owner rejected the interval as too loose and asked for **every three minutes of
active work**, explicitly including progress made *between* steps, not only at
step or task completion — because that in-between work is exactly what gets
lost and re-paid for if nothing is written until a boundary is reached.

Decision: on any task that runs long or has several steps, check the time and
update `wiki/status.md` with what was just done, what is in flight, and what
is next at least every three minutes of active work. A new understanding or a
failed approach is recorded the moment it happens — as its own reasoning trace,
or in `index/rejected.md` / `index/traps.md` if that's what it is — rather than
held for later. A session picking up cold should be able to resume from what is
written, not from re-deriving it or reading a lost conversation.

Landed identically in `CLAUDE.md`'s "Working from the wiki" section (richer
wording) and in the compact "Working Rules" list shared byte-for-byte across
`AGENTS.md` and its six host copies (`.cursor/rules/rig.mdc`,
`.windsurf/rules/rig.md`, `.clinerules/rig.md`, `.agents/rules/rig.md`,
`.github/copilot-instructions.md`, `.kiro/steering/rig.md`), verified by
`scripts/check-rule-copies.js`.

## What was deliberately not done

- No wall-clock enforcement hook. This is a discipline the agent applies
  itself (checking a timestamp mid-task), not something a script verifies
  after the fact. If checkpoints keep being skipped in practice, that is the
  next escalation, matching the same enforcement ladder the communication rule
  already went through (sharpen the words → dedicated rule → output hook).
- No new file or mechanism for the in-flight checkpoint. It reuses
  `wiki/status.md`, which the wiki design already treats as "live state,
  rewritten as it changes" — the same page, not a parallel scratch log.
