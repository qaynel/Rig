---
status: implemented
checked: 2026-10-24
owner: rig-product-design
---

# Work packages and road to a public product

This expands the existing [seven-slice plan](06-roadmap.md). The approved
atomic contract and test manifest are prerequisites; the package design is
editable. `AC-xxx` and `PT-xxx` correspond to the `R-xxx` IDs below. Every
package must start by reading those exact signed rows and stop on a conflict.
File ownership is proposed and must be checked against the branch immediately
before worker dispatch. The coordinator chooses actual available host models;
“light” and “strong” name capability, not a vendor or price promise.

## Dependency-aware packages

| Package and user outcome | Contract scope, in/out, reuse and source inheritance | Dependencies, agent and file ownership | Checks, integration and handoff evidence |
|---|---|---|---|
| **WP01 — Signed contract path.** Owner can review one atomic graph and sign it with the existing key. | R006–R024; in: graph audit, manifested test files, owner-reviewed additional oracle selection and order; out: new signer or changing 6.0.0 oracle. Reuse `rig-grilling`, `approve-gate1.js`, existing SSH verifier. Agent Skills format is a standard, not signing code. | First after owner approval of this draft; **strong coordinator** owns `rig/corpus/routing.md`, grilling/design skills, signing manifest selection and contract tests. Exclusive owner of gate-related files. | PT-006–PT-024, F06–F11; mutation audit, real hardware-key lane or reported gap, old oracle regression and exact signature. Handoff: signed IDs, digests, failure cases, changed files. |
| **WP02 — First complete task.** User goes from idea to verified local change and can resume. | R023–R024,R032–R043; in: minimal transition journal/preflight and phase handoff; out: rich memory/model dispatcher. Reuse current TDD, review receipt and wiki trace machinery; adapt Superpowers skill instructions only where Rig lacks a step. | WP01; **strong coordinator** designs journal schema; **light worker** owns isolated run/preflight module and tests, another owns documentation after schema freeze. | PT-023,PT-024,PT-032–PT-043, E2E-J03/J06–J09/J13; kill/restart every transition, current-byte full gate. Handoff: state diagram matched to persisted samples and one cold-resume replay. |
| **WP03 — Active and scoped memory.** Settled answers are recalled within an 8 KB working view. | R047–R053,R073/R074,R078; in: sourced records, UTF-8 projection, offline semantic indexing/query, cited lexical fallback, conflict/forgetting rules and inert recall; out: provider/daemon. Reuse `wiki-query`; Pinned Model2Vec/easy-bert source supplies inference/tokenization; existing Rig byte-capped records and inert citations retain memory policy. See the source ledger for discarded candidate reasons. | WP02 journal; **light worker** owns `.rig` memory/projection module and `tests/ai-sdlc/memory.test.js`; coordinator reviews trust boundary. | PT-047–PT-053,PT-073/PT-074,PT-078, E2E-J16; multibyte cap, paraphrase with no shared content words, conflicts, isolation, injection, network-denied search and corrupt-model fallback. Handoff: source attribution, licence notice, cap bytes and retrieval citations. |
| **WP04 — Portable preferences and onboarding.** New project knows developer preferences without importing authority. | R001–R005,R054–R055,R066,R068; in: validated profile export/import and conflict report; out: project oracle, secrets, signer material. Reuse agent-led onboarding and Agent Skills format; no parallel catalogue. | WP03; **light worker** owns profile schema/adapter and isolated profile tests; onboarding file ownership reserved exclusively to one integrator. | PT-001–PT-005,PT-054–PT-055,PT-066,PT-068, E2E-J01/J02/J17; hostile round trip and old installation regression. Handoff: applied/conflicted/rejected report plus exact exported fields. |
| **WP05 — Bounded routing and delegation.** Routine work uses the least expensive reliable mechanism, and token efficiency is measured end to end. | R025–R031,R065,R067,R080–R084; in: deterministic-first route, host inventory, budget, child allowlist, per-task token/cost/time accounting, the verified-work-over-tokens ratio, a recorded benchmark baseline, the correctness-over-savings guardrail and redundant-call detection; out: provider-specific runtime. Pinned DeepAgents context exclusion and Hermes durable check-and-consume source ports are present; reuse existing run-record and receipt accounting for the token ledger. | WP02 and WP03; **strong coordinator** owns routing and efficiency contract; **light worker** owns bounded fixture adapter and the efficiency instrumentation in non-overlapping files. | PT-025–PT-031,PT-065,PT-067,PT-080–PT-084, F12,F30, E2E-J08/J14; stubbed price/capability inventory, actual/unknown cost, no secret in child, full token/cost/time accounting, ratio ranking, baseline-before-target, rejected guardrail-failing candidate and redundancy signal. Handoff: route log, call counts, escalation reason and recorded efficiency baseline. |
| **WP06 — Safe parallel work.** Independent agents progress without file collision. | R028–R031; in: package dependency graph, reservations/worktree isolation, stale-owner recovery; out: automatic merges of overlapping edits. Reuse host-native subagents and existing isolated-worktree pattern; no agent runtime. | WP05; **strong coordinator** owns graph/integration; **light worker** may own conflict checker and tests after schema. | PT-028–PT-031, E2E-J10; overlap stops before write, disjoint work continues, stale lock needs evidence. Handoff: package DAG, ownership map, conflict replay. |
| **WP07 — Verification and release evidence.** User gets a reliable ship/no-ship report. | R033–R046,R071–R072; in: exact-byte receipt chain, automated health/real-download install, review loop and authorization; out: bypass of 6.0.0 QA closeout. Reuse `npm test`, review receipt, deployment gate and change-management order; Open-Code-Review finding key already adapted locally. | WP02, then WP05–WP06 for routed runs; **strong coordinator** owns release integration, independent reviewer report only. | PT-033–PT-046,PT-071–PT-072, E2E-J09/J11/J12/J15; changed-byte, stale-QA and missing-evidence replays. Handoff: exact candidate digest, tests, review, security, health and install receipts. |
| **WP08 — Knowledge and recovery.** A cold session finds accurate docs, phase and next action. | R038–R042,R056–R058,R076; in: documented-surface check, trace timer, free local upkeep, fidelity-checked hot/warm/cold retention; out: editing immutable trace bodies. Retain the wiki generator/index and free local fidelity checks; discard DeepAgents automatic paid summarization. | WP02 and WP03; **light worker** owns trace index/retention code and tests, another owns docs with no overlapping writes. | PT-038–PT-042,PT-056–PT-058,PT-076, E2E-J12/J13/J18; kill points, source map, zero paid calls, missing-fact rollback, cold lookup. Handoff: before/after fidelity manifest and intact source hashes. |
| **WP09 — Bounded improvement.** A twice-seen mistake or instruction yields a proven prevention or reusable skill. | R059–R064,R075; in: candidate, positive/negative replay, safe local promotion, protected refusal; out: scalar-only optimizer or self-editing guard. Reuse existing finding history; retain actual local executable replay and protected-oracle evidence; discard the Harness² scalar selector and separately licensed runner. | WP03, WP07 and WP08; **strong coordinator** owns authority classification; **light worker** may implement replay fixture and candidate index in isolated files. | PT-059–PT-064,PT-075, E2E-J19; regression, repeated instruction, no-effect, protected path and interrupted promotion. Handoff: two sources, baseline/replay outputs and authority verdict. |
| **WP10 — Public install and upgrade.** A new user installs, upgrades, troubleshoots and removes the product safely. | R001–R005,R066,R068–R070,R077/R079; in: pinned local model/tokenizer/runtime packaging, integrity, versioned vector-index migration, public docs and offline first task; out: hidden manual setup or first-run model download. Reuse bootstrap and managed graft journal. | WP01–WP09 integration stable; **strong coordinator** owns public contract, **light workers** own separate docs and migration-test files. | PT-001–PT-005,PT-066,PT-068–PT-070,PT-077/PT-079, E2E-J01/J20; real downloaded archive, network-denied paraphrase query, asset hashes/licence/size, vPrevious migration, clean uninstall and user-byte preservation. Handoff: archive digest, install transcript, model/index migration and removal report. |
| **WP11 — Public release candidate and QA.** Users can rely on the published artifact. | R043–R046,R071–R072,R077–R079; in: horizontal scenario sweep, offline semantic clean-install proof on every claimed supported environment, independent security/review, exact-commit QA gates and production validation; out: calendar-driven release despite red evidence. Reuse established release SOP and CI. | All prior packages; **strong coordinator** integrates and a separate reviewer judges. No parallel writes to release candidate. | All PT and E2E journeys, full `npm test`, real-download network-denied clean install and meaning-based query, fresh independent review, exact-QA health and production post-release validation. Handoff: immutable candidate/commit IDs and pass/fail receipt set. |

