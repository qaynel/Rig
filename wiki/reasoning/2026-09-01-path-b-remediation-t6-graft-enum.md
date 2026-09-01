# Task 6 — Unapproved graft enumeration in check

**Date:** 2026-09-01  
**Branch:** path-b-adaptive-onboarding-oracle  
**Status:** complete

## Problem

`onboardingCheck` only verified grafts named in `state.applied.grafts`. A structurally
valid Rig graft marker injected into any file after approval was invisible to check —
no failure, no signal.

## Root cause

`projectionFailures` in `onboarding-check.js` walked the skill projection roots and
compared those paths against the install journal, but never enumerated live graft
markers across instruction surfaces. The graft verification loop only iterated
`state.applied?.grafts` (the approved set), so only the approved paths were ever
parsed.

## Fix

### `rig/lib/payload.js`

Added `enumerateGraftMarkers(target)` (exported):
- Resolves the real target path.
- Scans `INSTRUCTION_FILE_HOSTS` keys (CLAUDE.md, AGENTS.md, GEMINI.md,
  .github/copilot-instructions.md, etc.) filtered by `isGraftMarkdownPath`.
- Walks every directory in `SCAN_ROOTS` (the Task 5 registry-driven list) and
  collects markdown files.
- Deduplicates by relative path and parses each file with `parseGraftSections`.
- Returns `{ rel, capability, version, content_digest }` tuples for every live
  marker, skipping files that fail to parse (those are reported by
  `projectionFailures`/`reconcileApplied`).

Added `SCAN_ROOTS` and `INSTRUCTION_FILE_HOSTS` to the import from
`./host-capabilities` (the module already imported from there).

### `rig/lib/onboarding-check.js`

Added `unapprovedGraftFailures(target, state)`:
- Builds the approved set: `${path}\0${capability}` strings from
  `state.applied?.grafts || []`.
- Calls `enumerateGraftMarkers(target)` for the live set.
- Any tuple not in the approved set produces a `failure('unapproved-graft', ...)`.
- Failure message directs the operator to remove manually or re-run propose/apply.
- Does NOT auto-remove — the section is left as forensic evidence.

Wired `unapprovedGraftFailures` into `checkOnboarding`'s `hardFailures` spread.

### `tests/path-b-hardening.test.js`

Appended "Task 6 — unapproved graft enumeration in check" describe block with one
test:
1. Runs a full apply+check cycle (asserts `hard_failures === []`).
2. Writes a syntactically valid Rig graft for `testing.rogue-injection` into
   `CLAUDE.md` (a file not in applied state).
3. Calls check again.
4. Asserts `result.hard_failures.some(f => /unapproved.*graft/i.test(f.code))`.

## Design decisions

- Put `enumerateGraftMarkers` in `payload.js` as the brief requested; it already
  imports from `host-capabilities.js` so no new dependency cycle.
- Private `walkAllFiles` helper added to `payload.js` (analogous to `walkFiles` in
  `onboarding-check.js`).
- Malformed-graft files are skipped silently in enumeration; `projectionFailures`
  and `reconcileApplied` already report parse failures via separate codes.
- The approved set is keyed by `${rel}\0${capability}` (NUL separator) to avoid
  false matches between adjacent path/capability strings.

## Test result

`node --test tests/path-b-hardening.test.js`: 21 pass, 0 fail.  
`npm test` (full CI gate): all pass, 83 oracle cases verified.

## Rejected approaches

- Auto-removing the unapproved section: rejected by the acceptance criteria; forensic
  evidence must be preserved so an operator can audit what was injected and when.
- Putting the scan logic in `onboarding-check.js` directly: workable, but the brief
  asked for `enumerateGraftMarkers` in `payload.js` and it's a reusable primitive.
