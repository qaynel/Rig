# QA prod closeout — consolidated findings and acceptance criteria

**Latest fix verification:** use the [remaining acceptance work](qa-prod-closeout-followup.md).
C2, C5 and C6 are verified resolved. C1, C3, C4 and C8 retain bounded gaps;
C7 behavior passes but its maintained retry regression remains. The original
review below preserves the baseline evidence and criteria, not extra tasks.

Review date: 2026-10-18. Target: `origin/qa-prod`. PR: #153.
Reviewed implementation: `082d8467504d51aeda4ad955e78ee33c67ba548a` plus the
existing uncommitted fixes. **Verdict: changes required.** This is a report-only
handoff, not a binding release receipt or PR approval.

This is the single active remediation list. It consolidates the earlier
review reports and findings 1–21; do not treat their historical descriptions
as additional tasks. Preserve the signed oracle, settled owner decisions,
existing fixes and branch name. Implement the smallest shared fixes in editable
code/tests, and record red/green evidence for each item below. No new feature
or redesign is requested.

## C1 — High: migration file identity/type checks leave unsafe mutations

**Evidence:** `rig/lib/migrate.js:80,114,300,513,524,660–665` and
`rig/lib/payload.js:18`. A directory descriptor pins the parent, not its
entries. Replacing the temp immediately before cleanup deletes unrelated
bytes and migration reports `migrated`. Replacing it immediately before
publication installs unrelated bytes as the recovery record, and retry fails
`migration-corrupt`. Separately, hard-linking an owned `.rig/routing.md` to
an outside file makes normal migration overwrite the outside alias. A FIFO at
the fixed temp path also blocks in `prepareTempAt` (`:140–148`) before the
regular-file check; the bounded disposable probe must kill the blocked process
group. The FIFO liveness gap also existed before this branch.

**Acceptance criteria:**

- [ ] Temp publication uses the validated record; replacing its directory
  entry immediately before publication cannot publish unrelated bytes.
- [ ] Replacement immediately before normal Python cleanup and resumed Node
  cleanup preserves the replacement's bytes and mode. Refusal retains safe
  recovery state; migration cannot report success after deleting user data.
- [ ] Hard-linked mutation targets are refused without changing aliases, or
  replaced safely so every existing alias keeps its original bytes/mode.
  Check payload writes, instruction additions and bookkeeping writes at their
  common mutation seam; symlink-only containment is insufficient.
- [ ] Refuse non-regular temp collisions without blocking or modifying them.
  In particular, a pre-existing FIFO must return a named refusal within the
  bounded regression timeout; inspect file type safely before reading.
- [ ] Add editable regressions at the actual Python link/unlink and resume
  deletion boundaries, and a static outside-hardlink fixture. Keep normal
  migration, no-clobber publication, ancestor swaps, interruption/retry and
  uninstall inventory preservation passing. An extra pathname check before a
  mutation does not eliminate its replacement window.

**Prove:** the current red probes are
`node .context/review-received-temp-entry-race.js` and
`node .context/closeout-safety-hardlink-repro.js`, plus
`node .context/qa-closeout-fifo-repro.js`. Promote their behavior to
editable tests and run `node --test tests/migrate-v5.test.js
 tests/rig-bootstrap.test.js tests/release-blockers.test.js`.

## C2 — High: migration replay overwrites files changed during interruption

**Evidence:** `rig/lib/migrate.js:578–585,617–618`. Adoption skips the live-byte
check used for ordinary writes; final-marker publication skips it too.
Interrupt before adopting `.rig/onboarding/unpack.md` and edit it, or interrupt
before the final marker and create `.rig/onboarding/README.md`: retry reports
`migrated` and overwrites the user bytes.

**Acceptance criteria:**

- [ ] Every persisted write intent, including adoption and the deferred
  marker, revalidates its original/desired state before mutation.
- [ ] Both post-interruption edits above return a named recoverable conflict;
  user bytes, modes and unrelated files remain unchanged.
- [ ] Unchanged identical-file adoption and a legitimately landed journaled
  write remain resumable and idempotent. Do not hide a conflict by resetting
  the journal, deleting user data or marking the migration complete.
