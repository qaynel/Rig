# Rig AI-SDLC implementation handoff

Record of work already done on branch `vaibhav-kodiyan/gstack-pasted-text` (HEAD `0256c663`). Every file under `rig/catalog/baseline/` listed below, `scripts/build-public-archive.js`, `scripts/check-traceability.js` and `tests/ai-sdlc/` is uncommitted. Nothing is pushed, published or released. This package changes no other file.

## Signature state (verified on this branch)

| Item | Value |
|---|---|
| `node scripts/approve-gate1.js status --programme ai-sdlc` | `ai-sdlc contract protected: principal=gate1-owner` |
| `node scripts/approve-gate1.js status` | `Gate 1 protected: principal=gate1-owner fingerprint=SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`; `Oracle verified: 16 files, 95 acceptance cases` (the 6.0.0 oracle, untouched) |
| Programme signature | `wiki/gate1/ai-sdlc/ai-sdlc.sig` over `rig-ai-sdlc-freeze-v1` + `contract.manifest 7b521ba3d4e8d335897bc47dcb8ce4f4f86b34621489d53123b48f3ab452bf06` |
| Protected set | 30 files in `wiki/gate1/ai-sdlc/contract.manifest`: specs 15, 16, 17; `check-traceability.js`; `tests/traceability-invariant.test.js`; `tests/ai-sdlc/_harness.js` + 24 test files |
| Graph | `node scripts/check-traceability.js`: 84 requirements, 84 primary criteria, 84 proving tests, 30 fixtures, 20 journeys, 11 packages — graph complete |
| Trust root | One key (North star 13). Hardware-key signing (R017) is unverified: PT-017 needs a device |

The signed modules are **not** the capability modules. The 19 capability modules and `embedding.js` are unsigned, editable, and verified by the signed tests.

## Current numbers

| Check | Result |
|---|---|
| `RIG_PUBLIC_ARCHIVE=<built archive> node --test tests/ai-sdlc/*.test.js` | **88 tests, 87 pass, 1 fail**, 0 skipped, 0 cancelled |
| `node --test tests/ai-sdlc/*.test.js` (no archive) | 88 tests, 85 pass, 3 fail |
| `env -u GITHUB_TOKEN -u GH_TOKEN npm test` | exit 0 on the integrated bytes; **re-run in flight** on the final bytes (the `memory.js` attribution and `run-journal.js` hardening edits post-date the exit-0 run). Confirm before relying on it. |
| `tests/traceability-invariant.test.js` (in the repository gate) | 8 of 8 pass |

Failing tests, exact names (all environment-bound, by the signed harness design).
With a built archive on `RIG_PUBLIC_ARCHIVE`, only the first remains:

- `PT-017 a real sk-ssh-ed25519@openssh.com key signs and verifies with the existing path`
- `PT-068 offline install completes a meaning-based memory query from shipped assets` — passes with the archive
- `PT-077 a clean real-download install finds the pinned model, tokenizer and runtime without a first-run download` — passes with the archive, but against a locally built one, so the *real-download* leg is still unproven

Build the archive with `node scripts/build-public-archive.js`; it writes
`.context/dist/rig-public-<version>.tar.gz`, and `.context/` is gitignored.

## What was built

