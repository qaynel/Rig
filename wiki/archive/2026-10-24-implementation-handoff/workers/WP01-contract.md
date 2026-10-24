# WP01 — Signed contract path

Status: implemented; 1 of 19 proving tests fail in the lane, all environment-bound: PT-017.

## User-visible objective

The owner reviews one atomic requirement/criterion/test graph and signs it once with the existing Gate 1 key. Design, discovery and package planning follow the signed oracle and are audited deterministically.

## Exact signed requirement, criterion and proving-test IDs

19 requirements: R006, R007, R008, R009, R010, R011, R012, R013, R014, R015, R016, R017, R018, R019, R020, R021, R022, R023, R024. Obligation text: `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`; fixtures: `16-test-manifest.md`. Same-numbered AC and PT (R047 = AC-047 = PT-047).

| Requirement | Criterion | Proving test | Fixture | Test file | Satisfied by | Lane state |
|---|---|---|---|---|---|---|
| R006 | AC-006: requirement draft links to the originating utterance. | PT-006 | F04 | `discovery.test.js` | discovery.js [WP01] | pass |
| R007 | AC-007: requirement draft has no unapproved design mandate. | PT-007 | F04 | `discovery.test.js` | discovery.js [WP01] | pass |
| R008 | AC-008: settled answers are not re-asked and material ambiguity is surfaced. | PT-008 | F05 | `discovery.test.js` | discovery.js [WP01] | pass |
| R009 | AC-009: compound obligations are split and IDs are unique. | PT-009 | F06 | `traceability.test.js` | check-traceability.js [WP01] | pass |
| R010 | AC-010: no requirement or primary criterion is orphaned or duplicated. | PT-010 | F06 | `traceability.test.js` | check-traceability.js [WP01] | pass |
| R011 | AC-011: each criterion resolves to a unique runnable test obligation. | PT-011 | F06 | `traceability.test.js` | check-traceability.js [WP01] | pass |
| R012 | AC-012: a journey without both mappings fails the contract audit. | PT-012 | F06 | `traceability.test.js` | check-traceability.js [WP01] | pass |
| R013 | AC-013: orphan work packages fail planning preflight. | PT-013 | F06 | `traceability.test.js` | check-traceability.js [WP01] | pass |
| R014 | AC-014: changed requirement bytes invalidate the prior mapping result. | PT-014 | F06 | `traceability.test.js` | check-traceability.js [WP01] | pass |
| R015 | AC-015: all three exact digests verify before design can begin. | PT-015 | F07 | `oracle.test.js` | scripts/approve-gate1.js [WP01] | pass |
| R016 | AC-016: altered protected bytes fail verification and require owner re-sign. | PT-016 | F07 | `oracle.test.js` | scripts/approve-gate1.js [WP01] | pass |
| R017 | AC-017: a real `sk-ssh-ed25519@openssh.com` key signs and verifies with the existing path. | PT-017 | F08 | `hardware-signing.test.js` | scripts/approve-gate1.js [WP01] | FAIL (environment-bound) |
| R018 | AC-018: absent key never causes agent approval or a second signer. | PT-018 | F08 | `hardware-signing.test.js` | scripts/approve-gate1.js [WP01] | pass |
| R019 | AC-019: design revision preserves the oracle signature and receives a new design digest. | PT-019 | F07 | `oracle.test.js` | scripts/approve-gate1.js [WP01] | pass |
| R020 | AC-020: reviewer can trace each proposed component to current code and signed behavior. | PT-020 | F09 | `design.test.js` | design-audit.js [WP01] | pass |
| R021 | AC-021: an adopted component without an immutable source pin fails design review. | PT-021 | F09 | `design.test.js` | design-audit.js [WP01] | pass |
| R022 | AC-022: licence or bundled-runtime ambiguity blocks adoption. | PT-022 | F09 | `design.test.js` | design-audit.js [WP01] | pass |
| R023 | AC-023: each package has outcome, ownership, dependency and exit evidence. | PT-023 | F10 | `work-packages.test.js` | work-packages.js [WP01] | pass |
| R024 | AC-024: missing inputs stop the transition with a precise gap. | PT-024 | F11 | `preflight.test.js` | preflight.js [WP02] | pass |

Extra signed cases in the same lane, not tied to a separate R: PT-015b, PT-015c, PT-015d, PT-015e (`oracle.test.js`), all passing.

