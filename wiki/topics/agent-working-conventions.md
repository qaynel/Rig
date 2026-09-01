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
change. On a task that runs long or has several steps, record what was just
done, what is in flight, and what is next in a dated trace at least every three
minutes of active work, then regenerate the current-state page — not only when
a step or the task finishes — so an interrupted session can resume from what's
written instead of the lost conversation.

The implementation skill now starts its solution choice with an explicit order:
delete, reuse unchanged, modify locally, generalise proven shared behavior, then
add code. Moving down requires a reason, and generalisation needs two real
callers with shared semantics rather than predicted reuse. Completion includes
removing the superseded path so parallel implementations cannot quietly drift.
[2026-08-30 handoff](../reasoning/2026-08-30-development-process-handoff.md)

Spec-driven development is folded into the existing phase owners (RIG-119),
not exposed as another overlapping skill. Requests such as "spec this out"
route through `rig-grilling`'s Why, Scope, Technical interrogation, Draft
review, and Gate checkpoints; `rig-product-design` owns the code-grounded
technical-interrogation step. One executable acceptance case checks the route,
the absence of a `rig-spec` row, the five checkpoints, and byte-identical
Claude/Codex skill copies.

The router's full-cadence delivery path is a ten-step human-in-the-loop SOP:
grill intent, design the approach, have the human sign the key, drive test-first
work, implement the smallest correct diff, coordinate parallel work when it
exists, review independently, run the full gate, name the branch, and open the
PR. Between every step, the user chooses to execute it, receive a paste-ready
handoff, or let the session proceed. "go ahead" waives those prompts except the
human key-signing step; lightweight single-step tasks remain outside this
protocol.
[routing SOP implementation](../reasoning/2026-08-30-routing-sop.md)

A single-step task — a one-line fix, a factual question, or a single-file edit
with no cross-file coordination and no wiki-truth change — takes a lightweight
path (RIG-124): `rig/tier-1/routing.md`'s "Task weight" section skips the
routing re-read on resume, the full-skill read, the wiki pre-read, and the
3-minute `status.md` cadence. Anything that turns out to be multi-file,
multi-turn, or that moves a decision/spec/status/rejected-approach uses the
full cadence below unchanged. `rig-tdd`'s red/green inner loop also changed:
`npm run test:rig` or the single relevant test file, never the full `npm test`
gate, which runs once, right before push.

The post-release wiki upkeep routine — lifecycle sweep, hub sync, reindex,
archive, and the one-time context-management infrastructure — is packaged as
the `wiki-maintenance` skill at `.claude/skills/wiki-maintenance/SKILL.md`,
backed by `scripts/wiki-maintenance.js`. It is authoring-time only and not
installed into other repositories.
[2026-09-02 trace](../reasoning/2026-09-02-wiki-maintenance-skill.md)

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
- Lightweight path + inner-loop test discipline: [RIG-124](../tickets/RIG-124.md),
  [implementation trace](../reasoning/2026-08-25-rig124-implementation.md),
  token-burn source: [investigation](../reasoning/2026-08-25-token-burn-investigation.md)

## What's still open

The byte-equality check only covers the compact `AGENTS.md`-family copies.
`CLAUDE.md`'s richer wiki-discipline section is not mechanically checked
against them, so its wording can drift out of step with the compact version
without failing any test — a known gap, not yet worth a script for the size of
the text. The three-minute checkpoint cadence is applied by agent discipline;
no hook currently verifies a long task actually checkpointed on schedule.

<!-- Reviewed 2026-09-02 during wiki-maintenance step 2; no new current traces since last edit. -->