All packages carry the signed requirement and primary criterion IDs listed in
the `R` ranges. Before execution, the coordinator expands ranges into explicit
IDs in each worker brief, records in/out scope and file ownership, and verifies
the worker's output against that list. No worker can edit the oracle. An
unavailable worker facility makes the same package sequential; it is not a
reason to create a second runtime.

## Delivery status — 2026-10-24

Implementation is local, uncommitted and unpublished. The [current tracker](23-deployment-tracker.md) owns live counts, remediation status and owner/external boundaries. The original handoff is [archived](../../archive/2026-10-24-implementation-handoff/README.md); its historical statements do not certify current readiness.

The independent review found eighteen correctness, evidence and data-preservation defects. Repairs and new regression checks are in flight. The [prepared owner amendment](22-oracle-amendment-request.md) records signed assertions that conflict with settled authentication requirements or lack executable replay inputs. No protected test was edited.

Offline semantic assets and the complete capability kit ship for the host agent to choose what to graft. [Source inheritance](12-reuse-plan.md) distinguishes genuine source ports from patterns; the current tracker records checks rather than assuming the planned ports landed. The standalone `node scripts/run-ai-sdlc.js` runs the separate advisory lane without changing signed package scripts.

## Milestones and release boundary

| Milestone | Dependency and scope | Acceptance evidence, integration and exit |
|---|---|---|
| **Current preservation** | Existing code and 6.0.0 QA track stay intact. Record exact branch state and unresolved release checks. | Locally green review work remains preserved and uncommitted; no expansion/release claim. Full `npm test` is required on future candidate bytes before push. |
| **MVP: complete local core** | WP01–WP02 plus minimum WP07 review path. One greenfield and one existing-project task, signed acceptance, editable design, test-first implementation, independent review and cold resume. | E2E-J01/J03/J06–J09/J11/J13 pass locally; exact-byte run report. This is a usable **private core**, not yet a polished public product. |
| **Integrated core** | WP03–WP09. 8 KB active view, offline scoped semantic retrieval, portable profile, cost-aware host delegation, collision safety, knowledge retention and bounded learning. | E2E-J01–J19 pass; signed oracle unchanged; corrupt local assets have cited lexical fallback and a named failed capability; security and source licence audit. |
| **Smallest complete public release** | Integrated core plus WP10–WP11. Public discover/install/onboard/upgrade/removal, packaged local semantic assets, real-download package, docs/troubleshooting, automated CI, independent review, security hardening, exact-candidate QA and post-release checks. | Every PT and E2E-J01–J20 passes on the candidate, including network-denied paraphrase recall on every claimed supported environment; fresh exact-byte evidence, published artifact check and rollback path. This is the first release that may be called the complete product. No date/version is assumed. |
| **Subsequent enhancement** | Only after public evidence and observed need. More host adapters, measured semantic-quality improvements, deeper automatic consolidation and performance optimization. | Each new behavior gets atomic criteria and tests, owner amendment when protected; measured benefit must exceed dependency/privacy/maintenance cost. |

The milestones have no invented duration, dollar estimate or model token
budget. Record actual run cost, read bytes, retries and integration time during
the first vertical task; use those measurements to tune later routing. The
public release exit is evidence-based, not a feature-count or schedule target.

## Coordinator handoff protocol after authorization

1. Verify the owner's **new programme** signature, complete graph audit and
   current code/branch state. Keep 6.0.0 QA closeout on its own evidence chain.
2. Reconcile editable architecture with current code and pinned source pins;
   revise design without changing the oracle.
3. Expand the next package's requirement/criterion/test IDs, dependency edges,
   owned files, budget and exit evidence into a small worker brief.
4. Assign disjoint work to the lowest capable host-native worker. Use isolated
   worktrees for concurrent writes. Retain one coordinator as integrator.
5. Require test output and diff evidence, independently verify it, integrate
   dependency order, and rerun affected and full gates on current bytes.
6. Record phase, candidate digest, remaining blockers and one next action so a
   replacement coordinator can resume without a transcript.
7. Escalate only a changed product contract, protected authorization or
   genuinely unresolved product behavior to the owner. Routine technical
   choices and failed model attempts stay with engineering.