- [ ] Add durable red/green regressions for both public retry flows and retain
  the complete interruption/resume and uninstall round-trip tests.

**Prove:** `node .context/closeout-safety-marker-repro.js` and
`node .context/closeout-safety-adopt-repro.js` currently fail preservation
assertions. Then run `node --test tests/migrate-v5.test.js`.

## C3 — Medium: approved optional skill helpers lose executable/runtime delivery

**Evidence:** `rig/lib/upstream-fetch.js:148` and
`rig/lib/onboarding.js:265–299,810–811,831–834` drop source modes and
writes fetched files with mode `0644`, although pinned metadata marks helper
scripts `0755`. After an approved fixture fetch, a selected helper is not
executable. Shared helper paths referenced by optional instructions are not
projected into a runnable installed location. Apply/check still report success.

**Acceptance criteria:**

- [ ] Preserve pinned executable/non-executable modes through fetch,
  projection and journaled installation; changing a required helper's mode
  after apply is caught by the relevant check.
- [ ] The selected skill's documented helper command resolves to shipped,
  approved bytes and executes. Provide or accurately adapt required shared
  helper paths; do not return a successful installed capability with missing
  plumbing. A named gap is required if prerequisites cannot be supplied.
- [ ] Demonstrate an approved install from a verified fixture archive and one
  representative helper invocation through the installed entrypoint, rather
  than asserting only file presence or the fetch staging directory's mode.
- [ ] Default install still stages zero optional skill trees. Retain approved
  fetch/digest/patch checks and scoped removal of installed helpers.

**Prove:** `node .context/closeout-runtime-review/repro.cjs --case modes`
currently exits 1; durable checks belong in the
editable upstream onboarding/shelf tests. Run `node --test
 tests/upstream-onboarding.test.js tests/upstream-shelf.test.js
 tests/corpus-projection.test.js tests/onboarding-hardening.test.js`.

## C4 — Medium: deselected services remain active

**Evidence:** `rig/lib/service-catalogue.js:138–139` returns for an empty
selection; `rig/lib/onboarding.js:672–713` only reconciles prior skill/graft
artifacts. Select/apply a service, approve an empty selection, apply/check:
state says `checked`, but old bindings and guidance remain. Ordinary checks
still execute the deselected service and can fail on its requirements.

**Acceptance criteria:**

- [ ] After approved reselection, active bindings exactly match the new
  effective selection, including an empty set and dependency slices.
- [ ] Remove obsolete unedited owned service guidance through the journal.
  Preserve edited/unowned artifacts and name any unreconciled remainder;
  preserving an artifact must not keep its deselected check active.
- [ ] Exercise nonempty→empty and nonempty→smaller selections through
  prepare/propose/approve/apply/check. Ordinary `runChecks` executes no removed
  service, while retained selected services still run their actual checks.
- [ ] Repeat apply/retry safely and preserve uninstall inventory semantics.

**Prove:** `node .context/closeout-runtime-review/repro.cjs --case deselect`
currently exits 1; run `node --test
 tests/catalogue-installed.test.js tests/path-b-onboarding.test.js
 tests/onboarding-hardening.test.js tests/advanced-services.test.js`.

## C5 — Medium: corrupt upstream receipts still pass onboarding check

**Evidence:** `rig/lib/onboarding.js:882–886,981–994` records no receipt digest
and checks its existence with `sha256: null`. Replacing a receipt with
`this is not a receipt` still produces phase `checked` and no hard failures.
This permits green provenance evidence for invalid or altered receipt contents.

**Acceptance criteria:**

- [ ] Bind the generated receipt to the approved/applied upstream evidence and
  verify its integrity during check; mere file existence is insufficient.
- [ ] Missing, truncated, invalid JSON, wrong-pin/revision and altered patch/file
  evidence produce a named failure at the receipt path and cannot be checked
  successfully. Preserve the original bytes when reporting failure.
- [ ] An unchanged valid receipt and fetched files pass; retain the existing
  wrong-archive, edited-file and failed-apply preservation checks.