| Module (`rig/catalog/baseline/`) | WP | Persists under `.rig/` or elsewhere | Proving file |
|---|---|---|---|
| `design-audit.js` | 01 | `design-audit.json` | design |
| `discovery.js` | 01 | `discovery/draft.json` | discovery |
| `work-packages.js` | 01 | none (audit result) | work-packages |
| `run-journal.js` | 02 | `run.json`, `journal.json`, `evidence/*.json`, `complete`, `tdd/<pkg>.json` | recovery, vertical-journey |
| `preflight.js` | 02 | none (read-only check) | preflight |
| `memory.js` | 03 | `memory/records.json`, `memory/index.json`; developer store `$RIG_HOME` or `~/.rig` `/memory/records.json` | memory |
| `embedding.js` + `assets/potion-base-2m/` | 03 | none (read-only runtime and 2.2 MB assets) | memory, portability |
| `profile.js` | 04 | `preferences.json` | profile |
| `onboarding.js` | 04 | `adaptation.json`, `host-capabilities.json`, `skills/<cap>/SKILL.md` | onboarding |
| `public-install.js` | 04/10 | corpus via `runPayload` | install |
| `portability.js` | 04/10 | `journeys/<J>-<host>.json`; `inference/**` on archive install | portability |
| `upgrade.js` | 10 | rebuilt `memory/index.json`, repair report | upgrade |
| `model-routing.js` | 05 | `model-routing-log.jsonl`, `spend.json` | routing |
| `efficiency.js` | 05 | `efficiency/*` | efficiency |
| `workers.js` | 05/06 | `workers/leases.json`, `workers/state.json`, `workers/<id>/artifact.json` | workers |
| `release-evidence.js` | 07/11 | `release/*.jsonl`, `release/published/<commit>.json` | release, public-release |
| `review-loop.js` | 07 | `review/ledger.json` | review |
| `knowledge.js` | 08 | `knowledge/closeout.json` | knowledge |
| `trace-retention.js` | 08 | `archive/manifest.json`, `archive/reasoning/*`, `memory/source-map.json`, `memory/last-upkeep.json` | trace-retention |
| `learning.js` | 09 | `learning/*` | learning |

Count: the signed harness resolves 19 capability modules (it resolves 20 with `check-traceability.js`); `embedding.js` is a runtime dependency of `memory`, `upgrade` and `portability`, so 20 new `.js` files exist.

## Open-source inheritance decision (R052, R068, R077, R078)

`minishlab/potion-base-2M`, licence **MIT**, model2vec static distillation of `baai/bge-base-en-v1.5`; int8 per-row quantised; pure-JS wordpiece-and-mean-pool in `embedding.js`; no native binary, no model server, no first-run download. Assets in `rig/catalog/baseline/assets/potion-base-2m/`:

| Asset | Bytes | sha256 (equal in `model.json` and recomputed) |
|---|---|---|
| `embeddings.i8` (model, 29,528 rows x 64 dims) | 2,007,904 | `e08aab892fcc8684fb221ae2ee868a8d2abe513ccdbb3dcb0f9c65ce525a5f98` |
| `vocab.txt` (tokenizer) | 219,690 | `1394523a67ddd404a825428018c0582a6998bcfa044ecbcbf1f4d71adb94c61c` |
| `embedding.js` (runtime) | in `model.json`: `bytes: 0`, `digest: ""` | not pinned in `model.json`; `embedding.assets()` computes it live, `rig-archive.json` records it in an archive |

## Resume cold

1. Read `CLAUDE.md` North star, then `wiki/agent-primer.md`.
2. Run both `status` commands above; both must say protected. If not, stop: a signed byte changed.
3. Run the lane and compare with the numbers here. A different failure list means the branch moved.
4. Read `verification/acceptance-coverage.md`, then the open items below, then the matching `workers/WPxx-*.md`.
5. Edit only unsigned files. Never touch `tests/ai-sdlc/**`, `wiki/gate1/**`, specs 15/16/17.
6. Before any push: `env -u GITHUB_TOKEN -u GH_TOKEN npm test` green on current bytes.

## Open items

| # | Item | Who | Detail |
|---|---|---|---|
| 1 | PT-017 hardware-key run | Owner (device) | Set `RIG_GATE1_HARDWARE_KEY` to a present `sk-ssh-ed25519@openssh.com` key and rerun `hardware-signing.test.js` |
| 2 | PT-068/PT-077 real-download evidence | Coordinator + owner | No workflow builds or publishes the archive (`scripts/build-public-archive.js` is referenced by none). The existing clean-install E2E downloads a GitHub source archive, which has no `rig-archive.json` and would be refused by `installArchive`. See `CI-CD-PLAN.md` |
| 3 | Default install does not lay down semantic search | Owner decision | Verified: `sh rig/bootstrap.sh --target <repo>` installs `.rig/bin/check-traceability.js` but none of the modules or assets. `--with-runtime` installs them under `.rig/runtime/rig/catalog/baseline/`. Only `portability.installArchive` writes `.rig/inference/`. AC-068 says a *default clean install*; the proof path is the archive |
| 4 | R046 authorization | Owner decision | `release-evidence.publish()` accepts any non-empty `authorization.signed_by`; it does not verify the Gate 1 key |
| 5 | Independent report-only review | Separate reviewer | None on record for these bytes |
| 6 | E2E-J01..J20 | Owner (protected set) | No runnable E2E file; adding tests changes the protected set and needs a re-sign |
| 7 | MIT notice for potion-base-2M | Coordinator | Licence is a field in `model.json`; no licence text file ships with the assets |
| 8 | Baseline for R082 | Coordinator | Ten fixed replay fixtures, not measured runs |
| 9 | Commit, push, PR | Owner | Everything is uncommitted |

