# Integration plan

## How output was integrated

| Stage | Control | Who |
|---|---|---|
| Per module | The module's own signed test file, focused run | Worker, then the section lead reran it independently |
| Per section | Lead verified each worker against the PT list, not the worker's report | S1..S7 leads |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` once all modules existed | Coordinator |
| Cross-module | Only the import edges below exist | Coordinator |
| Repository | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` on integrated bytes | Coordinator |
| Review | Independent, report-only | **Not on record** |

## Import edges and shared state

| Edge | Type |
|---|---|
| `memory.js` -> `embedding.js` | code |
| `upgrade.js` -> `memory.js`, `embedding.js` | code |
| `portability.js` -> `embedding.js` (tokenize), `rig/lib/{payload,host-capabilities,path-safety,tar-read}.js` | code |
| `public-install.js` -> `rig/lib/payload.js` | code |

| Path | Writers | Collision? |
|---|---|---|
| `.rig/memory/records.json`, `index.json` | `memory.js`, rebuilt by `upgrade.js` | Sequential, same semantics |
| `.rig/memory/source-map.json`, `last-upkeep.json` | `trace-retention.js` | Different files in the same directory |
| `.rig/run.json` | the host run driver; read by `run-journal.js` and `efficiency.js` | Readers only in this repo |
| `.rig/history.json` | input to `learning.js` | Read only |
| `.rig/inference/**` | `portability.installArchive` | Single writer |
| `.rig/release/**`, `.rig/review/ledger.json`, `.rig/workers/**`, `.rig/learning/**`, `.rig/efficiency/**` | one module each | None |

## Integrating further output

1. `git status --porcelain`: changes only in the package's owned files.
2. Focused test for each requirement the change claims.
3. Whole lane: the failure list must still be exactly the three environment-bound names.
4. `node scripts/approve-gate1.js status --programme ai-sdlc` and `status`: both protected.
5. `node scripts/check-traceability.js`: graph complete.
6. Full repository gate. Do not carry evidence across a code change.
7. Independent reviewer reads the diff and prior findings; the author never certifies.

## Independent verification already applied by this package

Lane rerun, signature status, traceability, asset digests recomputed, default versus `--with-runtime` install probe, local-archive run of `portability.test.js` (see `verification/integration-checklist.md`).
