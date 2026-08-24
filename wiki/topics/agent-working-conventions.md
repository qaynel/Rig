# Agent working conventions

## What it is

Three standing rules govern how any agent works in this repository, regardless
of which tool it runs in: the lazy implementation rule (question whether code
needs to exist at all, reach for the smallest thing that works), the
communication rule (talk to the user like a product manager — problem,
options, one recommendation, no internal jargon in the first pass), and the
wiki discipline (read the wiki before grepping the code, keep it in sync with
the branch in the same change, and checkpoint a long task's progress rather
than saving it all for a finish-line summary).

## Current implementation

The lazy implementation rule and the communication rule live in
`rig/tier-1/rules/rig.md` and `rig/tier-1/rules/communication.md`, referenced
from every skill through `rig/tier-1/routing.md`'s opening line. This
repository's own copies — `AGENTS.md`, `.cursor/rules/rig.mdc`,
`.windsurf/rules/rig.md`, `.clinerules/rig.md`, `.agents/rules/rig.md`,
`.github/copilot-instructions.md`, `.kiro/steering/rig.md` — carry the same
body text byte-for-byte, checked by `scripts/check-rule-copies.js` so the rule
can't silently drift between the tools that read it. `CLAUDE.md` carries a
richer variant of the wiki-discipline section (not part of the byte-equality
check) because it is read by only one host and can afford more words.

The wiki discipline includes: file every new trace under `reasoning/`
verbatim, then update the topic hubs and decision index it touches in the same
change; and on a task that runs long or has several steps, update
`wiki/status.md` with what was just done, what is in flight, and what is next
at least every three minutes of active work — not only when a step or the task
finishes — so an interrupted session can resume from what's written instead of
the lost conversation.

Spec-driven development is folded into the existing phase owners (RIG-119),
not exposed as another overlapping skill. Requests such as "spec this out"
route through `rig-grilling`'s Why, Scope, Technical interrogation, Draft
review, and Gate checkpoints; `rig-product-design` owns the code-grounded
technical-interrogation step. One executable acceptance case checks the route,
the absence of a `rig-spec` row, the five checkpoints, and byte-identical
Claude/Codex skill copies.

## Why it is this way

Three tools read three separate instruction files here. A rule stated once and
copied by hand drifts the moment one copy is edited and the others aren't —
that is what the byte-equality check exists to catch. The checkpointing rule
exists because waiting for a step boundary to write anything down loses
whatever work happened since the last write, including the cost already paid
to produce it, if the session is cut off first.

## What was rejected

For the communication rule: sharpening the existing soft wording in place
(still drifts, no invocation pressure) and an output-side regex hook that
blocks wiki-path citations in chat (real enforcement, but fights the model
instead of teaching it, and is noisy on legitimate "read X" moments). A
dedicated rule file, referenced from the router the way every skill already is,
won on account of giving the wording one home without new machinery.

For checkpointing: a looser step-boundary-or-30-minutes cadence was proposed
first and rejected by the intent owner as too loose — the loss it's meant to
prevent happens *between* boundaries, not at them. A new dedicated in-flight
log file was also passed over in favor of reusing `wiki/status.md`, which the
wiki's original design already treats as the one page that's rewritten as
state changes, rather than adding a second live-state mechanism.

## Authorities and sources

- Original wiki-discipline design: [wiki design trace](../reasoning/2026-08-19-wiki-design.md)
- Communication rule: [intent-owner trace](../reasoning/2026-08-20-communication-rule.md)
- Long-task checkpointing: [intent-owner trace](../reasoning/2026-08-24-long-task-checkpointing.md)
- Rule text: `rig/tier-1/rules/rig.md`, `rig/tier-1/rules/communication.md`,
  `CLAUDE.md`, `AGENTS.md`
- Copy-equality enforcement: `scripts/check-rule-copies.js`

## What's still open

The byte-equality check only covers the compact `AGENTS.md`-family copies.
`CLAUDE.md`'s richer wiki-discipline section is not mechanically checked
against them, so its wording can drift out of step with the compact version
without failing any test — a known gap, not yet worth a script for the size of
the text. The three-minute checkpoint cadence is applied by agent discipline;
no hook currently verifies a long task actually checkpointed on schedule.