## Dependencies and prerequisites

First. Needs only the owner-approved contract (already signed). No code dependency on any other package. Note: R023 and R024 are shared with WP02; PT-023 is satisfied here (`work-packages.js`), PT-024 in WP02 (`preflight.js`).

## Exclusive file ownership

- `rig/catalog/baseline/design-audit.js`
- `rig/catalog/baseline/discovery.js`
- `rig/catalog/baseline/work-packages.js`

Read-only, already done and signed or frozen: `rig/catalog/baseline/check-traceability.js` and its entrypoint `scripts/check-traceability.js`; `scripts/approve-gate1.js` (programme selection added in Gate 1 preparation; not part of the 30 signed files).

Never edited by any package: `tests/ai-sdlc/**`, `wiki/gate1/**`, `15-gate1-contract.md`, `16-test-manifest.md`, `17-customer-lifecycle.md`.

## Explicit out-of-scope work

- A new signer or any change to the signed 6.0.0 oracle (16 files, 95 cases).
- A second key, policy-signer, TOFU fallback or `.rig/allowed-signers` (North star 13).
- Hardware-key evidence (PT-017) is an owner-device action, not code.
- Known shortcuts carried: `discovery.js` keeps a clause that mixes an outcome with a tool mention whole as a suggestion; `work-packages.js` treats no dependency as met because nothing records package completion yet.

## Existing Rig code and pinned sources reused

- Existing: `rig-grilling` and `rig-product-design` skills, `scripts/approve-gate1.js` (`ssh-keygen -Y` sign/verify, namespace `rig-gate1`, principal `gate1-owner`), `check-traceability.js`.
- Pinned sources: none adopted as code. `design-audit.js` is the gate that refuses an adopted component without an immutable revision pin or with a licence outside MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, MPL-2.0; Apache-2.0 rows must carry a notice.

## Security and trust boundaries

- One trust root: only the Gate 1 key signs the programme; a signature for one programme does not verify for the other (PT-015b..e).
- Signed bytes are changed only by the owner.
- `discovery.js` and `design-audit.js` only read repository text; their sole writes are `.rig/discovery/draft.json` and `.rig/design-audit.json`.

## Focused tests and integration checks

| Check | Command |
|---|---|
| Focused | `node --test --test-reporter=tap tests/ai-sdlc/oracle.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/traceability.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/discovery.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/design.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/work-packages.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/hardware-signing.test.js` |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` (current: 88 tests, 85 pass, 3 fail) |
| Graph | `node scripts/check-traceability.js` |
| Signature | `node scripts/approve-gate1.js status --programme ai-sdlc` |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` (repository gate, unaffected by the lane) |

## Required evidence and artifacts

- `node scripts/approve-gate1.js status --programme ai-sdlc` -> `ai-sdlc contract protected: principal=gate1-owner`.
- `node scripts/check-traceability.js` -> graph complete line (84/84/84, 30 fixtures, 20 journeys, 11 packages).
- Lane output for the six files above; PT-017 reported as the one environment-bound gap.
- Persisted: `.rig/discovery/draft.json`, `.rig/design-audit.json`.

## Stop conditions and blocker reporting

- A required change falls on a signed file (`tests/ai-sdlc/**`, `wiki/gate1/**`, `15-`, `16-`, `17-`): stop; the owner re-signs, batched. Never edit it.
- A test and its contract row disagree: stop and report the two IDs. (PT-037 was once reported this way and was not a contradiction; see `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md`.)
- The fix needs a file the package does not own: stop and name the file and its owner.
- A criterion is environment-bound and the environment is absent: report the named gap and the variable; do not simulate it.
- The repository gate (`env -u GITHUB_TOKEN -u GH_TOKEN npm test`) goes red on this package's bytes: stop and report the first failing test.

Report format: IDs affected, the file and line, the command run, the exact output, and the one next action. Put it in a dated trace under `wiki/reasoning/` (three-minute cadence applies on long work).

## Branch/worktree arrangement

Single shared worktree `/Users/winmore/conductor/workspaces/rig-v0.1/taipei-v1`, branch `vaibhav-kodiyan/gstack-pasted-text`, HEAD `0256c663`. No per-worker branch or worktree existed; ownership was disjoint by file, so concurrent writers could not collide. All work is uncommitted; nothing is pushed. Do not switch branches, stash or commit unless the owner asks.
