# WP04 — Portable preferences and onboarding

Status: implemented; 1 of 9 proving tests fail in the lane, all environment-bound: PT-068.

## User-visible objective

A new project learns the developer's portable preferences without importing authority; onboarding proposes the smallest digest-bound graft that reuses what the repository already has and names every missing tool or hook as a gap.

## Exact signed requirement, criterion and proving-test IDs

9 requirements: R001, R002, R003, R004, R005, R054, R055, R066, R068. Obligation text: `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`; fixtures: `16-test-manifest.md`. Same-numbered AC and PT (R047 = AC-047 = PT-047).

| Requirement | Criterion | Proving test | Fixture | Test file | Satisfied by | Lane state |
|---|---|---|---|---|---|---|
| R001 | AC-001: fresh install exposes one canonical corpus and leaves project choices pending. | PT-001 | F01 | `install.test.js` | public-install.js [WP04/WP10] | pass |
| R002 | AC-002: proposal cites observed conventions. | PT-002 | F02 | `onboarding.test.js` | onboarding.js [WP04] | pass |
| R003 | AC-003: an installed review skill yields one effective review owner. | PT-003 | F02 | `onboarding.test.js` | onboarding.js [WP04] | pass |
| R004 | AC-004: changed proposal bytes cannot be applied. | PT-004 | F02 | `onboarding.test.js` | onboarding.js [WP04] | pass |
| R005 | AC-005: no unavailable integration is marked complete. | PT-005 | F03 | `onboarding.test.js` | onboarding.js [WP04] | pass |
| R054 | AC-054: export contains only portable scoped fields. | PT-054 | F23 | `profile.test.js` | profile.js [WP04] | pass |
| R055 | AC-055: hostile or conflicting import yields applied/conflicted/rejected report. | PT-055 | F23 | `profile.test.js` | profile.js [WP04] | pass |
| R066 | AC-066: two supported host entrypoints run the same contract journey. | PT-066 | F27 | `portability.test.js` | portability.js [WP04] | pass |
| R068 | AC-068: offline install completes a meaning-based memory query from shipped assets. | PT-068 | F27 | `portability.test.js` | portability.js [WP10] | FAIL (environment-bound) |

## Dependencies and prerequisites

WP03 per plan 19. In the build, `profile.js` and `onboarding.js` import no sibling module, so they were written in parallel with WP03. PT-068 depends on WP10 (archive path); PT-001 on `public-install.js`.

## Exclusive file ownership

- `rig/catalog/baseline/profile.js`
- `rig/catalog/baseline/onboarding.js`
- `rig/catalog/baseline/public-install.js`
- `rig/catalog/baseline/portability.js` (runJourney; installArchive/memoryQuery belong to WP10)

Persists `.rig/preferences.json`, `.rig/adaptation.json`, `.rig/host-capabilities.json`, `.rig/skills/<capability>/SKILL.md`, `.rig/journeys/<J>-<host>.json`.

Never edited by any package: `tests/ai-sdlc/**`, `wiki/gate1/**`, `15-gate1-contract.md`, `16-test-manifest.md`, `17-customer-lifecycle.md`.

## Explicit out-of-scope work

- Oracle, secrets or signer material in a profile (rejected by `profile.js`).
- A parallel skill catalogue.
- Per-host framing or host counting (North star 1): `runJourney` takes the host as a parameter of one journey.
- R068 is only proven through the public-archive path (WP10), which is environment-bound.

## Existing Rig code and pinned sources reused

- Existing: `rig/bootstrap.sh`, `rig/lib/payload.js` (`runPayload`), `rig/lib/host-capabilities.js` (`REGISTRY`), `rig/lib/path-safety.js` (`containedPath`), `rig-onboarding` skill, graft journal.
- Pinned sources: Agent Skills specification (Apache-2.0) as a format standard only; no code copied.

## Security and trust boundaries

- `apply()` writes only the exact approved proposal digest and is confined to `<repo>/.rig/`; changed bytes cannot be applied (PT-004).
- `import()` never overwrites a local value: conflicts are reported; every top-level or secret-like field is rejected.
- A host hook Rig does not install is reported `supported`, `unsupported` or `emitted` honestly, never complete (North star 12).

## Focused tests and integration checks

| Check | Command |
|---|---|
| Focused | `node --test --test-reporter=tap tests/ai-sdlc/install.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/onboarding.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/profile.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/portability.test.js` |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` (current: 88 tests, 85 pass, 3 fail) |
| Graph | `node scripts/check-traceability.js` |
| Signature | `node scripts/approve-gate1.js status --programme ai-sdlc` |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` (repository gate, unaffected by the lane) |

## Required evidence and artifacts

- Lane: install 1/1, onboarding 4/4, profile 2/2, PT-066 passing; PT-068 environment-bound (see WP10).
- Exported profile bytes (field list) and the applied/conflicted/rejected report from the hostile-import fixture.

## Stop conditions and blocker reporting

- A required change falls on a signed file (`tests/ai-sdlc/**`, `wiki/gate1/**`, `15-`, `16-`, `17-`): stop; the owner re-signs, batched. Never edit it.
- A test and its contract row disagree: stop and report the two IDs. (PT-037 was once reported this way and was not a contradiction; see `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md`.)
- The fix needs a file the package does not own: stop and name the file and its owner.
- A criterion is environment-bound and the environment is absent: report the named gap and the variable; do not simulate it.
- The repository gate (`env -u GITHUB_TOKEN -u GH_TOKEN npm test`) goes red on this package's bytes: stop and report the first failing test.

Report format: IDs affected, the file and line, the command run, the exact output, and the one next action. Put it in a dated trace under `wiki/reasoning/` (three-minute cadence applies on long work).

## Branch/worktree arrangement

Single shared worktree `/Users/winmore/conductor/workspaces/rig-v0.1/taipei-v1`, branch `vaibhav-kodiyan/gstack-pasted-text`, HEAD `0256c663`. No per-worker branch or worktree existed; ownership was disjoint by file, so concurrent writers could not collide. All work is uncommitted; nothing is pushed. Do not switch branches, stash or commit unless the owner asks.
