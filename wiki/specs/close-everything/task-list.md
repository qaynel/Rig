# Rig 6.0.0 — task list

**Derived from:** [statement of work](statement-of-work.md) scope table (one
section per work package) and the [specification sheet](specification-sheet.md).
**Procedure:** [Delivery SOP](../../../rig/corpus/standards/delivery-sop.md).
**Executor prompt:** [agent-prompt.md](agent-prompt.md).
**Baseline verified:** 2026-10-14 against the working tree on branch
`vaibhav-kodiyan/universal-issues-closure` (HEAD `f36e0503` plus uncommitted
work) by running each focused test file. Ticks below are backed by a passing
run or a committed fix, not by transcript claims.

## How to read and use this list

- `[x]` done and verified. `[ ]` open. `[ ] 🔒` owner-only: the agent never does
  it, it prepares the input and stops (signing, applying protected-file
  amendments, GitHub writes, push/PR/tag/promote).
- Every task has **Accept** (observable pass condition) and **Prove** (the exact
  command). A box is ticked only after Prove is run and passes, and the command
  plus its result line is written in the trace. See SOP §Tick rule.
- Do tasks in order inside a work package; work packages follow SOW §Delivery
  sequence. WP = SOW work package.
- Never edit anything listed in `wiki/gate1/testing-infrastructure.manifest`
  (frozen tests, `tests/helpers/advanced.js`, `tests/helpers/path-b.js`,
  `scripts/check-advanced-spec.js`, `wiki/gate1/package-scripts.json`). When a
  frozen case must change, write a candidate under
  `wiki/specs/close-everything/candidate-amendments/` and tick only the
  "candidate filed" box. The owner applies it (WP10).
- Do not edit `rig/catalog.json` or `rig/catalog/**` (pinned by frozen
  AT-PB-1). The new authored catalogue lives only in `rig/corpus/`.

## Reds that exist right now (fix list for WP3/WP4/WP8)

| Test file | Fails | Cause | Owning task |
|---|---|---|---|
| `tests/corpus-projection.test.js` | 52 | v5-golden byte comparison no longer matches: vendored shelf and catalogue left the default install (fetched at onboarding now). Intended differences are not enumerated yet. | T-3.7 |
| `tests/corpus-contract.test.js` | 3 | `rig/corpus/services/**` files are byte-identical copies of the pinned `rig/catalog/services/**` (798 of them still carry the "generic baseline" boilerplate); also a live file points at a retired path. | T-4.5, T-3.8 |
| `tests/migrate-v5.test.js` | 2 | real-v5 migration round trip and uninstall inventory differ after the shelf/catalogue move. | T-3.7 |
| `tests/mcp-one-table.test.js` | 1 | "dead second reader is gone" assertion regressed (`host-capabilities.js` edited). | T-3.9 |
| `tests/rig-bootstrap.test.js` | 2 | `--with-runtime` does not land `.rig/runtime/rig/lib/ai-sdlc.js` (and its sibling new libs); explicit-host bootstrap case. | T-3.10 |
| `tests/path-b-catalog.test.js` | 1 | frozen AT-PB-3 expects 55 vendored skills at install; owner decision is fetch-at-onboarding. Needs a candidate amendment, not a code fix. | T-3.11 |
| `tests/spawn-guard-allowlist.test.js` | 1 | "spawn-guard debt: 24 site(s)" — new/moved code has unlisted direct-kill sites. | T-2.8 |
| `tests/wiki-budget.test.js` | 1 | committed wiki exceeds a budget (new traces/specs). | T-8.6 |
| `node scripts/check-coherence.js` | red | correct signal: reports the corpus↔legacy duplicate files above. | T-4.5 |

---

## WP1 — Reconcile the backlog (subplan 01)

- [x] T-1.1 Redesign backlog page lists exactly RIG-116, 122, 130, 133, 156.
  Accept: `wiki/specs/redesign-backlog.md` exists and lists those five.
- [x] T-1.2 Board (`wiki/Tickets.md`) and ticket files reconciled to code reality
  locally. Prove: `node --test tests/ticket-traceability.test.js` (6 pass).
- [x] T-1.3 Declared candidate transitions written
  (`wiki/specs/close-everything/tracker-transitions.json`).
- [x] T-1.4 GitHub command lists prepared, none run
  (`github-actions-pending.md`).
