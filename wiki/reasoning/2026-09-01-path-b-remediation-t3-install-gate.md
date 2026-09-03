# Task 3 reasoning trace — adaptive install gating for instruction-only hosts

**Date:** 2026-09-01
**Task:** T3 of the Path B remediation plan (task-3-brief.md)
**Defect:** Instruction-only hosts (cursor, copilot, opencode, devin, etc.) discover all 63 skills before approval in adaptive mode. The neutral optional-skill fan-out was unconditional.

## Root cause

`rig/manifest.json` line 49 contained an `install_vendored_skills` entry with `host: "neutral"` and no gate. In adaptive mode (`activeDelivery: true`), this ran unconditionally for ALL host selections, writing all 55 vendored optional skills to `.rig/skills/{name}/`. Instruction-only hosts whose only skill-discovery path is `.rig/skills/` therefore exposed all 63 skills (7 mandatory + 1 onboarding + 55 optional) before any approval.

## Why the naive fix was wrong

The first approach was to add `gate: "default_delivery"` to the neutral entry. This silenced the fan-out in all adaptive installs, including bare installs (no hosts detected). Two existing tests broke:

1. `release-blockers.test.js` "a bare repository receives the neutral skills, catalogue, and safety runtime" — expects ALL 55 vendored skills in `.rig/skills/` for `runPayload(target, undefined, {activeDelivery: true})` (no hosts).
2. `release-blockers.test.js` POSIX installer test — expects 56 skills (55 optional + 1 onboarding) after `install.sh --version v5.0.0` with no `--host` flag on a clean directory.

Both represent the legitimate scenario where no host is detected (`instructionOnly=false`). The neutral fan-out serves as the only discovery path in that case.

## Correct fix

Added a new targeted gate type `suppress_on_instruction_only_adaptive` in `payload.js`:

```js
if (entry.gate === 'suppress_on_instruction_only_adaptive' && instructionOnly && activeDelivery) continue;
```

This gate suppresses the entry ONLY when BOTH conditions hold:
- `instructionOnly=true` (an instruction-only host is in the selected set)
- `activeDelivery=true` (adaptive install mode)

Bare installs (no hosts, `instructionOnly=false`) and legacy installs (`activeDelivery=false`) are completely unaffected. The neutral fan-out still runs in both those scenarios.

The manifest entry for the neutral `install_vendored_skills` was updated to use this gate.

## Host classification: adding opencode and devin

The brief requires exactly 8 mandatory skills for cursor, copilot, opencode, and devin. `opencode` and `devin` were not in the `INSTRUCTION_ONLY` list in `payload.js`. Both have `native_skill: 'emitted'` in the host-capabilities registry, but Rig has no manifest entries targeting their native skill directories (`.opencode/agents/`, `.devin/skills/`). They therefore rely on `.rig/skills/` for discovery — the same path as the established instruction-only hosts.

**Resolution:** Added `opencode` and `devin` to `INSTRUCTION_ONLY_HOSTS` exported from `host-capabilities.js`. `payload.js` now derives `INSTRUCTION_ONLY` from that set, keeping classification in one place.

## Files changed

- `rig/lib/host-capabilities.js`: Export `INSTRUCTION_ONLY_HOSTS` set (9 hosts: existing 7 + opencode + devin).
- `rig/lib/payload.js`: Import `INSTRUCTION_ONLY_HOSTS`; derive `INSTRUCTION_ONLY` from it; add `suppress_on_instruction_only_adaptive` gate handler.
- `rig/manifest.json`: Add `gate: "suppress_on_instruction_only_adaptive"` to the neutral `install_vendored_skills` entry.
- `tests/path-b-hardening.test.js`: Append Task 3 suite — 5 tests (4 per-host counts, 1 staged-shelf assertion).
- `wiki/reasoning/2026-09-01-path-b-remediation-t3-install-gate.md`: This file.

## Verification

- `node --test tests/path-b-hardening.test.js`: 8/8 pass.
- `node --test tests/path-b-install.test.js tests/path-b-hardening.test.js`: 12/12 pass.
- `npm test`: exit 0 (626 tests: 625 pass, 0 fail, 1 pre-existing skip).

## What is true now

- In adaptive mode, instruction-only hosts (cursor, windsurf, cline, kiro, gemini, copilot, antigravity, opencode, devin) see exactly 8 mandatory skills in `.rig/skills/` before any approval.
- The 55-skill optional shelf is staged under `.rig/runtime/rig/catalog/skills/` for post-approval projection.
- Bare installs (no host detected) still receive all 55 optional skills in `.rig/skills/` in adaptive mode (unchanged behaviour — this is the bootstrap scenario, not the instruction-only approval gate).
- Legacy mode (default install) is completely unaffected: all 55 optional skills still fan-out unconditionally.
