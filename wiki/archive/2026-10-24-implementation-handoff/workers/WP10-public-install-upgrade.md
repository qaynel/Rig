# WP10 — Public install and upgrade

Status: implemented; 2 of 11 proving tests fail in the lane, all environment-bound: PT-068, PT-077.

## User-visible objective

A new user installs from a downloaded archive with no network, no account and no first-run download; upgrades keep user bytes and rebuild incompatible vectors; docs and removal work.

## Exact signed requirement, criterion and proving-test IDs

11 requirements: R001, R002, R003, R004, R005, R066, R068, R069, R070, R077, R079. Obligation text: `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`; fixtures: `16-test-manifest.md`. Same-numbered AC and PT (R047 = AC-047 = PT-047).

| Requirement | Criterion | Proving test | Fixture | Test file | Satisfied by | Lane state |
|---|---|---|---|---|---|---|
| R001 | AC-001: fresh install exposes one canonical corpus and leaves project choices pending. | PT-001 | F01 | `install.test.js` | public-install.js [WP04/WP10] | pass |
| R002 | AC-002: proposal cites observed conventions. | PT-002 | F02 | `onboarding.test.js` | onboarding.js [WP04] | pass |
| R003 | AC-003: an installed review skill yields one effective review owner. | PT-003 | F02 | `onboarding.test.js` | onboarding.js [WP04] | pass |
| R004 | AC-004: changed proposal bytes cannot be applied. | PT-004 | F02 | `onboarding.test.js` | onboarding.js [WP04] | pass |
| R005 | AC-005: no unavailable integration is marked complete. | PT-005 | F03 | `onboarding.test.js` | onboarding.js [WP04] | pass |
| R066 | AC-066: two supported host entrypoints run the same contract journey. | PT-066 | F27 | `portability.test.js` | portability.js [WP04] | pass |
| R068 | AC-068: offline install completes a meaning-based memory query from shipped assets. | PT-068 | F27 | `portability.test.js` | portability.js [WP10] | FAIL (environment-bound) |
| R069 | AC-069: prior supported state migrates or stops with a repair report. | PT-069 | F28 | `upgrade.test.js` | upgrade.js [WP10] | pass |
| R070 | AC-070: a cold user follows docs through install, first task, troubleshooting and removal. | PT-070 | F28 | `upgrade.test.js` | upgrade.js [WP10] | pass |
| R077 | AC-077: a clean real-download install finds the pinned model, tokenizer and runtime without a first-run download. | PT-077 | F27 | `portability.test.js` | portability.js [WP10] | FAIL (environment-bound) |
| R079 | AC-079: an upgraded index returns cited results without mixing incompatible vectors. | PT-079 | F28 | `upgrade.test.js` | upgrade.js [WP10] | pass |

## Dependencies and prerequisites

WP01-WP09 stable. Coordinator-owned for `upgrade.js`, `portability.js` archive path and `scripts/build-public-archive.js`. R001-R005, R066 are also in WP04 (modules: `public-install.js`, `onboarding.js`, `portability.js` runJourney).

## Exclusive file ownership

- `rig/catalog/baseline/upgrade.js`
- `rig/catalog/baseline/portability.js` (installArchive, inferenceAssets, memoryQuery, supportedPlatforms)
- `scripts/build-public-archive.js`
- `rig/catalog/baseline/assets/potion-base-2m/` (shared with WP03)

Archive build writes `.context/dist/rig-public-<version>.tar.gz` (gitignored) with `rig-archive.json` (sha256 per file, platforms darwin/linux/win32). Install writes `.rig/inference/potion-base-2m/{model.json,embeddings.i8,vocab.txt,embedding.js}` and `.rig/inference/manifest.json`.

Never edited by any package: `tests/ai-sdlc/**`, `wiki/gate1/**`, `15-gate1-contract.md`, `16-test-manifest.md`, `17-customer-lifecycle.md`.

## Explicit out-of-scope work

- Hidden manual setup or a first-run download.
- Publishing the archive (nothing is pushed or released).
- Executing archive code: `installArchive` reads bytes only and never `require`s the archive's own `payload.js` or `embedding.js`; `memoryQuery` runs this checkout's tokenizer over the installed, digest-verified weights.
- PT-068/PT-077 stay failing in the lane until `RIG_PUBLIC_ARCHIVE` names a really downloaded archive.

## Existing Rig code and pinned sources reused

- Existing: `rig/bootstrap.sh`, `rig/lib/payload.js`, `rig/lib/tar-read.js` (refuses links), `rig/lib/path-safety.js`, managed graft journal.
- **Inheritance decision (R068, R077, R079): the pure-JS potion-base-2M runtime and assets recorded under WP03.** `model.json` records licence MIT and `downloaded_at_first_run: false` for model, tokenizer and runtime. Its runtime entry has `bytes: 0` and `digest: ""`, so the runtime digest is computed live (`embedding.assets()`) or taken from `rig-archive.json`; it is not pinned in `model.json`.
- No MIT licence text file ships beside the asset; the licence is a field in `model.json` only (see README known gaps).

## Security and trust boundaries

- Every archive file is checked against `rig-archive.json` sha256 before use; a missing or mismatched declared file aborts.
- Extraction paths go through `containedPath`; archive output capped at 1 GiB.
- User-owned bytes are never touched by upgrade; incompatible state gives a repair report; a vector index from another model revision is rebuilt, never mixed (PT-079).

## Focused tests and integration checks

| Check | Command |
|---|---|
| Focused | `node --test --test-reporter=tap tests/ai-sdlc/upgrade.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/portability.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/install.test.js` |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` (current: 88 tests, 85 pass, 3 fail) |
| Graph | `node scripts/check-traceability.js` |
| Signature | `node scripts/approve-gate1.js status --programme ai-sdlc` |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` (repository gate, unaffected by the lane) |

## Required evidence and artifacts

- Lane without the variable: PT-068 and PT-077 fail as environment-bound; PT-069, PT-070, PT-079, PT-066 pass.
- Informational only: with `RIG_PUBLIC_ARCHIVE` pointing at a locally built `.context/dist/rig-public-6.0.0.tar.gz` (sha256 `407f7ccce4c1216b4627e2bca12a5c777f012e480e220566af06289ad079b64c`), portability.test.js passed 3/3. A local build is not a download and is not the acceptance evidence.
- Install transcript, asset digests, migration and removal report from a real downloaded archive: not yet produced.

## Stop conditions and blocker reporting

- A required change falls on a signed file (`tests/ai-sdlc/**`, `wiki/gate1/**`, `15-`, `16-`, `17-`): stop; the owner re-signs, batched. Never edit it.
- A test and its contract row disagree: stop and report the two IDs. (PT-037 was once reported this way and was not a contradiction; see `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md`.)
- The fix needs a file the package does not own: stop and name the file and its owner.
- A criterion is environment-bound and the environment is absent: report the named gap and the variable; do not simulate it.
- The repository gate (`env -u GITHUB_TOKEN -u GH_TOKEN npm test`) goes red on this package's bytes: stop and report the first failing test.

Report format: IDs affected, the file and line, the command run, the exact output, and the one next action. Put it in a dated trace under `wiki/reasoning/` (three-minute cadence applies on long work).

## Branch/worktree arrangement

Single shared worktree `/Users/winmore/conductor/workspaces/rig-v0.1/taipei-v1`, branch `vaibhav-kodiyan/gstack-pasted-text`, HEAD `0256c663`. No per-worker branch or worktree existed; ownership was disjoint by file, so concurrent writers could not collide. All work is uncommitted; nothing is pushed. Do not switch branches, stash or commit unless the owner asks.