- [x] T-1.5 GitHub Phase A (create `redesign` label, reopen #78–80, create
  RIG-155/156 issues, label #62/#63/#42/#43). Owner runs after re-auditing.
- [ ] 🔒 T-1.6 GitHub Phase B closures (verified-fixed #127/#130/#138, redesign
  deferrals as not planned, corrective comments on #125/#126). Owner's answer
  2026-10-17: closures run after QA promotion and the tag, per step 8 of
  `rig/corpus/standards/change-management.md`.
- [ ] 🔒 T-1.7 GitHub Phase C closures after the fixes reach QA (#69, #70, #78–80,
  #108–110, RIG-155 issue). Same ordering: after QA promotion and the tag.
- [x] T-1.8 After T-1.5, record the new RIG-155/156 issue numbers in
  `wiki/Tickets.md` and the ticket files and update `tracker-transitions.json`.
  Prove: `node --test tests/ticket-traceability.test.js tests/coherence.test.js`.

## WP2 — Concrete bugs (subplan 02)

- [x] T-2.1 RIG-127.11 corrupt global config no longer crashes uninstall
  (commit `ca012c2a`). Prove: `node --test tests/install-uninstall-roundtrip.test.js` (26 pass).
- [x] T-2.2 RIG-127.12 nameless legacy block removes only attributable content
  (`bdc2f21a`). Same test file.
- [x] T-2.3 RIG-145 read-only batch decides network per command, returns
  `changed_paths` (`c4a88d23`). Prove: `node --test tests/guarantee-coverage.test.js` (37 pass).
- [x] T-2.4 RIG-147 undeclared-network diagnostic emitted once by the caller;
  library `console.warn` removed (`73c06576`). Same test file.
- [x] T-2.5 RIG-146 candidate filed with mutation record
  (`candidate-amendments/rig-146/at-lf-20.candidate.test.js`).
  Applying it to the frozen file is 🔒 in T-10.3.
- [x] T-2.6 RIG-135.1 cookie-import descendants die on success/timeout/kill/cancel
  (`970f3514`). Prove: `node --test tests/browse-cookie-import-descendants.test.js` (4 pass).
- [x] T-2.7 RIG-135.2 skill scripts spawn via `node:child_process`, group-killed
  (`a0e69e82`) and RIG-135.3 Xvfb detached (`6bd40aaa`). Prove:
  `node --test tests/browse-skill-spawn-descendants.test.js tests/browse-xvfb-descendants.test.js`
  (1 pass; Xvfb case skips off Linux — see T-2.9).
- [x] T-2.8 Fix the spawn-guard ratchet red.
  Accept: every direct-kill/ungrouped-timeout call site is either converted to
  `rig/lib/spawn-guarded.js` or listed in `rig/spawn-guard-allowlist.json` with
  a reason; no stale entries. Do not weaken the test.
  Prove: `node --test tests/spawn-guard-allowlist.test.js tests/spawn-guarded.test.js`.
- [ ] 🔒 T-2.9 Windows and Linux process-cleanup CI jobs
  (`.github/workflows/browse-process-cleanup.yml`) pass on a pushed branch.
  Done in CI, owner's to tick: `browse-process-cleanup` is green on
  `8288742a` for `descendants-windows`, `descendants-linux` and
  `descendants-macos` (PR #153 checks, 2026-10-16).
- [x] T-2.10 Patches to fetched third-party browse code are exercised on fetched
  pinned bytes. Prove: `node --test tests/upstream-shelf.test.js tests/upstream-onboarding.test.js` (2 + 5 pass).

## WP3 — Central corpus (subplan 03)

- [x] T-3.1 Slice 1 expand: `rig/corpus/` with pure `project()` (`34cc0cdb`).
- [x] T-3.2 Slice 2 migrate: install and onboarding go through `project()`;
  `materializeSelectedHosts` deleted (`f7be799b`).
- [x] T-3.3 Slice 3 agent onboarding instructions + sandboxed projection-script
  slot with adversarial tests (`328b0ac9`, `2c58476c`). Prove:
  `node --test tests/projection-script.test.js` (25 pass).
- [x] T-3.4 Slice 4 pinned fetch at onboarding with digest/patch/gap handling
  (`8152c212`). Prove: `node --test tests/upstream-fetch.test.js tests/upstream-onboarding.test.js tests/upstream-archive-links.test.js` (11 + 5 + 1 pass).
- [x] T-3.5 Slice 5 resumable v5 migration (`d888884f`, `dde62f7f`).
- [x] T-3.6 Slice 6 contract: `rig/tier-1` deleted, tier wording removed,
  `--tier 1` accepted but deprecated (`d7a7abd7`, `0186fea5`).
- [x] T-3.7 Fix the v5-parity and migration reds.
  Accept: `project()` and the real installer land the v5 bytes for every
  configuration except differences listed in the intended-differences table
  with a reason each (shelf and catalogue now fetched/selected, not default
  payload). `tests/corpus-projection.test.js` and `tests/migrate-v5.test.js`
  fully green, including the uninstall inventory round trip (ignored files
  included).
  Prove: `node --test tests/corpus-projection.test.js tests/migrate-v5.test.js`.
- [x] T-3.8 No live file points at a retired source path (corpus-contract
  "retired source path" case). Prove: `node --test tests/corpus-contract.test.js`
  (the duplicate-twin case is T-4.5).
- [x] T-3.9 Restore the single MCP disposition table assertion.
  Prove: `node --test tests/mcp-one-table.test.js tests/path-b-mcp.test.js`.
- [x] T-3.10 Runtime payload completeness: `--with-runtime` lands every shipped
  runtime lib (`ai-sdlc.js`, `service-catalogue.js`, `lint-format-setup.js`,
  `evidence-artifacts.js`, `mcp-dependencies.js`, `test-evidence-reporter.js`,
  `rig/bin/setup-mcp.js`) and the default install still lands every `SKILL.md`
  with no code. Prove: `node --test tests/rig-bootstrap.test.js`.
- [x] T-3.11 Candidate amendment for frozen AT-PB-3 (shelf is fetched, not
  vendored). File under `candidate-amendments/03-central-corpus/`, with the
  proposed diff and an unsigned runnable copy that passes. Tick = candidate filed.
- [x] T-3.12 Complete the shelf removal: with fetch-at-onboarding proven, delete
  `install_vendored_skills`/vendored-shelf code paths that nothing calls, keeping
  `rig/catalog/**` untouched. Accept: grep for the removed symbols shows zero
  production callers. Prove: `node --test tests/vendored-skills-install.test.js tests/upstream-shelf.test.js`
  (update or retire tests that assert the retired behavior; list each in the trace).

## WP4 — Catalogue (subplan 04)

- [x] T-4.1 Canonical catalogue in `rig/corpus/catalogue.json`: 115 services with
  stable IDs, grades, slices, dependencies, owned scopes.
- [x] T-4.2 One conforming (`good`) and one violating (`bad`) fixture per service
  (`tests/fixtures/services/<id>/{good,bad}`, 115 dirs).
- [x] T-4.3 Installed lane: selected services bind to approved definitions,
  executed check counts returned. Prove: `node --test tests/catalogue-installed.test.js` (2 pass).
- [x] T-4.4 Full 115 × 3 grades × good/bad matrix passes through installed
  selection→approval→apply→check. Accept: nonzero executed checks and an
  approved binding ID on every path; bad fails, good passes.
  Prove: `node --test tests/catalogue-all-services.test.js` (slow, > 5 min; run it alone, in the background, output to a log).
  Status when this list was written: **result not yet known**; run it first.
- [x] T-4.5 Hand-author specific guidance for all 115 services. For each service
  write `identity`, `minimal`, `mid`, `maximal` and slices as service-specific
  guidance (what good looks like, failure modes, how to adopt in an existing
  repo, truthful coverage limits). No shared template sentences; remove
  "generic baseline" wording from `rig/corpus/services/**`.
  Accept: zero "generic baseline" hits there, and no corpus service file is
  byte-identical to anything in `rig/catalog/services/**`.
  Prove: `node scripts/check-coherence.js` and `node --test tests/corpus-contract.test.js`.
  Work in family batches, committing each: development, testing, product-security, infrastructure.
- [x] T-4.6 Extend the authored-service gate to reject known boilerplate
  sentences and any body sharing more than a set fraction of text with another
  service. Add red tests first (boilerplate body, near-duplicate body).
  Prove: `node --test tests/catalogue-all-services.test.js tests/advanced-catalogue.test.js`
  (the frozen authorship assertion is not edited; file a candidate under
  `candidate-amendments/04-catalogue/` instead).
- [x] T-4.7 Detector reports present-but-invalid configurations as discovered
  and repairable, not absent. One red-then-green case per detector family.
- [x] T-4.8 Negative cases: missing external tool, unsupported input and runner
  error each return a named non-pass with setup guidance; config-only checks
  never claim live-infrastructure assurance.
  Prove: `node --test tests/catalogue-installed.test.js` (extend).
- [x] T-4.9 Grade growth (minimal ⊂ mid ⊂ maximal), grade ceilings,
  dependency-only slice resolution and old/mixed-ID selections each have a test.
- [x] T-4.10 Merges: either document each proven duplicate merge (reason, old-ID
  compatibility, receipt compatibility) or record "no merges; count stays 115"
  in the trace. Delivered count = 115 minus documented merges.
- [x] T-4.11 Onboarding hook: the corpus onboarding instructions say when to
  offer each service and how to graft it. Prove: `node --test tests/path-b-onboarding.test.js tests/context-aware-onboarding.test.js`.
- [x] T-4.12 Candidate amendment for the frozen authorship wording assertion and
  the AT-PB-1 catalogue pin, filed under `candidate-amendments/04-catalogue/`.

## WP5 — Lint/format setup (subplan 05)

- [x] T-5.1 Four runnable cases: good tool untouched; declined replacement is
  byte-identical; approved setup writes exact scope; accepted replacement undoes
  byte-identical. Prove: `node --test tests/lint-format-setup.test.js` (8 pass).
- [x] T-5.2 Shared TOML, edited-file conflict, interrupted apply and interrupted
  restore keep the recoverable preimage (same file).
- [x] T-5.3 `setup-decision-rule.md` and ecosystem preferences updated;
  `.rig-backup` removed from the design.
- [x] T-5.4 Existing lint/format suites stay green. Prove:
  `node --test tests/advanced-lint-format.test.js tests/semantic-lint-format.test.js` (7 + 3 pass).
- [x] T-5.5 Setup/replacement reachable from the installed onboarding path, not
  only the library: an installed fixture runs propose→approve (own approval)→apply
  →uninstall through the public CLI. Prove: extend
  `tests/lint-format-setup.test.js` with an installed-path case; run it.
- [x] T-5.6 Candidate amendment for any frozen lint case that must change
  (if none, record "none needed").

## WP6 — Clean-install E2E (subplan 06)

- [x] T-6.1 Installer accepts a candidate artifact with SHA-256 + Git archive
  commit verification. Prove: `node --test tests/e2e/installer-artifact.test.js`.
- [x] T-6.2 Scoped evidence cleanup preserves pre-existing reports and ignored
  files. Prove: `node --test tests/scoped-evidence.test.js`.
- [x] T-6.3 `scripts/clean-install-e2e.js`, `.github/workflows/e2e.yml` and
  `release-eligibility.yml` exist and are read-only/no-write permissioned.
- [ ] T-6.4 One complete local run is green and archived under `.context/`:
  real `npm ci`, real MCP `rig_instructions` call, ephemeral-key approval,
  selected service with nonzero executed check IDs, full before/after
  inventory comparison (ignored/untracked included). Labelled provisional.
  Prove: `node scripts/clean-install-e2e.js --sha $(git rev-parse HEAD) --out .context/e2e-evidence.json`
  (commit the work first so the SHA contains it).
- [x] T-6.5 Deliberate-breakage evidence: a bad lockfile entry and a missing
  corpus file each make the E2E go red; record both in a trace.
- [x] 🔒 T-6.6 `npm run test:e2e` entrypoint. Applied on the owner's 2026-10-17
  instruction and re-signed by the owner in this session. The package script
  and signed snapshot agree; `node scripts/check-advanced-spec.js` passes
  (16 files, 95 cases). No test command was bypassed or weakened.
- [ ] 🔒 T-6.7 Green Linux and macOS runs on the exact candidate SHA (needs push).
  Partly done: the macOS and Linux `descendants-*` jobs are green on `8288742a`.
  The `test` workflow on that SHA failed only on `check-coherence` refusing to
  skip the tracker comparison without a token; `test.yml` now passes
  `github.token` to the suite, so the next push settles it.
- [ ] 🔒 T-6.8 Post-publication tagged-download smoke test.

## WP7 — AI development standards (subplan 07)

- [x] T-7.1 `rig/corpus/standards/ai-sdlc.md` ships; enforced rule = proving test
  actually executes and passes (`verifyTestEvidence`), everything else labelled guidance.
- [x] T-7.2 Negative cases: comment-only, skipped, renamed, failing, other-file
  references all rejected. Prove: `node --test tests/ai-sdlc-standards.test.js tests/standards-contracts.test.js` (4 + 9 pass).
- [x] T-7.3 Standards graft preserves existing instruction text inside a managed
  section on a fixture repo.
- [x] T-7.4 `scripts/check-test-evidence.js` exists as the repository gate.
- [x] T-7.5 Wire `check-test-evidence.js` into the repo's own checks without
  editing the pinned package scripts: call it from an existing test file or
  `check-coherence.js`. Prove: `node --test tests/coherence.test.js`.
- [x] T-7.6 `CLAUDE.md` and `GEMINI.md` point at the standards and the Delivery
  SOP instead of restating them (the SOP section added with this list satisfies
  this; verify no duplicate restatement remains).
- [x] T-7.7 Change-management policy, on the owner's 2026-10-17 instruction that
  a twice-given instruction is a policy: `rig/corpus/standards/change-management.md`
  holds the ordered release sequence, `scripts/check-deployment-gate.js` enforces
  it and stops at the first unmet step, and
  `.github/workflows/release-eligibility.yml` runs it against the exact QA head.
  Accept: a stale receipt, a dirty tree or a missing changelog entry each block.
  Prove: `node --test tests/deployment-gate.test.js` (12 pass, 2026-10-17;
  includes full-gate execution, receipt coverage/base and portable digest regressions).

## WP8 — Coherence and upkeep (subplan 08)

- [x] T-8.1 `scripts/check-coherence.js` with tracker mapping, docs/CLI/version,
  corpus twin and retired-doctrine assertions; four adversarial cases.
  Prove: `node --test tests/coherence.test.js` (4 pass).
- [x] T-8.2 Coherence check wired into the CI gate. `package.json` scripts are
  pinned: run it from an existing test file now; candidate amendment for the
  script line.
- [x] T-8.3 `.github/workflows/health.yml`: weekly cron + manual dispatch with an
  explicit QA ref input; runs full gate, E2E, dependency drift, wiki budget;
  reporting job alone has `issues: write`, opens/updates one `health` issue
  keyed to SHA/run. Execution jobs read-only. Prove: workflow lint
  (`actionlint` if available, else YAML parse) plus a unit test of the issue
  dedupe logic.
- [x] T-8.4 Dependency audit: `npm audit --omit=dev` shows no high/critical in
  root, `rig-mcp`, `pi-extension`; `npm ci --dry-run` passes in each.
- [x] T-8.5 `CHANGELOG.md` with a 6.0.0 entry; release workflow requires a
  CHANGELOG entry and a green E2E for the tag.
- [x] T-8.6 Fix the wiki-budget red (condense or archive per
  `wiki/reasoning/README.md`; do not raise waivers).
  Prove: `node --test tests/wiki-budget.test.js tests/wiki-index.test.js`.
- [x] T-8.7 One-time coherence sweep (docs↔code, board↔GitHub↔tickets,
  instructions↔North star, hubs↔traces, corpus↔projections, guidance↔checks).
  Every finding fixed or turned into a check. Prove: `node scripts/check-coherence.js` exits 0.
- [ ] 🔒 T-8.8 Health run green on manual dispatch with the QA ref, and a
  deliberately failing run opens a `health` issue.

## WP9 — Docs and vision (subplan 09)

- [x] T-9.1 Version `6.0.0` everywhere the version authority requires.
  Prove: `node scripts/check-versions.js`.
- [x] T-9.2 `README.md`: what Rig is, the one install command, what happens next,
  what you get. No per-host support matrix. Prove: `node scripts/check-coherence.js`.
- [x] T-9.3 Install guide: fresh repo, existing repo with agent config, upgrade
  from v5, uninstall. Every command/flag exists in CLI help.
- [x] T-9.4 Troubleshooting page covering every named refusal and coverage-gap
  message the product prints.
- [x] T-9.5 `docs/vision.md`: one page, the shipped 6.0.0 product.
- [x] T-9.6 Translated READMEs (`README.es.md`, `README.ko.md`) regenerated or
  marked lagging. Prove: `node scripts/check-versions.js`.
- [ ] T-9.7 The documented install flow is run once by hand-following the README
  on a clean directory; result recorded in a trace. Run and traced in
  `wiki/reasoning/2026-10-14-closure-readme-install-404.md`: the bundled
  bootstrap installs clean into a fresh repository, but `install rig --version
  v6.0.0` 404s until the tag is published, so the box waits on T-10.8.

## WP10 — Review, sign, release (subplan 10)

- [x] T-10.1 Security review of the diff and install/unpack path (projection
  scripts, service checks that run repo commands, MCP exposure, secret hygiene);
  every finding fixed or answered in writing. Use `/security-review`.
- [x] T-10.2 Independent code review (`rig-code-review`, report-only) of the full
  diff; every finding fixed or answered in writing.
- [x] T-10.3 Assemble the single owner amendment bundle from all candidate
  folders: moved paths, service wording, removed APIs, package scripts,
  verifier counts, manifest entries, RIG-146, AT-PB-1/3, AT-HOST-5, trace targets.
  Closed by delivery: the owner applied the AT-SHAPE-6, AT-LF-20, AT-PB-1 and
  AT-PB-3 amendments and re-signed (see T-10.4). The later `test:e2e` package
  script amendment is also applied and signed (T-6.6).
- [x] 🔒 T-10.4 Owner applies the bundle and runs `node scripts/approve-gate1.js` once.
  Owner reported signing complete on 2026-10-17; verification passes.
  `tests/advanced-oracle.test.js` and
  `tests/path-b-catalog.test.js` carry the AT-SHAPE-6, AT-LF-20, AT-PB-1 and
  AT-PB-3 amendments, and `check-advanced-spec` verifies the re-signed manifest
  (16 files, 95 cases, principal `gate1-owner`).
- [ ] T-10.5 Fresh review receipt bound to the final bytes. Needs one run of
  `node scripts/review-receipt.js --target <spec> --implementation-root .
  --base origin/qa-prod --model <id> --out <receipt> --author-context <id>`:
  it spawns a 30-minute ephemeral reviewer, and a `fail` burns one of the two
  attempts RIG-124 allows. The owner already selected `claude-opus-5` and
  authorized the agent to run it after signing; no new model decision is needed.
- [ ] T-10.6 `npm test` green locally (the only full-gate run, right before push).
  Exit 0 on 2026-10-15: secrets 15/15, main suite 1054 pass / 0 fail,
  pi-extension 15/15, rig-mcp 6/6, and the five release validators clean
  (`.context/npm-test-final7.log`,
  `wiki/reasoning/2026-10-15-closure-full-gate-green.md`). Re-run on 2026-10-17
  against the de-duplicated tree
  (`wiki/reasoning/2026-10-17-retire-the-duplicate-services-catalogue.md`).
- [ ] 🔒 T-10.7 Push, single PR to `qa-prod`, required CI green (`gate1-pin` included).
  Push and PR done by the owner: PR #153 `qa-prod` ← `vaibhav-kodiyan/universal-issues-closure`.
  Left on this box: re-push the de-duplication commit, confirm `test` green
  (it needed the tracker token fix), and make `gate1-pin` a *required* status
  check on `qa-prod` — today it is documented as required on `prod` only, so on
  `qa-prod` it reports without blocking. The de-duplication commit `ba123844` is
  pushed (2026-10-17) and is the PR head; confirming its checks and the
  `gate1-pin` requirement are the owner's two remaining steps.
- [ ] 🔒 T-10.8 QA promotion on exact-SHA automated evidence; tag and release;
  then the public tagged-download smoke test and tracker closures — in that
  order, per steps 7–8 of `rig/corpus/standards/change-management.md`. Nothing
  closes before the tag exists, so no task is left open against a closed issue.
  The promotion dispatch now also proves the change-management sequence:
  `exact-qa-release-eligibility` takes the review receipt JSON as an input and
  runs `node scripts/check-deployment-gate.js` against the exact QA head.

## Progress count

Done: 74. Open: 12. The owner signature is verified.
The full gate passed on f5f2ba70, but exact-SHA E2E found a real existing-report
preservation failure after full purge. T-6.4 and T-10.6 are reopened for the
scoped-cleanup fix and renewed exact-byte evidence. Final review, CI and
ordered QA/publication/tracker work remain pending.
Recount `[x]` and `[ ]` and update this line whenever a box changes.
