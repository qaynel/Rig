# Token-burn investigation — why "simple" tasks exhaust the 5h/weekly limit

Checked 2026-08-25. Source: three pasted session transcripts in
`.context/attachments/` (BLwqS2, 528fiH, vVOguJ).

## What the traces actually show

The premise "simplest default tasks" is not what these sessions were doing:
- 528fiH = the **v5.0.0 release ceremony** (RIG-120): resume-from-pasted-transcript,
  then "I gave consent, go". 2 user turns, but **86 Bash + 26 Edit** in effectively
  one assistant turn.
- vVOguJ = **RIG-104**, a real two-path MCP refactor with 3 acceptance criteria.
  71 Bash + 30 Read + 27 Edit + 4 Write, hit the session limit.
- BLwqS2 = a fresh session that pasted the 528fiH log, re-read routing, re-ran the
  gate, spawned a review receipt, then "hit weekly limit."

So the tasks are substantial, not trivial. But the burn is still disproportionate,
and it is **tool-call volume + nested model spawns**, not context-window pressure.
No trace hit a context wall; they hit the account rate/weekly limit. Context
engineering is the wrong lever.

## The three multipliers (ranked)

1. **Nested reviewer-model retry loop** — biggest. `scripts/review-receipt.js`
   (`spawnSync`, `TIMEOUT_MS = 30*60*1000`, `review-receipt.js:18-22`) launches a
   *second full model* (claude/codex) that reviews the entire diff. In 528fiH it
   returned `verdict: fail` and the script printed `rejected reviewer report` at
   lines **262, 646, 840** — three full nested-review cycles in one turn, each
   interleaved with code edits + a full gate run. One "release" task silently forks
   3+ complete model reviews of the whole diff.

2. **Full-gate `npm test` as the inner loop** — 6× in 528fiH, 7× in vVOguJ. Each run
   is the entire CI gate (check-rule-copies, check-versions, full node suite,
   pi-extension, rig-mcp, plus the `.venv`/pandas benchmark). Used as the red/green
   step instead of the fast subset. CLAUDE.md documents `npm run test:rig` as the
   fast subset; the agents ignored it and ran the full gate every cycle.

3. **Transcript re-ingestion meta-loop** — the human workflow is: hit limit → paste
   the whole ~74KB prior transcript into a fresh session → new model re-reads
   routing.md + wiki, re-runs the gate, re-derives state, re-spawns receipts → hits
   the limit again (BLwqS2 is exactly this). Pasting the log does not restore model
   state; it re-injects raw text the new model must re-parse and re-verify.

## Contributing per-turn tax

CLAUDE.md mandates, every task: read routing.md before acting, read the wiki before
grepping, read each chosen skill *completely*, and rewrite wiki every 3 minutes. The
SessionStart superpowers hook mandates invoking a skill before *any* response. These
are correct for long multi-step work but are a flat tax on small tasks, and they
compound with (3) on every resume.

## Fix directions (see report to owner)

- review-receipt: a `fail` verdict is real signal — stop and surface it, do not
  auto-re-review; cap re-reviews at 1; use a cheap reviewer model for interim passes
  and reserve the expensive model for the final receipt; it is a release-only gate,
  never a mid-development loop.
- Inner loop uses `npm run test:rig` / the single relevant test file; full `npm test`
  runs once before push.
- Resume from `wiki/status.md` (the designed hand-off), not from pasting the log;
  trust it instead of re-verifying everything.
- Scope the "read full skill / update wiki every 3 min" cadence to multi-step tasks.
