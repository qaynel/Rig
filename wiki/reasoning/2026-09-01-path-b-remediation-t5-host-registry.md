# Task 5 — Host registry scan roots (2026-09-01)

## What changed

`inventoryHarness` was scanning a hard-coded set of eight directories
(`HARNESS_DIRS` in `rig/lib/inspect.js`). Cursor's skill root, GitHub Copilot
CLI's agent root, OpenCode agents, Devin skills, Windsurf skills, Gemini
extensions, and Swival skills were omitted, so files placed at those paths were
invisible to inventory.

## Root cause

`HARNESS_DIRS` was a second, separate list that diverged from the host registry
in `host-capabilities.js`. No mechanism forced the two lists to stay in sync.
The path-shape conditionals in `inventoryHost` and `inventoryKind` had the same
problem: each new host required hand-edits in two or three places.

## What was done

### `rig/lib/host-capabilities.js`

Added two new exports:

- **`SCAN_ROOTS`** — an array of `{ root, host, kind }` objects covering all
  repo-relative directories that `inventoryHarness` should walk. Entries for the
  eight pre-existing directories are reproduced here (so the list is complete),
  plus seven new scan roots for cursor (`.cursor/skills`), copilot-cli
  (`.github/agents`), opencode (`.opencode/agents`), devin (`.devin/skills`),
  windsurf (`.windsurf/skills`), gemini (`.gemini/extensions`), and swival
  (`.swival/skills`).

- **`INSTRUCTION_FILE_HOSTS`** — a map from well-known instruction file paths
  (CLAUDE.md, AGENTS.md, GEMINI.md, .cursorrules, copilot-instructions.md,
  .github/copilot-instructions.md) to their host ids. These files are collected
  via `HARNESS_NAMES` / special copilot logic and need host classification
  without a scan-root match.

### `rig/lib/inspect.js`

- `HARNESS_DIRS` is now `SCAN_ROOTS.map((r) => r.root)` — single source of truth.
- `inventoryHost(rel)` checks `INSTRUCTION_FILE_HOSTS` first, then walks
  `SCAN_ROOTS` for a prefix match; falls back to `'generic'`.
- `inventoryKind(rel)` checks `HARNESS_NAMES` / `INSTRUCTION_FILE_HOSTS` for
  `'instruction'`, then walks `SCAN_ROOTS`; for `'skill-dir'` roots it returns
  `'skill'` (SKILL.md) or `'skill-asset'`.

No path-shape string conditionals remain in either function.

### `tests/path-b-hardening.test.js`

Appended Task 5 matrix: one `it` per new scan root (cursor, copilot-cli,
opencode, devin, windsurf, gemini, swival). Each test creates a file at the
host's skill root, calls `inventoryHarness`, and asserts the file appears with
the correct host value. Tests were written failing before the fix and are now
green.

## Test results

- `node --test tests/path-b-inventory.test.js tests/path-b-hardening.test.js`:
  28 pass, 0 fail (was 21/0 before Task 5).
- `node scripts/check-advanced-spec.js`: 83 cases, Oracle verified — unchanged.
- `npm test`: all suites green (637 + 15 + 13 + 6 pass across all runners).

## Decisions

- `SCAN_ROOTS` lives in `host-capabilities.js` (not inspect.js) so that any
  future caller — not just inventory — can derive the same list from the single
  registry.
- The `.github/copilot-instructions.md` special case in `collectHarnessFiles`
  is left in place; it is a file-discovery concern, not a classification
  concern, and the frozen tests do not gate on removing it.
- `HARNESS_NAMES` remains in `inspect.js` because it drives `collectHarnessFiles`
  (finding the files) independently of classification.
