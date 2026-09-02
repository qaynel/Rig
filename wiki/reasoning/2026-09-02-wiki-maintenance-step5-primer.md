---
date: 2026-09-02
source: agent
topics: agent-working-conventions
decisions:
status: historical
supersedes:
tags: interdependency
summary: Wiki maintenance Step 5 — added wiki/agent-primer.md as the single mandated read and rewired CLAUDE.md, AGENTS.md, GEMINI.md, rig/tier-1/routing.md, and wiki/reasoning/README.md to describe the same primer-based cadence; the six AGENTS.md rule copies were synced to match. Needs explicit human review before merge.
---

# Wiki maintenance Step 5 — single primer page

## What shipped

- `wiki/agent-primer.md` — one short page. It routes the reader through
  `Home.md`, `status.md`, the four most-used topic hubs, and the four core
  indexes, states the read-before-grep rule, and preserves the task-weight
  carve-out.
- `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `rig/tier-1/routing.md`, and
  `wiki/reasoning/README.md` now describe the same primer-based cadence.
- The six AGENTS.md rule copies (`.cursor/rules/rig.mdc`,
  `.windsurf/rules/rig.md`, `.clinerules/rig.md`, `.agents/rules/rig.md`,
  `.github/copilot-instructions.md`, `.kiro/steering/rig.md`) were resynced
  by `scripts/check-rule-copies.js`'s equivalence rule; they now match the
  updated AGENTS.md body verbatim.

## What did not change

- The task-weight carve-out in `rig/tier-1/routing.md` § Task weight is
  preserved verbatim. A single-step task still skips the primer.
- Ground Rule 3 kept `wiki/gate1/` and `wiki/gate2/` off-limits.
- No trace bodies were edited (Ground Rule 1).

## Why this is the higher-risk step

The routine warned Step 5 changes the agent's core read contract. Even with
`npm test` green, an agent following the new cadence reads a different set
of files first. That is the whole point — but it should be verified in
practice, not only in tests. Flag this PR for explicit human review before
merge.

## Follow-up

- Rerun `node scripts/build-wiki-index.js` for `status.md` regeneration.
- Steps 6 and 7 remain outstanding.
