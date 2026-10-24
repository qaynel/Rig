# CI/CD plan

## Why the lane stays out of the repository gate

| Fact | Verified |
|---|---|
| `package.json` `test:code` runs `node --test tests/*.test.js` | yes |
| `tests/*.test.js` matches direct children only; `ls tests/*.test.js` lists no path containing `ai-sdlc/` | yes |
| (An unrelated 6.0.0 file `tests/ai-sdlc-standards.test.js` is in the gate by name only) | yes |
| No file under `.github/workflows/`, `package.json` or `scripts/` references `tests/ai-sdlc`, `RIG_PUBLIC_ARCHIVE`, `RIG_GATE1_HARDWARE_KEY` or `build-public-archive` | yes (grep) |
| `tests/traceability-invariant.test.js` **is** in the gate (8 tests) and passes; it checks the 84/84/84 graph | yes |
| `rig/lib/baseline-payload.js` ships `check-traceability.js` to every install as `.rig/bin/check-traceability.js` | yes |

North star 21: new acceptance failures must never turn the existing repository CI red. Today the lane has one by-design failure with an archive present (three without), so it cannot be added to the gate as it stands. The ordered plan for closing that is `NEXT-AGENT-INSTRUCTIONS.md` §4 Phase D.

## Run the lane by hand

`node --test tests/ai-sdlc/*.test.js` — expect 88 tests, 85 pass, 3 fail (the three
names in the README). With `RIG_PUBLIC_ARCHIVE` set to an archive built by
`node scripts/build-public-archive.js`, expect 88 tests, 87 pass, 1 fail (PT-017 only).
The directory form `node --test tests/ai-sdlc/` silently reports 1 test; always use the glob.

## What would have to change to promote it

| # | Change | Why | Who |
|---|---|---|---|
| 1 | Resolve PT-017 | `environmentBound()` throws, so the test is red on any machine without a hardware key. Hosted CI can never hold one. Options: run only on the owner's machine, or amend the signed harness to report a named gap instead of throwing | Owner (signed file) |
| 2 | Produce `RIG_PUBLIC_ARCHIVE` in a release job | Build with `scripts/build-public-archive.js` (writes `.context/dist/rig-public-<version>.tar.gz` with `rig-archive.json`), publish, download, export the path. Today no workflow does; the E2E workflow fetches a GitHub source archive, which `installArchive` refuses (no `rig-archive.json`) | Coordinator + owner |
| 3 | Decide default-install scope (README open item 3) | A default `bootstrap.sh` install carries none of the semantic assets | Owner |
| 4 | Add a script and a non-blocking job first | e.g. an `npm run test:ai-sdlc` that runs the lane, in a workflow that does not gate `prod` merges; make it required only once items 1-3 leave it green | Coordinator |
| 5 | Wire the lane into exact-QA-commit promotion | North star 11: automated checks only, on the exact QA commit; health and real-download clean install are already required classes (R044, R045) | Owner decision |
| 6 | Cross-platform | AC-077 requires the claimed platforms (darwin, linux, win32); the E2E workflow has an OS matrix to extend | Coordinator |

## Rollback

Lane files and modules are untracked/additive: removing `rig/catalog/baseline/<module>.js` returns the lane to its preimplementation red and leaves the gate green (verified by the wave-1 probe).
