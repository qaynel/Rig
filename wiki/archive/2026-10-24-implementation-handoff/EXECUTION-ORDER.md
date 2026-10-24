# Execution order

## Planned dependency order (plan 19)

| Order | Package | Depends on |
|---|---|---|
| 1 | WP01 Signed contract path | owner approval |
| 2 | WP02 First complete task | WP01 |
| 3 | WP03 Active and scoped memory | WP02 |
| 4 | WP04 Portable preferences and onboarding | WP03 |
| 4 | WP05 Bounded routing and delegation | WP02, WP03 |
| 5 | WP06 Safe parallel work | WP05 |
| 5 | WP07 Verification and release evidence | WP02, then WP05-WP06 |
| 5 | WP08 Knowledge and recovery | WP02, WP03 |
| 6 | WP09 Bounded improvement | WP03, WP07, WP08 |
| 7 | WP10 Public install and upgrade | WP01-WP09 stable |
| 8 | WP11 Public release candidate and QA | all |

## What actually ran (trace plus file times)

| Phase | Packages | Mode | Basis |
|---|---|---|---|
| 0 | WP01 contract path: graph, validator, signer extension, signature | Done before implementation | Signed inputs last written 11:57:50; `ai-sdlc.sig` 12:11:42 |
| 1 | Baseline lane (14/88) and gate-impact probe | Serial | Trace |
| 2 | S1 WP01 modules; S2 WP02; S4 WP04 and the WP10 install pieces; S5 WP05/WP06; S6 WP07; S7 WP08/WP09 | **Parallel**, six section leads, one worker per module | Trace; fifteen module files were last written between 12:26:20 and 12:29:05 (below) |
| 3 | WP03 memory and embedding, then `upgrade.js` | Serial, coordinator | 12:30:11 to 12:32:42 |
| 4 | Integration repairs: `run-journal.js` (PT-037 repair), archive build script, `portability.js` archive path | Serial, coordinator | 12:34:45 to 12:35:52; `portability.js` was still being edited while this package was written |
| 5 | WP11 verification sweep: lane, gate | Serial | This package |

## Deviation from the plan, and why it was safe

Plan 19 puts WP04-WP09 after WP02/WP03. In the build they ran beside them. That is sound only because (verified by `grep require`) no WP04-WP09 module imports another capability module: the only cross-module imports are `memory <- embedding`, `upgrade <- memory, embedding`, `portability <- embedding.tokenize`. Dependencies were enforced at integration, by running the whole lane after every module existed, not by build order.

## Module last-modified times (this machine, local time, 24 Oct 2026)

Last write, not creation; a later time can mean a repair.

| File | Last modified |
|---|---|
| `rig/catalog/baseline/work-packages.js` | 12:26:20 |
| `rig/catalog/baseline/design-audit.js` | 12:26:30 |
| `rig/catalog/baseline/discovery.js` | 12:26:38 |
| `rig/catalog/baseline/model-routing.js` | 12:27:01 |
| `rig/catalog/baseline/workers.js` | 12:27:07 |
| `rig/catalog/baseline/public-install.js` | 12:27:09 |
| `rig/catalog/baseline/profile.js` | 12:27:10 |
| `rig/catalog/baseline/preflight.js` | 12:27:14 |
| `rig/catalog/baseline/efficiency.js` | 12:27:31 |
| `rig/catalog/baseline/knowledge.js` | 12:27:54 |
| `rig/catalog/baseline/learning.js` | 12:28:02 |
| `rig/catalog/baseline/review-loop.js` | 12:28:27 |
| `rig/catalog/baseline/onboarding.js` | 12:28:32 |
| `rig/catalog/baseline/release-evidence.js` | 12:28:56 |
| `rig/catalog/baseline/trace-retention.js` | 12:29:05 |
| `rig/catalog/baseline/embedding.js` | 12:30:11 |
| `rig/catalog/baseline/upgrade.js` | 12:32:42 |
| `scripts/build-public-archive.js` | 12:35:28 |
| `rig/catalog/baseline/portability.js` | 12:35:52 |
| `rig/catalog/baseline/memory.js` | 12:38:10 |
| `rig/catalog/baseline/run-journal.js` | 12:41:26 |

## Parallelisable now

All remaining items touch different owners: PT-017 (device), real archive and CI job, notice file, plan-doc corrections, independent review. None shares a file.