- [ ] Add a durable editable receipt-tampering regression at the public
  onboarding check seam, red on this candidate and green after correction.

**Prove:** `node .context/closeout-runtime-review/repro.cjs --case receipt`
currently exits 1; run `node --test
 tests/upstream-onboarding.test.js tests/upstream-shelf.test.js`.

## C6 — Medium: wrong-shaped global config aborts uninstall

**Evidence:** `rig/lib/global-writes.js:206`, called from
`rig/lib/lifecycle.js:308`. Valid JSON such as
`{"rig":"user replaced namespace"}` throws at the `in` operator instead of
returning best-effort. This is a remaining gap in the existing corrupted-config
fix, not a newly introduced regression.

**Acceptance criteria:**

- [ ] Validate root and namespace shapes before property operations. Preserve
  unsupported user data unchanged, including valid-but-wrong-shaped JSON.
- [ ] Public uninstall returns normally, names the global path as best-effort,
  retains retry/ledger evidence, and continues independent local teardown.
- [ ] Cover strings, numbers, booleans, arrays, null and malformed JSON; retain
  successful attributed removal and other-install/user entry preservation.

**Prove:** `node .context/closeout-safety-global-shape-repro.js` currently
fails. Add the regression to editable uninstall/global-config tests, then run
`node --test tests/install-uninstall.test.js tests/installer-global-mcp.test.js
 tests/release-blockers.test.js`.

## C7 — Medium: successful health runs open or reopen failure issues

**Evidence:** `scripts/report-health-issue.js:16,30–37` accepts `success` and
always POSTs/PATCHes an open `health` issue. `.github/workflows/health.yml`
runs the reporter even when health is green. The upkeep contract requires
issues on failure, not a new failure-labelled open item for every healthy SHA.
The mocked-HTTP public entrypoint probe confirms POST on `success` with no
network requests leaving the process.

**Acceptance criteria:**

- [ ] A successful run creates no failure issue and never reopens a closed
  failure issue. An optional recovery update to an existing issue must not
  leave it misleadingly open as a new failure.
- [ ] A failing run still opens one issue for its SHA; repeating it updates
  that issue. Other SHAs, pagination and pull requests do not cause duplicates.
- [ ] Cancellation/unknown results have an explicit non-success disposition;
  API errors remain visible. Keep mutation permission confined to reporting.
- [ ] Add editable tests of the actual reporter entrypoint with mocked fetch
  for success/failure/retry; testing only `findHealthIssue` is insufficient.

**Prove:** `node .context/qa-closeout-health-success-repro.js` currently exits
1. Then run `node --test tests/health-workflow.test.js
 tests/release-eligibility-workflow.test.js` without live issue writes.

## C8 — Medium: shipped guidance and live authorities contradict current behavior

**Evidence:** the manifest ships `rig/catalog/skills/README.md:14–35` to
`.rig/skills/README.md`, still calling Rig markdown-only, unwired and without
runtime engines. `wiki/topics/catalogue-contract.md:70–91,122–124` and
`authored-service-gate.md:4–9,20–28` describe unsigned/unbuilt service work;
`testing-strategy.md:6–8,39` describes resolved checks as outstanding.
`install-manifest-removal.md:34–37` incorrectly promises preservation of edits
inside managed bodies. The signed contract explicitly permits removing those
edits while preserving outside text. Finally, technical-spec:2480–2481 says
optional reference trees are absent from the release archive; only their
installed staging is absent.

**Acceptance criteria:**

- [ ] Correct the installed README and the named live hubs against the actual
  current delivery and signed contract; label retained historical explanations
  as historical. Do not edit immutable trace bodies or frozen artifacts.
- [ ] State managed-section ownership accurately: recorded managed sections
  are removed even after edits inside them, while outside bytes survive and
  malformed/rewritten markers are reported safely. Do not change this accepted
  implementation behavior to satisfy the stale hub.
- [ ] Distinguish source-archive reference trees from the zero-optional-tree
  installed payload; reflect the signed catalogue and actual finished work.
- [ ] Add one editable consistency check using a disposable installed tree for
  the shipped guidance, plus current-authority checks. Regenerate wiki indexes
  and refresh size hints after all documentation edits.

