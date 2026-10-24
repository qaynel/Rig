---
date: 2026-10-13
source: agent
topics: onboarding-flow, graft-mechanics, distribution-and-release
decisions:
status: historical
supersedes:
tags: corpus, contract, rejected
summary: Subplan 03 slice 6 (Contract) — rig/tier-1 deleted, core skill sources point into rig/corpus, check-rule-copies.js rewritten as the reproducible-projection plus no-twin gate (kept by name because package scripts are pinned), mirrors generated, tier wording removed with --tier 1 deprecated-but-accepted, intended parity differences recorded.
---

# 03 central corpus — slice 6: Contract

## Done

- `rig/tier-1/` deleted (everything already lived in `rig/corpus/`). Zero live
  hits remain for the old path outside history: `wiki/`, `docs/superpowers/`,
  `tests/fixtures/`, the pinned catalogue `rig/catalog.json`, the shipped shelf
  catalogue, and manifest-pinned oracle files (one comment). Enforced by
  `tests/corpus-contract.test.js`.
- `CORE_SOURCES` in `rig/lib/skill-catalog.js` and the regenerated
  `rig/catalog/skills/catalog.json` now name `rig/corpus/skills/...`.
- `scripts/check-rule-copies.js` keeps its name (the pinned `test:code` script
  and `wiki/gate1/package-scripts.json` call it) but now proves: every
  generated host file equals the corpus projection; no corpus file has a
  byte-identical twin outside the generated set; the rule invariants survive.
  The gate immediately found two real twins nobody tracked
  (`.opencode/command/rig*.md`, `antigravity-plugin/rules/rig.md`); they are
  now generated mirrors listed in `rig/corpus/rules/repo-copies.json`.
- Tier wording removed from the README (en/es/ko), router, bootstrap banner and
  prompt, debugging skill, wiki-maintenance skill pair, and the repository
  instructions. `--tier 1` prints a deprecation notice and continues; any other
  value (including empty) exits 1 before writing; no interactive prompt.
- Intended parity differences recorded: shipped router text, debugging skill
  text, regenerated pinned catalogue (and its staged copy), plus the new
  onboarding/upstream files.

## Rulings

1. Generated host projections stay checked in (a fresh clone's agents read
   them) and count as install output for the no-twin rule; they cannot drift
   (the gate fails). Dropping them from git needs a pretest hook, which is a
   pinned package script, so it is recorded for the owner, not done.
2. The check-rule-copies name is kept for the same reason; see amendment A3.
3. Historical README translations remain partial; subplan 09 owns their full
   rewrite.
4. Tests that merely mention `Tier 1` in their own names (`rig-bootstrap`,
   `basic-*`) are not user-facing and were left.
