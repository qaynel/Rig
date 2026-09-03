---
date: 2026-09-03
source: agent
topics: onboarding-flow, trust-and-failure-boundaries, testing-strategy
decisions:
status: current
supersedes:
tags: interdependency, trap
summary: F4's per-host scope enumeration (AT-HD-4, AT-HD-10 I-B-2) is implemented per spec, but exposed two latent defects it did not anticipate — a false-negative in rewriteProjectedName and a real conflict between Path B's name-consistency check and the legacy Tier 1 byte-identity contract for shared core-skill files. Both are now fixed at the correct layer.
---

# F4 (per-host scope enumeration) — implementation notes and two exposed defects — 2026-09-03

## What shipped

Implemented `wiki/gate2/onboarding-hardening-spec.md` §3 F4 as specified:

- `rig/lib/onboarding.js`: `installedHostIds(target)` reads the exact
  installed host list from `.rig/release.json` (new `hosts` field, written by
  `rig/lib/payload.js`'s `runPayload`) rather than inferring installed hosts
  from marker-file existence. `installedSkillScopes` now walks that list and
  adds each host's native (`nativeScope`) or instruction-only
  (`instructionOnlyScope`) decision independently — no aggregate
  any-native-present boolean suppresses another host's own scope.
- `canonicalSkillName`/`scopedSkillName` replace the single `projectedSkillName`:
  every skill's canonical identity strips a leading `rig-` (except the
  literal `rig` skill, which stays `rig` in every scope); native scopes
  re-add the prefix, the instruction-only scope stays unprefixed, matching
  `rig/tier-1/routing.md`'s router contract.
- `rig/lib/payload.js`: `.rig/release.json` now records
  `{ tag, hosts: [...selected].sort() }`. Two non-frozen tests
  (`tests/release-blockers.test.js`, `tests/context-aware-onboarding.test.js`)
  asserted the old two-key shape and were updated to the new one.

## Defect 1 — rewriteProjectedName's false-negative on an idempotent rewrite

`rewriteProjectedName` detected "no rewriteable name field" by comparing the
replaced string to the original (`next === source`). That conflated two
different conditions: the regex not matching at all, and the regex matching
but producing byte-identical output because the target name already equals
the source's own name. The second case only became reachable once F4 made
the instruction-only scope's target name for the `qa` skill exactly equal to
`qa`'s own unprefixed source name — every prior call site always changed the
name (adding a `rig-` prefix), so the ambiguity was latent. Fixed by testing
the pattern's `.test()` result directly instead of the replacement's effect.

## Defect 2 — Path B's name-consistency check vs. the legacy byte-identity contract

The real interdependency, caught by `tests/rig-bootstrap.test.js` ("Tier 1
bootstrap configures every explicitly selected instruction host"), not by
any AT-HD/`tests/path-b-*` file:

`rig/manifest.json` stages each of the seven mandatory core skills' canonical
source (frontmatter always declares the native name, e.g.
`name: rig-debugging`) to three destinations from the *same* manifest entries
regardless of Path B vs. legacy Tier 1 delivery mode: `.claude/skills/rig-<name>/`,
`.agents/skills/rig-<name>/`, and `.rig/skills/<name>/` (unprefixed, gated
`instruction_only_selected`). `tests/rig-bootstrap.test.js` requires all
three to be byte-identical — a pre-existing, still-valid guarantee for the
legacy static router, which resolves skills by path, not by reading
frontmatter.

Once F4 made the instruction-only scope actually reachable alongside a
native scope in the same install (previously suppressed by the aggregate
boolean this finding fixes), `onboarding-check.js`'s `projectionFailures`
exercised its `skill-name-mismatch` check against `.rig/skills/debugging/SKILL.md`
for the first time in a passing-required path — and correctly found that its
declared `name: rig-debugging` doesn't literally equal its directory
`debugging`.

First attempt: rewrite the staged bytes at install time (new `copy` manifest
op flag) so the instruction-only copy declares the unprefixed name. This
broke the byte-identity guarantee `tests/rig-bootstrap.test.js` depends on —
reverted.

Correct fix: `projectionFailures`'s name check now compares *canonical*
identity (leading `rig-` stripped from both the declared name and the
expected directory) rather than literal string equality. This preserves the
legacy shared file untouched — core skills keep declaring their native name
everywhere — while still catching a genuine mismatch (a `qa`-named file
sitting in a `debugging` directory would still fail). Optional skills are
unaffected: `rewriteProjectedName` already forces literal equality for them,
and canonicalizing two already-equal strings is a no-op.

## Verification

`node --test tests/onboarding-hardening.test.js tests/onboarding-invariants.test.js tests/path-b-*.test.js tests/context-aware-onboarding.test.js tests/release-blockers.test.js tests/rig-bootstrap.test.js tests/install-uninstall-roundtrip.test.js tests/installed-router-hygiene.test.js`
— 223/227 pass; the 4 remaining failures (`AT-HD-1`, `AT-HD-3`,
`AT-HD-9 I-A-1`, `AT-HD-10 I-B-1`) are F1/F3, not yet implemented (next
slices), not a regression from this change.

## Not a return-to-grilling trigger

Neither defect required changing an oracle test body (`tests/onboarding-hardening.test.js`
/ `tests/onboarding-invariants.test.js`), and the affected test
(`tests/rig-bootstrap.test.js`) is outside the frozen Gate 1 manifest. Both
fixes are confined to implementation code (`onboarding.js`,
`onboarding-check.js`) and two non-frozen test files' shape assertions.