**Prove:** inspect a disposable default/active installation and
`git archive HEAD rig/catalog/skills | tar -tf -`. Run `node --test
 tests/deployment-policy-docs.test.js tests/corpus-contract.test.js
 tests/catalogue-all-services.test.js tests/path-b-catalog.test.js`, then
`node scripts/check-wiki-index.js`, `node scripts/check-wiki-budget.js`, and
`node scripts/check-size-hints.js`. Every claimed current fact must match its
referenced authority; historical wording is not a reason to reopen frozen scope.

## Prior review reconciliation

| Earlier material | Current disposition |
|---|---|
| Attached nine-item final documentation review | Corrections are present and current docs checks pass; additional active-guidance contradictions are C8, not nine reopened tasks. |
| Findings 1, 5, 13, 14, 17, 21: migration file/publication/recovery safety | Existing fixes retained; remaining mutation identity failures consolidated as C1. Newly proven replay gaps are C2. |
| Findings 2, 6, 7, 11, 15, 16, 18: MCP setup/retry/ownership | Resolved in examined implementation and focused regressions; real-npm interruption retry independently passed in the preceding review. Renew that integration on the corrected final candidate. |
| Findings 3, 9, 12: exact-SHA remote-download and platform eligibility | Implementation corrections are present; operational exact-QA Linux/macOS evidence remains a production-promotion checklist item. |
| Findings 4, 8: network diagnostics lost on success/later gaps | Resolved; fresh diagnostics/docs/catalogue sample passes 18/18. |
| Finding 10: deployment script documentation overclaim | Corrected and deployment/documentation regressions pass. |
| Finding 19 and current installed/live guidance | Remaining claims consolidated as C8. |
| Finding 20: stale hints and overstated completion | Index/size/budget checks pass; final evidence is deliberately left pending until the corrected candidate is frozen. |
| Managed graft-body deletion probe | Expected by signed AT-PB-2 and accepted business risk D11. Not a code defect. Correct contrary documentation under C8. |

Historical reports and traces stay intact. This table determines active work;
old evidence does not certify new bytes, and earlier headings are not extra
unbounded fixes.

## QA merge completion criteria — delivery checks, not extra defects

After C1–C8 are resolved, complete this sequence on one candidate. Evidence
must include commands, test names, reviewed/fixed snapshots and retained logs.

- [ ] Resolve C1–C8 as a batch, update affected current docs/design, and supply
  a written disposition plus passing editable regression evidence for each.
  Re-run the adjacent shared callers touched by the fix; avoid unrelated
  redesign or frozen-oracle changes.
- [ ] Finish generated files and documentation, commit the complete candidate,
  freeze all writers, and confirm a clean worktree. Preserve the branch name.
- [ ] Verify the signed oracle and run full `npm test` on those final bytes.
  Then retain an exact-commit local-archive clean-install result plus the
  real-npm interrupted-upgrade MCP handshake/`rig_instructions` integration.
  For local candidate proof, use:

  ```sh
  node scripts/check-advanced-spec.js
  npm test
  git archive --format=tar.gz --prefix=rig-candidate/ -o .context/qa-candidate.tar.gz HEAD
  node scripts/clean-install-e2e.js --sha "$(git rev-parse HEAD)" --artifact .context/qa-candidate.tar.gz --out .context/qa-candidate-e2e.json
  RIG_TEST_REAL_NPM=1 node --test --test-name-pattern='public bootstrap retry preserves MCP setup intent' tests/migrate-v5.test.js
  ```

- [ ] Obtain the fresh owner-designated wrapper-authored passing receipt on
  those same bytes. Preserve `.context/qa-readiness-final-review.json.attempts.json`,
  author context `v6.0.0-qa-readiness-2026-10-17`, one prior failure and the
  designated reviewer. No reset, hand-authored receipt or binding attempt
  during implementation. The ordered deployment policy remains authoritative.
- [ ] Owner-controlled push updates existing PR #153. Required checks are green
  on that exact head, and an authorized account verifies required `gate1-pin`
  and review protection for `qa-prod`. The current API403 is not verification.
