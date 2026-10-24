# Acceptance coverage — every proving test

Source: `node --test --test-reporter=tap tests/ai-sdlc/*.test.js`, run on this branch (HEAD `0256c663`, uncommitted). **88 tests, 85 pass, 3 fail, 0 skipped, 0 cancelled.** 84 contract tests (PT-001..PT-084, each present exactly once) plus 4 extra signing cases (PT-015b..e).

Failures, exact names:

- `PT-017 a real sk-ssh-ed25519@openssh.com key signs and verifies with the existing path`
- `PT-068 offline install completes a meaning-based memory query from shipped assets`
- `PT-077 a clean real-download install finds the pinned model, tokenizer and runtime without a first-run download`

All three fail by design through the signed harness `environmentBound()`, which throws; this lane never simulates hardware or a download. They are open evidence, not defects. E2E-J01..J20: no runnable E2E test file exists (plan 17 names `tests/ai-sdlc-journeys.test.js`; it does not exist). Journeys are covered only through the PT tests that cite them.

| PT | Requirement / AC | Fixture | Test file | Satisfied by | WP | State |
|---|---|---|---|---|---|---|
| PT-001 | R001 / AC-001 | F01 | `install.test.js` | public-install.js | WP04/WP10 | pass |
| PT-002 | R002 / AC-002 | F02 | `onboarding.test.js` | onboarding.js | WP04 | pass |
| PT-003 | R003 / AC-003 | F02 | `onboarding.test.js` | onboarding.js | WP04 | pass |
| PT-004 | R004 / AC-004 | F02 | `onboarding.test.js` | onboarding.js | WP04 | pass |
| PT-005 | R005 / AC-005 | F03 | `onboarding.test.js` | onboarding.js | WP04 | pass |
| PT-006 | R006 / AC-006 | F04 | `discovery.test.js` | discovery.js | WP01 | pass |
| PT-007 | R007 / AC-007 | F04 | `discovery.test.js` | discovery.js | WP01 | pass |
| PT-008 | R008 / AC-008 | F05 | `discovery.test.js` | discovery.js | WP01 | pass |
| PT-009 | R009 / AC-009 | F06 | `traceability.test.js` | check-traceability.js (signed, shipped before implementation) | WP01 | pass |
| PT-010 | R010 / AC-010 | F06 | `traceability.test.js` | check-traceability.js (signed, shipped before implementation) | WP01 | pass |
| PT-011 | R011 / AC-011 | F06 | `traceability.test.js` | check-traceability.js (signed, shipped before implementation) | WP01 | pass |
| PT-012 | R012 / AC-012 | F06 | `traceability.test.js` | check-traceability.js (signed, shipped before implementation) | WP01 | pass |
| PT-013 | R013 / AC-013 | F06 | `traceability.test.js` | check-traceability.js (signed, shipped before implementation) | WP01 | pass |
| PT-014 | R014 / AC-014 | F06 | `traceability.test.js` | check-traceability.js (signed, shipped before implementation) | WP01 | pass |
| PT-015 | R015 / AC-015 | F07 | `oracle.test.js` | scripts/approve-gate1.js (existing signer, extended in Gate 1 preparation) | WP01 | pass |
| PT-016 | R016 / AC-016 | F07 | `oracle.test.js` | scripts/approve-gate1.js (existing signer, extended in Gate 1 preparation) | WP01 | pass |
| PT-017 | R017 / AC-017 | F08 | `hardware-signing.test.js` | scripts/approve-gate1.js (existing signer, extended in Gate 1 preparation) | WP01 | FAIL — environment-bound: needs RIG_GATE1_HARDWARE_KEY = a present sk-ssh-ed25519@openssh.com key |
| PT-018 | R018 / AC-018 | F08 | `hardware-signing.test.js` | scripts/approve-gate1.js (existing signer, extended in Gate 1 preparation) | WP01 | pass |
| PT-019 | R019 / AC-019 | F07 | `oracle.test.js` | scripts/approve-gate1.js (existing signer, extended in Gate 1 preparation) | WP01 | pass |
| PT-020 | R020 / AC-020 | F09 | `design.test.js` | design-audit.js | WP01 | pass |
| PT-021 | R021 / AC-021 | F09 | `design.test.js` | design-audit.js | WP01 | pass |
| PT-022 | R022 / AC-022 | F09 | `design.test.js` | design-audit.js | WP01 | pass |
| PT-023 | R023 / AC-023 | F10 | `work-packages.test.js` | work-packages.js | WP01 | pass |
| PT-024 | R024 / AC-024 | F11 | `preflight.test.js` | preflight.js | WP02 | pass |
| PT-025 | R025 / AC-025 | F12 | `routing.test.js` | model-routing.js | WP05 | pass |
| PT-026 | R026 / AC-026 | F12 | `routing.test.js` | model-routing.js | WP05 | pass |
| PT-027 | R027 / AC-027 | F12 | `routing.test.js` | model-routing.js | WP05 | pass |
| PT-028 | R028 / AC-028 | F13 | `workers.test.js` | workers.js | WP05/WP06 | pass |
| PT-029 | R029 / AC-029 | F14 | `workers.test.js` | workers.js | WP05/WP06 | pass |
| PT-030 | R030 / AC-030 | F14 | `workers.test.js` | workers.js | WP05/WP06 | pass |
| PT-031 | R031 / AC-031 | F13 | `workers.test.js` | workers.js | WP05/WP06 | pass |
| PT-032 | R032 / AC-032 | F15 | `vertical-journey.test.js` | run-journal.js | WP02 | pass |
| PT-033 | R033 / AC-033 | F15 | `vertical-journey.test.js` | run-journal.js | WP02 | pass |
| PT-034 | R034 / AC-034 | F16 | `review.test.js` | review-loop.js | WP07 | pass |
| PT-035 | R035 / AC-035 | F16 | `review.test.js` | review-loop.js | WP07 | pass |
| PT-036 | R036 / AC-036 | F16 | `review.test.js` | review-loop.js | WP07 | pass |
| PT-037 | R037 / AC-037 | F17 | `vertical-journey.test.js` | run-journal.js | WP02 | pass |
| PT-038 | R038 / AC-038 | F18 | `knowledge.test.js` | knowledge.js | WP08 | pass |
| PT-039 | R039 / AC-039 | F18 | `knowledge.test.js` | knowledge.js | WP08 | pass |
| PT-040 | R040 / AC-040 | F19 | `recovery.test.js` | run-journal.js | WP02 | pass |
| PT-041 | R041 / AC-041 | F19 | `recovery.test.js` | run-journal.js | WP02 | pass |
| PT-042 | R042 / AC-042 | F19 | `recovery.test.js` | run-journal.js | WP02 | pass |
| PT-043 | R043 / AC-043 | F20 | `release.test.js` | release-evidence.js | WP07 | pass |
| PT-044 | R044 / AC-044 | F20 | `release.test.js` | release-evidence.js | WP07 | pass |
| PT-045 | R045 / AC-045 | F20 | `release.test.js` | release-evidence.js | WP07 | pass |
| PT-046 | R046 / AC-046 | F20 | `release.test.js` | release-evidence.js | WP07 | pass |
| PT-047 | R047 / AC-047 | F21 | `memory.test.js` | memory.js + embedding.js | WP03 | pass |
| PT-048 | R048 / AC-048 | F21 | `memory.test.js` | memory.js + embedding.js | WP03 | pass |
| PT-049 | R049 / AC-049 | F22 | `memory.test.js` | memory.js + embedding.js | WP03 | pass |
| PT-050 | R050 / AC-050 | F22 | `memory.test.js` | memory.js + embedding.js | WP03 | pass |
| PT-051 | R051 / AC-051 | F22 | `memory.test.js` | memory.js + embedding.js | WP03 | pass |
| PT-052 | R052 / AC-052 | F22 | `memory.test.js` | memory.js + embedding.js | WP03 | pass |
| PT-053 | R053 / AC-053 | F22 | `memory.test.js` | memory.js + embedding.js | WP03 | pass |
| PT-054 | R054 / AC-054 | F23 | `profile.test.js` | profile.js | WP04 | pass |
| PT-055 | R055 / AC-055 | F23 | `profile.test.js` | profile.js | WP04 | pass |
| PT-056 | R056 / AC-056 | F24 | `trace-retention.test.js` | trace-retention.js | WP08 | pass |
| PT-057 | R057 / AC-057 | F24 | `trace-retention.test.js` | trace-retention.js | WP08 | pass |
| PT-058 | R058 / AC-058 | F24 | `trace-retention.test.js` | trace-retention.js | WP08 | pass |
| PT-059 | R059 / AC-059 | F25 | `learning.test.js` | learning.js | WP09 | pass |
| PT-060 | R060 / AC-060 | F25 | `learning.test.js` | learning.js | WP09 | pass |
| PT-061 | R061 / AC-061 | F25 | `learning.test.js` | learning.js | WP09 | pass |
| PT-062 | R062 / AC-062 | F26 | `learning.test.js` | learning.js | WP09 | pass |
| PT-063 | R063 / AC-063 | F26 | `learning.test.js` | learning.js | WP09 | pass |
| PT-064 | R064 / AC-064 | F26 | `learning.test.js` | learning.js | WP09 | pass |
| PT-065 | R065 / AC-065 | F12 | `routing.test.js` | model-routing.js | WP05 | pass |
| PT-066 | R066 / AC-066 | F27 | `portability.test.js` | portability.js (runJourney) | WP04 | pass |
| PT-067 | R067 / AC-067 | F13 | `workers.test.js` | workers.js | WP05/WP06 | pass |
| PT-068 | R068 / AC-068 | F27 | `portability.test.js` | portability.js (installArchive, inferenceAssets, memoryQuery) + scripts/build-public-archive.js | WP10 | FAIL — environment-bound: needs RIG_PUBLIC_ARCHIVE = a really downloaded public archive |
| PT-069 | R069 / AC-069 | F28 | `upgrade.test.js` | upgrade.js | WP10 | pass |
| PT-070 | R070 / AC-070 | F28 | `upgrade.test.js` | upgrade.js | WP10 | pass |
| PT-071 | R071 / AC-071 | F29 | `public-release.test.js` | release-evidence.js | WP07/WP11 | pass |
| PT-072 | R072 / AC-072 | F29 | `public-release.test.js` | release-evidence.js | WP07/WP11 | pass |
| PT-073 | R073 / AC-073 | F22 | `memory.test.js` | memory.js + embedding.js | WP03 | pass |
| PT-074 | R074 / AC-074 | F22 | `memory.test.js` | memory.js + embedding.js | WP03 | pass |
| PT-075 | R075 / AC-075 | F25 | `learning.test.js` | learning.js | WP09 | pass |
| PT-076 | R076 / AC-076 | F24 | `trace-retention.test.js` | trace-retention.js | WP08 | pass |
| PT-077 | R077 / AC-077 | F27 | `portability.test.js` | portability.js (installArchive, inferenceAssets, memoryQuery) + scripts/build-public-archive.js | WP10 | FAIL — environment-bound: needs RIG_PUBLIC_ARCHIVE = a really downloaded public archive |
| PT-078 | R078 / AC-078 | F22 | `memory.test.js` | memory.js + embedding.js | WP03 | pass |
| PT-079 | R079 / AC-079 | F28 | `upgrade.test.js` | upgrade.js | WP10 | pass |
| PT-080 | R080 / AC-080 | F30 | `efficiency.test.js` | efficiency.js | WP05 | pass |
| PT-081 | R081 / AC-081 | F30 | `efficiency.test.js` | efficiency.js | WP05 | pass |
| PT-082 | R082 / AC-082 | F30 | `efficiency.test.js` | efficiency.js | WP05 | pass |
| PT-083 | R083 / AC-083 | F30 | `efficiency.test.js` | efficiency.js | WP05 | pass |
| PT-084 | R084 / AC-084 | F30 | `efficiency.test.js` | efficiency.js | WP05 | pass |
| PT-015b | (extra, ties to R015/R016) | F07 | `oracle.test.js` | scripts/approve-gate1.js | WP01 | pass |
| PT-015c | (extra, ties to R015/R016) | F07 | `oracle.test.js` | scripts/approve-gate1.js | WP01 | pass |
| PT-015d | (extra, ties to R015/R016) | F07 | `oracle.test.js` | scripts/approve-gate1.js | WP01 | pass |
| PT-015e | (extra, ties to R015/R016) | F07 | `oracle.test.js` | scripts/approve-gate1.js | WP01 | pass |

