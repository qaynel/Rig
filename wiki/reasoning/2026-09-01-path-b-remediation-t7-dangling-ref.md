# Task 7 — Registry-driven dangling-reference scan

**Date:** 2026-09-01  
**Branch:** path-b-adaptive-onboarding-oracle  
**Task:** Remediation Task 7 — "Dangling-reference checking ignores installed adapters"

## Problem

`danglingReferences` in `rig/lib/onboarding-check.js` had a hand-written file list:

```js
['AGENTS.md', 'CLAUDE.md', 'GEMINI.md',
 '.agents/rules/rig.md', '.claude/skills/rig-onboarding/SKILL.md',
 '.agents/skills/rig-onboarding/SKILL.md', '.rig/skills/onboarding/SKILL.md']
```

Two categories of installed adapter file were never scanned:
1. `.claude/skills/rig-onboarding/SKILL.md` — the claude host skill adapter that points at `.rig/skills/onboarding/SKILL.md`. Removing the canonical playbook left this reference dangling while the check passed.
2. `.cursor/rules/rig.mdc` (and other SCAN_ROOTS rule files for every other host) — these point at `.rig/routing.md` and were never scanned.

## Fix

Replaced the hard-coded list with registry-driven enumeration using `SCAN_ROOTS` and `INSTRUCTION_FILE_HOSTS` (both added in Task 5).

### Source A: SCAN_ROOTS filtered to pointer-bearing files

- **kind='rule' and kind='steering'**: all files — every rule/steering file is a pointer adapter.
- **kind='skill-dir'**: only the `rig-onboarding/` subdirectory — the canonical skill adapter that points to `.rig/skills/onboarding/SKILL.md`. Other vendored skills (rig-qa, rig-connect-chrome, etc.) reference future/runtime paths and produce excessive false positives.

### Source B: INSTRUCTION_FILE_HOSTS

Fixed instruction files: `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.cursorrules`, etc.

### Rejected approaches

1. **Scanning all journal-applied files**: Vendored skills in `.agents/skills/` reference dozens of runtime paths (`.rig/sessions`, `.rig/analytics/`, etc.) that don't exist in fresh install targets. This produced 80+ false-positive dangling-reference failures.
2. **Scanning all SCAN_ROOTS files without filtering**: Same problem — vendored skill files in `skill-dir` roots reference runtime paths.

## Matrix test added

Three-host matrix in `tests/path-b-hardening.test.js` (Task 7 describe block):

| Host | Adapter file scanned | Pointer target removed | Expected failure |
|------|---------------------|----------------------|-----------------|
| cursor | `.cursor/rules/rig.mdc` | `.rig/routing.md` | `dangling-reference` |
| claude | `.claude/skills/rig-onboarding/SKILL.md` | `.rig/skills/onboarding/SKILL.md` | `dangling-reference` |
| codex | `.agents/skills/rig-onboarding/SKILL.md` | `.rig/skills/onboarding/SKILL.md` | `dangling-reference` |

The claude case is the key regression test: the old hard-coded list was missing `.claude/skills/rig-onboarding/SKILL.md`, so removing `.rig/skills/onboarding/SKILL.md` after a claude install passed the check silently.

## Files changed

- `rig/lib/onboarding-check.js`: replace hard-coded list with SCAN_ROOTS + INSTRUCTION_FILE_HOSTS enumeration; add `SCAN_ROOTS`/`INSTRUCTION_FILE_HOSTS` import from `host-capabilities`.
- `tests/path-b-hardening.test.js`: append Task 7 matrix tests.

## Test result

`npm test` exit 0. 24 tests in `tests/path-b-hardening.test.js` (21 existing + 3 new). Oracle verified: 83 cases.
