---
date: 2026-09-01
source: agent
topics: the-catalogue, onboarding-flow, testing-strategy
decisions: PB-1
status: historical
supersedes:
tags: interdependency
summary: Path B slice 1 landed the skill-shelf capability hierarchy, the generated pinned catalogue, and the eight-skill pre-approval projection.
---

# Path B slice 1 — catalogue spine (F-1 + F-3)

`tests/path-b-catalog.test.js` is green (7/7). The frozen oracle was not
touched; `node scripts/check-advanced-spec.js` still reports 14 files, 83
acceptance cases.

## What is now true

- The 55 optional vendored skills moved from a flat `rig/catalog/skills/<dir>/`
  to `rig/catalog/skills/<family>/<capability-leaf>/<dir>/`. Source hierarchy
  never dictates the invocation name; the frontmatter `name` still does.
- Every optional `SKILL.md` and every core workflow `SKILL.md` declares
  `family`, `tool`, `capability`, `guarantees`, and `overlap_tags`. The parser
  in `rig/lib/skill-catalog.js` reads only bounded scalar, folded-scalar, and
  block-sequence shapes — no YAML dependency was added.
- `rig/catalog/skills/families.json` holds the eleven doctrine families as
  reviewable data. `rig/catalog/skills/migrations.json` exists with an empty
  alias map: no callable name actually changed in this migration, so recording
  one would have been a fiction. `connect-chrome` now *declares* the name the
  old collision tie-break already gave it, which removes the collision at the
  source instead of aliasing around it.
- `scripts/build-skill-catalog.js` generates `rig/catalog/skills/catalog.json`
  (63 skills: 55 optional + 7 core + `rig-onboarding`). `--check` runs inside
  `scripts/check-versions.js`, so catalogue drift now fails `npm test`.
- `runPayload({ activeDelivery: true })` copies those bytes verbatim to
  `.rig/catalog.json`, stages the whole shelf under
  `.rig/runtime/rig/catalog/skills/`, and refuses to overwrite a
  `.rig/catalog.json` whose bytes no longer match its own journal receipt.
- `rig/lib/onboarding.js` exists with the catalogue-facing halves of `prepare`
  and `propose` only. A malformed installed catalogue makes `prepare` throw
  before any state is written; a catalogue whose `release.skills_digest` no
  longer matches its own rows makes a later `propose` throw. Slices 2–4 own the
  rest of the state machine.

## The pre-approval projection split (integration risk called out in the plan)

The plan warned that pre-approval projection drops from 55 to 8. It does — but
only on the adaptive install. `runPayload`'s new `default_delivery` gate keeps
the legacy markdown-only Tier 1 install fanning all 55 optional skills into
`.claude/skills/` and `.agents/skills/`, while the Path B install
(`--with-runtime`, the only path `install rig` will use after slice 6) projects
exactly `rig-code-review`, `rig-debugging`, `rig-execution`, `rig-grilling`,
`rig-implementation`, `rig-onboarding`, `rig-product-design`, `rig-tdd`.

This was a deliberate choice over deleting the native fan-out outright. The
frozen oracle only constrains the adaptive path, and the legacy path carries a
guarantee of its own that nothing asked us to drop: RIG-149's guard that the
vendored `rig` router is addressable as `rig` (never `rig-rig`) on native
hosts. Keeping the split preserves that guard where it still applies and lets
slice 6 retire the legacy path as a whole, rather than hollowing it out now.

## Non-frozen tests that legitimately moved

- `tests/rig-bootstrap.test.js` — `rig-onboarding` joins the shared core skill
  list, and `--with-runtime` now proves per-skill code lands in the staged
  runtime shelf rather than in `.claude/skills/`.
- `tests/vendored-skills-install.test.js` — the adaptive install must *not*
  project optional skills; the shelf with its source code is asserted at
  `.rig/runtime/rig/catalog/skills/`.
- `tests/routing-sop.test.js` — `rig-onboarding` is a known router skill.
- `rig/spawn-guard-allowlist.json` — three allowlisted call sites moved with
  their skill directories. The debt count is unchanged at 22.

No Path B assertion was weakened to achieve any of this.

## Known-red at the end of this slice

`npm test` has 48 failures: 46 are the Path B slices 2–7 oracle tests, which are
the next tasks' work. Two are pre-existing and unrelated — the OpenClaw MCP
opt-in test and the pandas CSV benchmark both fail identically on the untouched
base commit `5694fd7b` in this environment.
