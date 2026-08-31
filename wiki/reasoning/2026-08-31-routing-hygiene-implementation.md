---
date: 2026-08-31
source: agent
topics: onboarding-flow, testing-strategy
decisions:
status: superseded
supersedes:
tags:
summary: Implementation trace for RIG-151/RIG-152/RIG-124.2 — the frozen four-site reframe was applied to rig/tier-1/routing.md (4 paragraphs) and the (RIG-124) suffix deleted identically from the three tdd/SKILL.md copies. Hygiene oracle 3/3 green, full npm test gate green. Superseded by the close-out trace.
---

# Implementation: routing.md / tdd hygiene reframe (RIG-151 / RIG-152 / RIG-124.2)

Executes steps 4–8 of `rig/tier-1/routing.md` §Pipeline for the bundle whose
oracle froze in [[reasoning/2026-08-31-routing-hygiene-oracle]] with wording
from [[reasoning/2026-08-31-routing-hygiene-design]] (option B,
[[reasoning/2026-08-31-routing-md-adaptation-not-transform]]).

## What landed (steps 4–5: rig-tdd + rig-implementation)

Slice A — `rig/tier-1/routing.md`, four paragraphs, exact frozen TO wording:

- header para: "In this source checkout, use `rig/tier-1/rules/…` instead." →
  "(Working in the Rig source repo, before an install has created `.rig/`? Read
  the originals at `rig/tier-1/rules/…`.)"
- task-weight para: "the 3-minute `status.md` cadence" → "the reasoning-trace
  cadence described below" (Site 3b coherence follow-on).
- full-cadence para: the "file a dated reasoning trace then regenerate
  `wiki/status.md` … every three minutes … per `CLAUDE.md`. `(RIG-124)`"
  sentence → "keep a running reasoning trace …" + a new "Onboarding note:"
  paragraph (map onto the repo's own convention or drop it; do not stand up a
  `wiki/`). "per `CLAUDE.md`" kept only inside the Onboarding note, scoped to
  Rig's own dev repo.
- skill-path para: "In this source checkout, those sources live at
  `rig/tier-1/skills/…`" → "(Working in the Rig source repo, those payloads
  live at `rig/tier-1/skills/<name>/SKILL.md` and `skills/rig/SKILL.md` until
  an install lays down `.rig/`.)"

Slice B — deleted the trailing " `` `(RIG-124)` `` " on line 31 of all three
tdd copies, identical edit: `rig/tier-1/skills/tdd/SKILL.md`,
`.claude/skills/rig-tdd/SKILL.md`, `.agents/skills/rig-tdd/SKILL.md`. Sentence
"…which runs once, right before push." retained. Post-edit git blob hash is
identical across all three (`0853a079`).

No edits to the numbered pipeline steps or the skill-index table.

## Verification

- `node --test tests/installed-router-hygiene.test.js` — 3/3 green (was 3/3 red).
- Regex bars re-checked directly against the edited `routing.md`: all four
  `doesNotMatch` bars clear, all three `match` bars hold.
- `routing-sop`, `rig-bootstrap`, `spec-driven-pipeline`, `wiki-index` — green.

## Step 7: rig-code-review (report only)

Four passes, no parallel workers. **No findings.** Spec matches acceptance
cases 1–4; three-copy byte identity verified; reframe reduces coupling (the
installed router no longer asserts Rig-internal cadence onto stranger repos);
`routing.md` reads coherently for both a first-time installed agent and a Rig
contributor; oracle test plus `rig-bootstrap` byte-identity assertion cover
the change.

## Step 8: full gate

`npm test` initially failed one pre-existing, unrelated test —
`tests/advanced-oracle.test.js` `AT-HOME-1 OpenClaw MCP opt-in` — with
`cp: rig-mcp/node_modules: No such file or directory`. Confirmed pre-existing
by stashing all branch changes and re-running: same failure on a clean
`qa-prod-v3` tree. Root cause: the bundled `rig-mcp` runtime deps were never
installed in this workspace. Fixed locally with `npm ci` in `rig-mcp/`. Full
gate then green: secrets 13/13, node suite 553/553 (1 unrelated skip),
pi-extension 15/15, rig-mcp 6/6. `check-rule-copies` and `check-versions`
passed in-chain.

## In flight / next

- Closed 2026-08-31. See [[reasoning/2026-08-31-routing-hygiene-close-out]].
