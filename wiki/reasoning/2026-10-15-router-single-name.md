---
date: 2026-10-15
source: agent
topics: the-overhaul, catalogue-contract
decisions:
status: current
summary: The router now installs under one name, rig-router; the duplicate rig alias is removed so the unsigned AT-PB-3 candidate lists one router.
---
Done: the same router was projected twice on native hosts (`rig-router` and a `rig` alias) plus a second `.rig/skills/rig` copy on instruction-only hosts. Removed the alias in `rig/lib/project.js` and `rig/manifest.json`, pointed the `routing.md` fallback at `rig-router`, and updated the RIG-149 checks, `vendored-skills-install`, the v5-parity fixture, and the unsigned AT-PB-3 candidate (test and patch) to expect nine skills, not ten. Targeted suites pass (bootstrap RIG-149, router hygiene, corpus contract/projection, migrate-v5, vendored install, AT-PB-3 candidate). In flight: full `npm test` not yet run. Next: run it, then sign AT-PB-3 once in the batched session.

Update, same day: the full gate caught two leftovers from the rename. The
RIG-149/RIG-153 acceptance evidence still named the old test title, so
`check-versions` failed on ticket traceability — the three wiki references now
name the live title. The old alias also left orphaned projection output at
`.claude/skills/rig/` and `.agents/skills/rig/`; `project-repo.js --check`
compares only the files the projector emits, so it cannot see an orphan, and
both directories were deleted by hand. The dead `.claude/skills/rig/` prefix
stays in `GENERATED_SKILL_ROOTS` — harmless, and removing it is not this
change's job.
