# Task 2 — Single playbook write per install mode

**Date:** 2026-09-01
**Branch:** path-b-adaptive-onboarding-oracle
**Author:** Vaibhav Kodiyan

## Defect

The canonical onboarding playbook destination `.rig/skills/onboarding/SKILL.md`
received two applied journal records on every adaptive (Path B) install:

1. `rig/manifest.json` entry with no gate — wrote the wrapper `SKILL.md` unconditionally.
2. `rig/manifest.json` entry with `gate: "active_delivery"` — overwrote with the full
   `playbook.md` in adaptive mode.

In adaptive installs the journal writer recorded `state: 'applied'` twice for the same
`path`, which is a contract violation: each destination must appear at most once in the
applied ledger per install run.

## Root cause

The wrapper entry in `rig/manifest.json` lacked a gate, so it executed in all modes.
The `default_delivery` gate already existed in `payload.js`
(`if (entry.gate === 'default_delivery' && activeDelivery) continue;`) but was unused
for this entry.

## Fix

Added `"gate": "default_delivery"` to the wrapper entry in `rig/manifest.json`:

```json
{ "op": "copy", "from": "rig/tier-1/skills/onboarding/SKILL.md",
  "to": ".rig/skills/onboarding/SKILL.md", "host": "neutral", "gate": "default_delivery" }
```

Result:
- **Legacy mode** (`activeDelivery: false`): wrapper entry runs, playbook entry is skipped.
  One applied record for `PLAYBOOK_DEST`.
- **Adaptive mode** (`activeDelivery: true`): wrapper entry is skipped, playbook entry runs.
  One applied record for `PLAYBOOK_DEST`.

No changes to `rig/lib/payload.js` were required — the gate logic was already present.

## Tests added

Two tests appended to `tests/path-b-hardening.test.js`:

1. **Adaptive install: exactly one applied journal record for PLAYBOOK_DEST** — failed before
   fix (got 2), passes after.
2. **Legacy install: wrapper written, full playbook not written** — regression guard; content
   of written file must equal wrapper `SKILL.md` and differ from `playbook.md`.

## Verification

- `node --test tests/path-b-hardening.test.js` green (3 pass, 0 fail).
- `npm test` green (83 oracle cases, all code suites, pi-extension, rig-mcp).
- `node scripts/check-advanced-spec.js` exit 0 throughout.

## Decisions

- Fix applied in `rig/manifest.json` not `payload.js`. The gate mechanism is manifest-driven;
  adding logic to `payload.js` to special-case the onboarding path would couple the installer
  to content decisions that belong in the manifest.
- `rig/manifest.json` was not one of the 14 frozen files; changing it is permitted.