## Source claims untrue or stale on this branch

| Document | Claim | Reality |
|---|---|---|
| `15-gate1-contract.md` (signed) | "The current signer ... cannot yet sign this separate programme"; "No signature ... has been performed" | Signer selects the programme; `ai-sdlc.sig` exists and verifies. Status column (P/B) predates implementation |
| `16-test-manifest.md` (signed) | "Until that is done, this package is reviewable, not signable"; status proposed | Signed |
| `17-customer-lifecycle.md` (signed) | E2E home `tests/ai-sdlc-journeys.test.js` | File does not exist; no E2E test exists |
| `wiki/specs/ai-sdlc-harness/README.md` | "New implementation remains paused"; "ready to sign" | Implementation executed; contract signed |
| `19-work-packages-and-public-roadmap.md` | WP03 file `tests/ai-sdlc-memory.test.js` | Real file `tests/ai-sdlc/memory.test.js`. Claude-Mem and Hermes ports named for WP03/WP05 were not landed |
| `12-reuse-plan.md` | Transformers.js/MiniLM as the engine candidate; selective source ports of Claude-Mem, Hermes, DeepAgents | potion-base-2M was selected. No port landed: no module carries an upstream notice. Only the Open-Code-Review finding key (in `scripts/review-receipt.js`) is a real adaptation |
| `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md` | "`rig/manifest.json` already projects the whole `rig/catalog/baseline` directory, so new modules install" | Only under `--with-runtime`. A default install gets `check-traceability.js` only |
| Task statement | "19 capability modules" | 19 harness-resolved capabilities plus `embedding.js` = 20 files |

Editing the signed documents is forbidden. Correct the unsigned ones (README, 12, 19) in a normal change; for the signed three, record the correction in the next owner re-sign session.

## Known shortcuts carried in code (`shortcut:` comments, verbatim intent)

`discovery.js` mixed outcome-and-tool clause kept whole; `learning.js` judges on recorded `fails_before`; `release-evidence.js` skips symlinks, walks the whole tree per call, no append lock, name-only authorization; `efficiency.js` zero billable tokens scores 0; `knowledge.js` path/stem staleness; `review-loop.js` diffs whole files; `run-journal.js` at-least-once inside one effect, three symptom classes; `trace-retention.js` fact-level fidelity only; `work-packages.js` no dependency is ever met; `workers.js` no file lock; `portability.js` whole-file hashing.

## Contents

| File | Purpose |
|---|---|
| `COORDINATOR.md` | Protocol followed and current ownership |
| `EXECUTION-ORDER.md` | Dependency order and what ran in parallel |
| `INTEGRATION-PLAN.md` | How output was integrated and checked |
| `CI-CD-PLAN.md` | Why the lane is outside the gate; what promotion needs |
| `workers/WP01..WP11` | Eleven briefs with explicit IDs |
| `verification/acceptance-coverage.md` | Every PT, file and state |
| `verification/integration-checklist.md` | Checks run and results |
| `DEPLOYMENT-TRACKER.md` | **Live state.** Gate results, per-package status, ordered open work, answered owner decisions. Nothing is committed, so this file is the resumable state — update it as work lands |
| `NEXT-AGENT-INSTRUCTIONS.md` | **Start here.** Ordered path from here to deployment-ready, model tiering, failure loop, authorization boundary |