- [ ] An eligible independent reviewer approves that PR; the author cannot
  self-approve. Merge through the existing authorized QA process.

Once these criteria pass, this review has no additional product/design work
for QA merge. Follow-up validation should verify the criteria and fix delta;
a new blocker needs concrete evidence and its own observable criterion.
This advisory report cannot substitute for the required binding receipt or
GitHub approval.

## Later production steps — do not use these to block a pre-QA sequence

After QA receives the candidate, run automated health and real-download
clean-install evidence on the exact QA head on Linux and macOS, then the
existing exact-QA eligibility workflow. Production promotion, version tag and
release follow. Only after publication run the public tagged-download smoke
and close/reconcile trackers. These remain required release operations; they
are not requests for the fixing agent to manufacture post-merge/tag evidence
before QA merge. No manual outside-repository install gate is introduced.

## Review coverage and verification

- Full branch inventory against `origin/qa-prod`: 2,721 committed changed
  paths, plus current dirty fixes/review notes; 2,600 publishable files at the
  initial snapshot (baseline recorded under `.context/qa-closeout-review-baseline.json`).
  Renamed/generated corpus, service fragments, fixtures and archived wiki
  account for most path volume. Detailed manual review covered changed
  executable modules and their shared callers, not a claim of line-by-line
  independent re-execution of every archived document or third-party resource.
- Independent passes covered migration/journal/lifecycle/global and MCP
  safety; adaptive onboarding/corpus/projection/upstream/sandbox, services,
  lint setup/checks/evidence and CLI architecture; current docs/spec/oracle
  scope and all earlier finding groups. Primary covered installer transport,
  CI/promotional dependencies, digest/receipt validation, health reporting,
  prior finding reconciliation and reproduction verification.
- Existing focused suites pass: primary delivery/release/installer **58/58**;
  safety migration/release/bootstrap **99/99** and lifecycle/global/guard
  **36/36**; runtime/projection/sandbox/services/upstream **127/127**; primary
  prior diagnostics/docs/catalogue **18/18**. These overlap; do not add them
  into a claimed distinct-test total. Logs are retained under `.context/`.
- Primary independently reran the temp-entry, external hardlink, replay
  marker/adoption, global-config, deselection, receipt and executable-mode
  repros. They fail the desired-outcome assertions on the current candidate.
  The primary health-success probe uses mocked fetch and no live issue writes.
- A separate catalogue-wide installed suite passes **115/115**, exercising
  every service at all three grades with both good and bad fixtures. Log:
  `.context/closeout-runtime-review/catalogue-tests.out`; its runner/worker
  exited cleanly.
- Secret hygiene **15/15** passes. Fresh npm production audits of both MCP
  dependency trees report zero vulnerabilities. Signed oracle verification
  passes (16 files, 95 cases); versions, rule-copy generation and candidate
  tracker coherence pass. Wiki index/budget/size and whitespace are checked
  again after the final report changes.
- Retained full npm log reports 1,109 main passes/two skips, Pi 15/15 and MCP
  6/6. This review did not repeat the full gate; the fixing agent must renew it
  after C1–C8 on the final bytes. Earlier exact-SHA evidence binds `082d8467`,
  not this dirty implementation. Fixture mirrors and local checks do not
  certify GitHub-hosted Linux/macOS results or arbitrary real cloud/scanner/
  browser integrations outside the exercised boundaries.
- The deployment checker stops at candidate freeze because the worktree is
  dirty; no full-gate or receipt step ran through it. Log:
  `.context/qa-closeout-deployment-check.log`.
- Read-only GitHub lookup: PR #153 remains OPEN/BLOCKED at `ba371b64`, two old
  `test` failures, with `gate1-pin` and descendant-cleanup checks successful.
  Required-check configuration lookup returns HTTP403. No GitHub write,
  commit, push, merge, approval or binding review attempt was performed.

Review edits are reports/acceptance/wiki navigation only. Existing source
changes remain untouched and uncommitted. Current review snapshots, logs and
standalone disposable repros are under `.context/`; their acceptance behavior
must be promoted into durable editable tests by the fixing agent.
