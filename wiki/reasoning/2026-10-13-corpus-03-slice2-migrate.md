---
date: 2026-10-13
source: agent
topics: onboarding-flow, graft-mechanics
decisions:
status: current
supersedes:
tags: corpus, projection, rejected
summary: Subplan 03 slice 2 (Migrate) — payload.js and onboarding.js now install through project(); rig/manifest.json lists only the neutral layer; MCP one-table equivalence test added; materializeSelectedHosts deleted (frozen AT-HOST-5 goes red, amendment A1 filed); stale markdown-only line fixed once in the canonical body.
---

# 03 central corpus — slice 2: Migrate

## Done

- `rig/lib/payload.js` `runPayload` loads the corpus snapshot, calls
  `projectAll`, and applies each entry through the journalled writer
  (`write`, `seed_user_file`, `pinned_catalog`, `ensure_line`,
  `ensure_gitignore_block`). The per-op copy helpers, `loadCanonicalManifest`
  and `hostSelected` are gone. A new test installs every one of the 26 golden
  configurations for real and compares disk bytes to the v5 inventory: no
  differences, so the intended-differences list is still empty.
- `rig/manifest.json` keeps only the neutral rows (35); host-specific rows
  (37) are gone and the file says so. Neutral `from` paths now point into the
  corpus.
- `rig/lib/onboarding.js` reads the same scope table and naming/rewrite
  functions as the installer (`NATIVE_SKILL_SCOPES`, `scopedSkillName`,
  `projectSkillFiles` in `project.js`). Path B suites (155 frozen + hardening)
  are green.
- RIG-125: `tests/mcp-one-table.test.js` proves, for every auto-write host,
  that the advertised descriptor path/key, the `MCP_HOSTS` row, and the
  renderer's real output agree; no host claims auto-write without a writer.
- RIG-132/110: `materializeSelectedHosts` deleted. It had no production
  caller; the only users were `tests/advanced-hosts.test.js` (updated to
  `MCP_HOSTS`) and the frozen `AT-HOST-5` in `tests/advanced-oracle.test.js`.
  Ruling: remove it anyway (the owner brief says remove; code is cheap) and
  carry the frozen-test diff as amendment A1
  (`candidate-amendments/03-central-corpus.md`). That frozen case is the one
  known red until the owner applies the bundle.
- The stale "Tier 1 is the markdown-only bootstrap" line is fixed once, in
  `rig/corpus/rules/repo-instructions.md`; `node scripts/project-repo.js`
  regenerated the six host rule copies and everything in `AGENTS.md` after its
  hand-authored first line.

## Rejected

- Symlink-containment check in the corpus loader. It broke the existing
  tagged-archive installer test (`fs.cpSync` rewrites links as absolute) and
  v5 never had it. Reverted; the loader follows source links as v5 did.

## Next

Slice 3: onboarding instructions inside `rig/corpus/onboarding/` incl.
`unpack.md`, the agent-script proposal slot with its sandbox-or-refuse
boundary, artifact validation, journaled apply, adversarial tests.