## Per-file totals

| Test file | Tests | Pass | Fail |
|---|---|---|---|
| `design.test.js` | 3 | 3 | 0 |
| `discovery.test.js` | 3 | 3 | 0 |
| `efficiency.test.js` | 5 | 5 | 0 |
| `hardware-signing.test.js` | 2 | 1 | 1 |
| `install.test.js` | 1 | 1 | 0 |
| `knowledge.test.js` | 2 | 2 | 0 |
| `learning.test.js` | 7 | 7 | 0 |
| `memory.test.js` | 10 | 10 | 0 |
| `onboarding.test.js` | 4 | 4 | 0 |
| `oracle.test.js` | 7 | 7 | 0 |
| `portability.test.js` | 3 | 1 | 2 |
| `preflight.test.js` | 1 | 1 | 0 |
| `profile.test.js` | 2 | 2 | 0 |
| `public-release.test.js` | 2 | 2 | 0 |
| `recovery.test.js` | 3 | 3 | 0 |
| `release.test.js` | 4 | 4 | 0 |
| `review.test.js` | 3 | 3 | 0 |
| `routing.test.js` | 4 | 4 | 0 |
| `trace-retention.test.js` | 4 | 4 | 0 |
| `traceability.test.js` | 6 | 6 | 0 |
| `upgrade.test.js` | 3 | 3 | 0 |
| `vertical-journey.test.js` | 3 | 3 | 0 |
| `work-packages.test.js` | 1 | 1 | 0 |
| `workers.test.js` | 5 | 5 | 0 |

## What "pass" does not prove

| Criterion | Limit |
|---|---|
| AC-068, AC-077 | Pass only with `RIG_PUBLIC_ARCHIVE`; with a locally built archive they pass, which is not a real download. A default `rig/bootstrap.sh` install does not lay down the semantic assets (see README). |
| AC-046 | `publish()` checks a non-empty `signed_by` name, not the Gate 1 key. |
| AC-041 | Idempotent for completed effects; at-least-once across a crash inside one effect. |
| AC-082 | Baseline is ten fixed offline replay fixtures, not measured production runs. |
| AC-044, AC-045 | Exercised against recorded evidence rows in a fixture repository, not against live CI. |
