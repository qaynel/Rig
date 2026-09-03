---
date: 2026-09-02
source: agent
topics: agent-working-conventions
decisions:
status: historical
supersedes:
tags:
summary:
---

# The wiki context-debloat routine is now a skill

The seven-step wiki sync + context-debloat routine — captured in
`.context/wiki-sync-and-context-debloat-research-brief.md` and its execution
plan — is packaged as the `wiki-maintenance` skill at
`.claude/skills/wiki-maintenance/SKILL.md`, backed by
`scripts/wiki-maintenance.js` (`status` readiness report + `lint` checks that
reuse `scripts/build-wiki-index.js`).

Steps 1–3 (lifecycle sweep, hub sync, untagged-trace disposition) recur every
release. Steps 0 and 4–7 (drift guard, archive, primer page, lints, token
instrument) are one-time infrastructure whose "Skip if" markers make repeated
runs idempotent. The skill is authoring-time only and is not part of the
installed Tier 1 payload: `.claude/skills/wiki-maintenance/` sits outside the
`.claude/skills/rig-*` install and gitignore globs.

Run it after a major release, or on a schedule via `/schedule` or `/loop` —
`node scripts/wiki-maintenance.js status` is read-only and every step
self-skips once satisfied.

This change adds tooling and a skill document; it does not execute any of the
seven steps and does not wire the lint into `npm test`. Step 6 of the routine
owns that wiring under its own trace.

## Deferred ideas (recorded, not scheduled)

- Ship the debloating + context-management routine as a first-class Rig
  capability that other repositories install, rather than a Rig-repo-local
  maintenance skill.
- Survey how the Claude "superpowers" skills could be delivered to every
  supported host (Codex, Antigravity, and the rest) rather than native
  Claude only — a host-neutral path for skill payloads.
