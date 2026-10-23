# Review Received — resolution acceptance criteria

**Historical detailed ledger.** The active consolidated fixing-agent handoff is
[QA prod closeout review](qa-prod-closeout-review.md). It reconciles all prior
findings into C1–C8 and distinguishes QA merge checks from later promotion and
publication evidence. Use that list for current remediation; preserve this
ledger as the evidence/history of earlier findings.

Agent handoff for PR #153, targeting `qa-prod`. Findings were reproduced at
`ba371b641e3dc6b245d94acaa1a29a882011a8ec`; re-check locations against the
current branch before changing them. All checkboxes below are initially open.

Fix the four defects below with the smallest shared change. These criteria
clarify the review findings; they do not amend the signed acceptance oracle or
grant merge approval. Read `rig/corpus/routing.md`, `CLAUDE.md` and the wiki
primer first. Preserve the existing documentation corrections and branch name.
Add regressions in editable test files: do not edit frozen tests or sign for
the owner. Update affected working design/docs and wiki with the fixes.

For each finding, supply the regression test names, runnable command, failure
on the reviewed implementation, pass on the corrected implementation, and a
short explanation of the shared fix. Use disposable repositories and config.

## Review policy

- Review the full candidate against its target branch, including code,
  workflows, tests, user documentation, design notes, generated indexes, and
  publishable untracked files. Check the signed oracle and working technical
  design for scope and behavior. The four findings below are known items, not a
  limit on review scope.
- Every actionable finding must state severity, exact file/line evidence,
  user or release impact, and observable acceptance criteria. Criteria must
  name the regression or runnable check that proves the behavior; do not hand
  off an unbounded request such as “fix this” or “add coverage.”
- The resolution agent closes a finding only after every attached criterion
  passes on the candidate. Record each test name, command, red result on the
  reviewed behavior where reproducible, green result after the fix, and the
  shared root-cause change. A focused test does not stand in for final-byte
  integration, full-gate, review-receipt, or owner-controlled delivery proof.
- Independent review remains report-only. A clean local result permits the
  candidate to re-enter review; it does not grant PR approval, release
  eligibility, or merge authorization.

## Finding 1 — migration temporary-file symlink

**Problem:** `rig/lib/migrate.js`, `atomicJson`, guards the final path but
follows the temporary path when writing. A pre-existing symlink can
truncate an unrelated file outside the repository.

Acceptance criteria:

- [x] A migration fixture with `.rig-migration.json.tmp` pointing to an
  external sentinel cannot change the sentinel's bytes or mode. The unsafe
  path produces a recoverable refusal before migration payload writes.
- [x] The same safety holds for a dangling symlink and a symlink to another
  file inside the target. Neither referent is created or overwritten.
- [x] Temporary-file creation cannot follow a substituted symlink between a
  path check and the write. Use exclusive creation or an equivalent safe
  primitive; a separate existence/symlink check alone is insufficient.
- [x] Replacing the `.rig` parent directory with a symlink immediately before
  temporary-file open is refused before bytes are written outside the target;
  preserve both target and external inventories.
- [x] A pre-existing regular temporary file is not silently truncated. Refuse
  the collision or use a safely created alternative; preserve unrelated data.
- [x] Ordinary migration and interruption/resume still complete, with valid
  transaction records and existing final-path/parent symlink protections.

**Evidence:** extend the editable migration regressions, including an external
sentinel inventory comparison. Run `node --test tests/migrate-v5.test.js` and
the new regression file if separate. The external-sentinel regression must
fail on the reviewed implementation.

**Resolution record:** `node --test tests/migrate-v5.test.js
tests/rig-bootstrap.test.js` passed 38/38. Regression names include
`migration plan temp symlinks refuse without changing external, dangling, or
internal referents`, `a pre-existing regular migration temp file is preserved
and refuses the migration`, `migration temp creation is exclusive across a
symlink substitution race`, and `migration refuses a parent-directory
symlink substitution before writing outside`. The external-sentinel case was
red against the reviewed implementation because it followed/truncated the
link; it is green with unchanged file bytes, mode, and inventories. The shared
fix uses exclusive temp creation, verifies the opened inode and parent
directory identity before writing, and refuses collisions. Independent
correctness review confirmed the injected pre-open parent-symlink criterion.
The final publish now uses a no-clobber hard link and then removes the owned
temporary name. An injected parent-directory substitution immediately before
publication is refused and the outside sentinel inventory remains unchanged.
The exact-SHA remote download path is also checked by the clean-install E2E
script; exact-candidate platform runs remain open.

## Finding 2 — upgrade skips MCP finalization

**Problem:** `rig/bootstrap.sh` exits after successful migration before the
MCP setup and requested OpenClaw registration used by fresh installation.

Acceptance criteria:

- [x] Upgrade a v5-shaped active install without pre-installed MCP dependencies
  through the public installer/bootstrap path with `SETUP_MCP=1`. Exit zero
  only after the installed descriptor and required dependencies are usable.
- [x] Launch the upgraded server using `.rig/mcp-server.json`, complete the
  MCP handshake, and successfully call `rig_instructions`. Merely checking
  that files exist or comparing two payload projections is insufficient.
- [x] An explicitly requested `--openclaw-mcp` registration completes after
  upgrade, preserves unrelated configuration and is idempotent on retry. Test
  against a disposable OpenClaw config, never the operator's actual config.
- [x] Dependency-install or registration failure returns nonzero with an
  actionable error. Correcting the failure and rerunning completes setup;
  migration completion cannot leave a permanent success-without-setup state.
- [x] Finalization writes participate in existing ownership/recovery handling.
  Scoped uninstall restores pre-existing user content and removes attributable
  unchanged additions. Existing fresh-install and optional-setup behavior pass.

**Evidence:** add a regression at the public upgrade entrypoint, plus failure
and retry coverage. A focused test may stub external installation/registration
at the existing seam. Final integration evidence must use real dependency
downloads and an actual MCP call from the upgraded fixture, without borrowed
checkout dependencies. Run the migration and relevant installer/MCP tests.

**Resolution record:** `public v5 bootstrap upgrade finalizes MCP, retries
setup, registers OpenClaw, and uninstalls owned additions` passes in
`node --test tests/migrate-v5.test.js tests/rig-bootstrap.test.js` (45/45).
Its first public-path regression was red because the
migrated bootstrap returned before MCP setup; the later registration-failure
case exposed and fixed stale pending-ledger retry state. The shared bootstrap
now performs requested finalization after migration, and the OpenClaw cleanup
clears a pending registration only after confirming it is absent or removing
the exact attempted value. A dirty-tree real npm download run passed 1/1 at
`RIG_TEST_REAL_NPM=1 node --test --test-name-pattern='public v5 bootstrap upgrade' tests/migrate-v5.test.js`;
it exercises the actual descriptor launch, handshake, tool call, retry, and
uninstall. Independent re-review then found that `install.sh` unconditionally
overrode an explicit `SETUP_MCP=1` request while delegating to bootstrap. The
regression `public installer disables setup-only MCP on fresh install but
preserves explicit v5 upgrade request` was red before the fix and passes with
`node --test --test-name-pattern='public installer disables setup-only MCP'
tests/migrate-v5.test.js`. It verifies the fresh install still skips npm, a
public v5 upgrade leaves the journaled retry marker after an injected npm
failure, retry completes setup, and the installed server completes an MCP
handshake and `rig_instructions` call. `install.sh` now forwards the explicit
setup request; ordinary invocations still default to zero. The targeted
stubbed-dependency regression passes. The same public-installer integration
also passed with actual downloads and the real MCP call in a disposable target:
`RIG_TEST_REAL_NPM=1 node --test --test-name-pattern='public installer disables setup-only MCP' tests/migrate-v5.test.js` (1/1). An exact-committed-candidate rerun remains open.

## Finding 3 — eligibility omits macOS install proof

**Problem:** `.github/workflows/release-eligibility.yml` waits for Ubuntu
health only, while `.github/workflows/e2e.yml` contains the required
Linux/macOS clean-install matrix.

Acceptance criteria:

- [x] Eligibility invokes the reusable clean-install E2E workflow with the
  same resolved exact QA SHA used by health and the deployment checks.
- [x] The eligibility job depends on that E2E result. A failed, cancelled or
  skipped required matrix run cannot produce a passing eligibility artifact.
- [x] Both `ubuntu-latest` and `macos-latest` execute the existing real-download
  clean-install scenarios. Neither platform uses `continue-on-error` or an
  unconditional success fallback to satisfy eligibility.
- [x] Automated regression checks cover the dependency and SHA wiring. Show
  that a failed macOS result blocks success even when Linux/health passes,
  and that both passing platforms permit progression to the remaining checks.
- [ ] Attach successful run URLs and evidence artifacts for both platforms at
  the same final SHA before release eligibility is accepted. Keep the existing
  stale-QA checks and separate post-publication tag smoke test intact.

**Evidence:** add workflow dependency/condition coverage, using an existing
workflow test helper if available. Do not substitute tests of the health-issue
reporter for this check. Supply the actual Linux/macOS run results separately
from static workflow validation. QA-to-production eligibility is verified after
the approved candidate reaches QA; it does not require publishing a tag first.

**Resolution record:** `release eligibility requires exact-SHA Linux/macOS
clean-install E2E before artifact` passes in the 47/47 workflow/diagnostic/
release-blocker command recorded in the verification trace. It was red on the
reviewed workflow because eligibility had no E2E dependency. The reusable
workflow now receives the resolved SHA and is a required dependency; the
regression checks Linux/macOS matrix wiring and failed, cancelled, skipped,
and both-green outcomes, while preserving stale-QA checks and tag smoke.
Actual successful run URLs/artifacts for the final QA SHA remain open and are
required before accepting release eligibility.

## Finding 4 — successful named checks lose network warnings

**Problem:** `rig/lib/check-runner.js`, `runBinding`, discards diagnostics
from successful named/component checks; the caller can only render diagnostics
that survive aggregation.

Acceptance criteria:

- [x] Equivalent successful bare, named and component-command bindings with
  undeclared network capability all expose the compatibility warning through
  the normal check output/reporting path.
- [x] Multiple successful sub-checks preserve all distinct diagnostics without
  repeating the same compatibility warning for every sub-check. Render that
  warning once per service invocation.
- [x] A later failing sub-check, including a validation/coverage-gap failure,
  does not erase an earlier compatibility warning. Failure status, check
  identity, executed check IDs and counts remain accurate.
- [x] Local CLI output contains the warning; GitHub Actions output contains
  one correctly escaped warning annotation. The runner does not also print a
  duplicate warning directly.
- [x] Declared network capability retains its existing allowed/isolated
  behavior and does not emit an undeclared-capability warning.

**Evidence:** regressions must exercise named and component-command success,
mixed success/failure, and caller rendering. A bare-binding-only assertion
does not close this finding. Run the relevant check-runner and CLI tests.

**Resolution record:** `node --test tests/review-received-diagnostics.test.js
tests/release-eligibility-workflow.test.js tests/release-blockers.test.js`
passed 47/47. The five named cases are `Review Received F4: successful named
and component checks retain one compatibility diagnostic`, `Review Received
F4: a later failing named sub-check retains prior diagnostics and accurate
execution counts`, `Review Received F4: a later coverage gap retains earlier
diagnostics and check identity`, `Review Received F4: normal CLI and GitHub
output render named and component diagnostics once`, and `Review Received F4:
declared network denial does not emit compatibility diagnostics`. Initial
success and later-failure regressions failed because aggregation discarded
diagnostics; CLI output first failed to render them before exiting on later
failure. The shared runner now deduplicates and carries diagnostics and
execution metadata through failure results, and the caller renders before
exiting. Independent re-review confirmed the coverage-gap and installed CLI
criteria. All F4 implementation criteria are met.

## Additional findings from independent re-review

The four original findings did not cap review scope. These follow-up findings
have their own acceptance criteria; later findings must be recorded in the same
form before resolution.

### Finding 5 — migration final publication follows a changed parent

**Severity:** High. **Evidence:** `rig/lib/migrate.js`, `atomicJson`, at the
final publication of `.rig/migration.json`. A pathname rename could publish
through a substituted `.rig` symlink after the temporary file had been safely
opened, writing transaction data outside the target.

Acceptance criteria:

- [x] A deterministic test swaps `.rig` for an external symlink immediately
  before final publication; migration refuses and creates no external
  `migration.json`.
- [x] The external sentinel inventory and pre-existing external
  `migration.json.tmp` bytes remain unchanged.
- [x] Ordinary and interrupted/resumed migrations still pass.

**Evidence / resolution:** `migration refuses a parent-directory symlink
substitution at final publication` in
`node --test --test-name-pattern='final publication|parent-directory symlink
substitution' tests/migrate-v5.test.js` passed. It failed on the pathname-rename
implementation. Publication now uses an exclusive hard link, verifies parent
identity, removes only the link this transaction created, and refuses on a
changed parent.

### Finding 6 — setup-only MCP dependencies run without host output or opt-in

**Severity:** High. **Evidence:** `rig/bootstrap.sh`, fresh-install
`finalizeMcp` and migration host selection. Setup-only dependencies could
invoke npm even when the detected host emitted no MCP config, contrary to the
frozen default-install acceptance oracle.

Acceptance criteria:

- [x] Public fresh install with Claude detected but no explicit OpenClaw
  registration does not invoke npm or create an MCP descriptor.
- [x] Upgrade with `SETUP_MCP=1` and no MCP-emitting host skips setup-only
  dependencies.
- [x] Requested migration setup with emitted MCP config leaves a journaled
  pending marker on dependency failure, returns nonzero, then retries on a
  later public bootstrap invocation.
- [x] Explicit `--openclaw-mcp` behavior and frozen AT-HOME-1 still pass.

**Evidence / resolution:** `public fresh install with a detected MCP host does
not run npm without explicit OpenClaw opt-in`, `migration skips setup-only MCP
dependencies for a non-emitting host`, and `public v5 bootstrap upgrade
finalizes MCP, retries setup, registers OpenClaw, and uninstalls owned
additions` pass in the focused migration test command. The public fresh-install
regression failed when default setup was requested. The finalizer separates MCP
payload emission from setup-only dependencies; migration retries use an
attributable journaled marker.

### Finding 7 — ambiguous OpenClaw set/show failure strands retry state

**Severity:** High. **Evidence:** `rig/lib/openclaw-mcp.js`, failed
registration rollback and `pending` ledger handling. If `mcp set` changes the
config but returns failure and subsequent `mcp show` also fails, retry must not
mistake an absent config for proven rollback or overwrite an unknown user
value.

Acceptance criteria:

- [x] A test injects a failed `mcp set` and two failed `mcp show` probes; the
  ledger remains pending and retry succeeds once observation is available.
- [x] Retry preserves unrelated config and refuses conflicting ownership or
  changed user values.
- [x] Existing idempotent success and uninstall behavior pass.

**Evidence / resolution:** The injected pair is in `public v5 bootstrap
upgrade finalizes MCP, retries setup, registers OpenClaw, and uninstalls owned
additions`, passing in the focused migration test command. The ledger is
retained through both failed observations; the next invocation observes and
completes registration.

### Finding 8 — later missing service binding drops earlier diagnostics

**Severity:** Medium. **Evidence:** `rig/lib/check-runner.js`, `runChecks`
return path for a missing binding after a prior binding emitted diagnostics.
The direct failure return could drop earlier warnings.

Acceptance criteria:

- [x] A named regression runs a warning-producing check followed by a missing
  service binding and verifies diagnostics and failure/execution metadata.
- [x] Existing bare/named/component, coverage-gap, CLI, and GitHub annotation
  diagnostic tests remain green.

**Evidence / resolution:** `Review Received F4: runChecks retains an earlier
warning after a later missing service binding` passes in
`node --test tests/review-received-diagnostics.test.js`. It failed before the
direct return prepended accumulated diagnostics.

### Finding 9 — clean-install E2E does not download the exact candidate SHA

**Severity:** High. **Evidence:** `scripts/clean-install-e2e.js` exact-SHA
candidate path and `install.sh` candidate input. A local `git archive` test
does not prove the workflow downloaded and installed candidate bytes published
at the exact SHA.

Acceptance criteria:

- [x] For `--sha`, E2E downloads
  `https://github.com/<repo>/archive/<sha>.tar.gz` and records URL, SHA and
  archive digest.
- [x] Downloaded tree inventory is compared with a local archive of the same
  commit before scenarios run.
- [x] Each scenario asks the public installer to download that exact URL with
  expected SHA, archive digest, and extracted-tree digest; URL shape and both
  digests are validated before execution.
- [x] The public installer rejects a downloaded byte mismatch before archive
-  extraction, rejects a valid archive with a wrong tree digest, and accepts
  matching bytes/tree only; a stubbed-curl regression covers all cases.
- [ ] Successful Ubuntu and macOS workflow runs attach URLs and evidence
  artifacts for the same final QA SHA.

**Evidence / resolution:** `node --test tests/release-eligibility-workflow.test.js
tests/e2e/installer-artifact.test.js` checks SHA, URL, remote download, tree
comparison, digest enforcement and both-platform workflow wiring. Static checks
pass; runner evidence remains open until this commit is an authorized QA
candidate.

### Finding 10 — deployment docs claim checks the script does not perform

**Severity:** Low. **Evidence:** `wiki/topics/distribution-and-release.md`,
release evidence list. Earlier wording implied the deployment checker verified
documentation accuracy and branch protection despite having no such code.

Acceptance criteria:

- [x] Topic identifies automated gates and says docs accuracy and required
  check branch protection are owner checks.
- [x] A regression aligns those claims with the checker implementation and
  release policy.

**Evidence / resolution:** `release documentation distinguishes automated gates
from owner checks` in `node --test tests/deployment-policy-docs.test.js` checks
the wording and verifies the checker does not inspect branch protection or
documentation accuracy.

### Finding 11 — OpenClaw setup failure changes a pending ledger row

**Severity:** Medium. **Evidence:** `rig/lib/openclaw-mcp.js`, the setup
failure branch after an ambiguous registration attempt. A retry may correctly
allow a pending, absent server, then setup can fail; rewriting that row as
`applied` makes the next retry refuse the still-absent server.

Acceptance criteria:

- [x] Simulate failed `set` plus failed observations, then fail setup on retry.
- [x] The ledger remains pending, and after setup recovers the following retry
  succeeds while preserving unrelated OpenClaw configuration.

**Evidence / resolution:** `public v5 bootstrap upgrade finalizes MCP, retries
setup, registers OpenClaw, and uninstalls owned additions` passes in
`node --test --test-name-pattern='public v5 bootstrap upgrade'
tests/migrate-v5.test.js`. The regression failed when the setup catch changed
pending to applied. The catch now restores the original owned ledger row.

### Finding 12 — downloaded candidate digest is printed but not enforced

**Severity:** High. **Evidence:** `install.sh`, candidate URL download before
extraction. The installer previously printed the supplied archive's digest
without comparing it to the caller's expected bytes, so a second response
could execute different bytes after E2E had validated the first response. The
URL also needed a tree commitment tying its extracted bytes to the requested
SHA, because the GitHub archive URL alone is not a content attestation.

Acceptance criteria:

- [x] Stub the expected exact-SHA URL to return wrong bytes; installer exits
  nonzero before extraction or target mutation.
- [x] A matching downloaded archive is accepted, its exact expected digest is
  reported, and its bootstrap is invoked.
- [x] A valid archive with a valid byte digest but the wrong extracted-tree
  digest is refused before bootstrap; matching tree bytes are accepted.
- [x] URL shape and full SHA/digest syntax remain validated.

**Evidence / resolution:** `public installer verifies downloaded exact-SHA
candidate bytes before extraction` passes in
`node --test tests/e2e/installer-artifact.test.js`. The mismatch case failed
before extraction; the valid-byte/wrong-tree case failed before bootstrap; the
matching fixture completed successfully. The installer checks the archive
digest and extracted-tree digest before running bootstrap. E2E derives the
expected tree digest from the exact checked-out SHA and compares the downloaded
tree against that source first.

### Finding 13 — migration temporary unlink can follow a swapped `.rig` parent

**Severity:** Medium. **Evidence:** `rig/lib/migrate.js`, cleanup after
hard-link publication. If the parent pathname is replaced immediately before
temporary unlink, path-based cleanup can remove an external
`migration.json.tmp`.

Acceptance criteria:

- [x] Inject the parent swap immediately before temp unlink with a mode-0640
  external sentinel at `.rig/migration.json.tmp`.
- [x] Migration refuses, and the external inventory, sentinel bytes and mode
  remain unchanged.
- [x] The owned repository-root temp is removed and no external publication
  artifact remains before fixture cleanup.

**Evidence / resolution:** `migration refuses a parent swap at temporary
unlink without touching outside bytes` passes in
`node --test --test-name-pattern='parent swap at temporary unlink'
tests/migrate-v5.test.js`. The regression was red when the temp lived inside
`.rig`. The exclusive temporary record now lives beside the repository at
`.rig-migration.json.tmp`; publication checks the `.rig` parent after cleanup
and removes only the destination link created by the transaction on refusal.

### Finding 14 — interruption before migration record publication blocks retry

**Severity:** Medium. **Evidence:** `rig/lib/migrate.js`, exclusive temp
creation. A process stop after writing the complete temporary JSON but before
publishing `.rig/migration.json` left no resume record, while a rerun refused
any existing temp.

Acceptance criteria:

- [x] A subprocess exits after writing the full temp and before hard-link
  publication; rerun completes without manual cleanup.
- [x] A subprocess also exits immediately after publishing the final hard link;
  resume removes only the same-inode temp link and completes.
- [x] Final migration/onboarding markers and journal are valid, and no temp
  remains.
- [x] Unrelated, malformed or symlinked temp collisions remain
  untouched and are refused.

**Evidence / resolution:** `migration resumes a complete temporary record left
by process interruption` and `migration resume cleans the temporary hard link
left after publication` pass in `node --test tests/migrate-v5.test.js`. The
first run's process-stop regression left a valid record but the old collision
rule refused it; the migrator now adopts only a regular, byte-identical complete
record and resumes publication. On post-publication resume it removes only a
same-inode temp link. Other temp collisions are still refused.

### Finding 15 — an unowned MCP retry marker can trigger setup

**Severity:** Medium. **Evidence:** `rig/bootstrap.sh`, pending-marker retry.
Retrying merely because a marker path exists could let an unowned or edited
file trigger dependency installation or be deleted as though the journal owned
it.

Acceptance criteria:

- [x] A current install with an unowned marker refuses before invoking npm and
  preserves the marker bytes.
- [x] An edited owned marker refuses and is preserved.
- [x] An unchanged journal-owned marker retries setup and is removed only after
  setup completes.

**Evidence / resolution:** `public bootstrap refuses an unowned MCP retry
marker before running npm` and the edited-marker plus unchanged retry cases in
`public v5 bootstrap upgrade finalizes MCP, retries setup, registers OpenClaw,
and uninstalls owned additions` pass in
`node --test --test-name-pattern='unowned MCP retry marker|public v5 bootstrap upgrade|migration skips setup-only MCP dependencies'
tests/migrate-v5.test.js`. Retry now requires an applied journal record whose
digest matches the marker bytes, and removal supplies that expected digest.

### Finding 16 — clean-install E2E assumes default MCP setup

**Severity:** Medium. **Evidence:** `scripts/clean-install-e2e.js`, installer
invocation and subsequent `.rig/mcp-server.json` use. The ordinary public
install now skips optional MCP dependencies, so the required clean-install
workflow failed before its MCP handshake instead of exercising the intended
real-download scenario.

Acceptance criteria:

- [x] The E2E explicitly opts into MCP using `--openclaw-mcp` and confines
  OpenClaw config and HOME to its disposable work directory.
- [x] It preserves a pre-existing unrelated OpenClaw server and verifies that
  uninstall removes only the Rig server.
- [x] On a real dependency install, both fresh and existing repository
  scenarios complete the MCP handshake/tool call, approved service check, and
  byte-inventory uninstall comparison.
- [x] Regression `release eligibility requires exact-SHA Linux/macOS
  clean-install E2E before artifact` asserts the explicit option and isolated
  config path.

**Evidence / resolution:** the exact-candidate artifact run first failed because
the default install no longer wrote `.rig/mcp-server.json`. Adding the explicit
opt-in then exposed a clone-local identity sidecar in the full inventory; the
fixture now seeds that identity as pre-existing repository state before
comparing bytes. `node --test tests/release-eligibility-workflow.test.js`
passes. Both scenarios then passed against committed candidates using local
Git archives; the retained earlier result `.context/e2e-fff3a6b2.json` is
`provisional: false` for its recorded SHA. The final candidate rerun is
retained at `.context/final-candidate-e2e.json` with archive
`.context/final-candidate.tar.gz`. Both scenarios record real dependency
downloads, MCP handshake and `rig_instructions`, the approved service check,
and byte-inventory equality after uninstall. This is exact-commit local-archive
evidence, not a GitHub remote-download or Linux/macOS workflow result. The
focused real-npm public v5 upgrade test log is `.context/final-candidate-upgrade.log`.
The full verification record, including the final SHA and commands, is
`.context/final-candidate-verification.txt`.

## Renewed review of candidate 082d8467

Report-only review of `082d8467504d51aeda4ad955e78ee33c67ba548a` found the
following unresolved items. Earlier green regressions and local-archive E2E
remain evidence for that commit; they do not cover these new boundaries.
No implementation fix or binding review attempt was made during this review.

### Finding 17 — migration refusal deletes an external publication sentinel

**Severity:** High. **Evidence:** `rig/lib/migrate.js:397,411–412` at the
reviewed SHA. After the real hard link succeeds, replacing `.rig` with a
symlink can make `linkedStat` describe an unrelated external `migration.json`.
The refusal cleanup then deletes that file because its ownership comparison
uses the post-substitution pathname stat. This is distinct from swapping the
parent before publication or at temporary unlink.

Acceptance criteria:

- [x] Inject a parent swap immediately **after the real hard link succeeds,
  before its first pathname stat**, with a pre-existing external mode-0640
  `migration.json` sentinel. Migration refuses, and external bytes, modes and
  complete inventory remain unchanged.
- [x] Publication cleanup proves ownership against the exclusively opened
  temporary inode rather than learning ownership from a mutable destination
  pathname. It never removes an unrelated replacement destination.
- [x] Add this exact boundary to editable `tests/migrate-v5.test.js`. It is
  red on `082d8467` and green after the shared fix; ordinary migration,
  interruption/resume, pre-publication swap and temporary-unlink regressions
  remain green with `node --test tests/migrate-v5.test.js`.
- [x] Swap the repository root for a symlink to an external directory after
  publication but immediately before temp cleanup. Cleanup removes only the
  temp entry from the pinned original root and preserves an external mode-0640
  temp sentinel and complete outside inventory.
- [x] Inject a temp preparation failure, swap the repository root immediately
  before error cleanup, and prove the same descriptor-relative cleanup
  preserves the external sentinel and inventory.
- [x] Swap the repository root immediately before temp creation; create the
  temp relative to the original root descriptor and prove no empty temp or
  other file appears in the replacement external directory.
- [x] Replace the temporary entry with an unrelated regular file before Node
  verifies it; refusal preserves that file's bytes and mode. Failed validation
  leaves the temp entry for recovery instead of unlinking a mutable pathname.
- [ ] Replace the temp directory entry immediately before the successful
  Python `os.unlink` call, after the published record passes its inode check.
  Preserve the replacement's bytes and mode and do not report a successful
  migration that has deleted user data. A pinned directory descriptor alone
  does not establish ownership of its current entries.
- [ ] Apply the same preservation rule to interrupted-publication resume
  cleanup (`migrate` currently checks then unlinks the temp pathname). Add
  durable editable boundary regressions for both cleanup paths, red on the
  reviewed dirty candidate and green after correction; retain the full
  migration/interruption/uninstall coverage. An added pathname identity check
  before unlink does not close the replacement window.

**Renewed review, 2026-10-18:** still open. The parent/root fixes pass, but
`node .context/review-received-temp-entry-race.js` exits 1: swapping the temp
entry immediately before directory-relative cleanup deletes unrelated bytes,
and public migration reports `migrated`. The saved JSON records both the
atomic-helper and public migration seams with `userPreserved: false`.

**Reproduction:** `node .context/review-received-parent-race.js` exited 1 on
the reviewed implementation. Primary and independent reviewers reproduced it
separately in disposable fixtures. `.context/review-received-parent-race.json`
records `preserved: false`: the external inventory became empty despite a
recoverable refusal. The editable regression now covers the same boundary.

**Resolution record:** `atomicJson` pins the repository root and `.rig`
directory descriptors, then uses Python 3 standard-library `os.link` with
`src_dir_fd` and `dst_dir_fd`. A swapped path cannot redirect publication into
the replacement symlink target. On refusal, destination cleanup never performs
a mutable-path `lstat` followed by `unlink`. Cleanup uses Python 3
`os.unlink(..., dir_fd=3)` through the pinned root descriptor, so replacing the
repository-root path cannot redirect removal into an external directory. The
pre-link, post-link, parent, root-swap, temporary-unlink, substituted regular-
file and check/unlink race regressions cover external mode-0640 sentinels and
inventory preservation. Failed validation retains the temp entry because a
pathname check cannot make a later unlink conditional on inode identity. A
missing Python 3 executable fails closed before changing the installation;
the root descriptor is acquired before temp creation and remains pinned through
both preparation and publication cleanup. Python `os.open` with dirfd,
`O_CREAT|O_EXCL|O_NOFOLLOW` creates and writes the temp under that pinned root;
the node-side read verifies the open inode matches the descriptor-created
entry before publication.
The corrected parent-swap regression passes with the recoverable mode-0600 temp
left under the pinned root. The complete repository `npm test` passes on the
current implementation: its main Node suite reports 1,111 tests, 1,109 passed,
zero failed and two skipped, and includes the migration file.

### Finding 18 — interruption loses the upgrade's requested MCP setup

**Severity:** High. **Evidence:** `rig/bootstrap.sh:148–152,164–166,183` at
the reviewed SHA. Migration finishes and removes its recovery identity before
the finalizer records pending MCP setup. A process interruption in that gap
leaves a current install without a pending marker. The same command then
returns success through the current/fresh path, which disables setup.

Acceptance criteria:

- [x] Preserve requested upgrade setup durably before migration completion
  can erase the information needed to resume it.
- [x] Interrupt the public bootstrap immediately after successful migration
  and before finalization starts. Rerun the identical `SETUP_MCP=1` command;
  it completes requested setup instead of succeeding with absent dependencies
  or descriptor. Any unsuccessful finalization returns nonzero and remains
  safely retryable.
- [x] In the integration variant, use real dependency downloads and launch
  the retried install's descriptor, complete the MCP handshake, and call
  `rig_instructions`; checkout dependencies cannot substitute for installed
  dependencies.
- [x] Preserve ordinary fresh-install opt-in semantics, owned-marker checks,
  existing setup/registration failure retries and scoped uninstall behavior.
  Add the interruption boundary to editable `tests/migrate-v5.test.js`, show
  red on `082d8467`, then green in `node --test tests/migrate-v5.test.js` and
  the named `RIG_TEST_REAL_NPM=1` integration command.
- [x] Detect marker presence with `lstat`, including dangling symlinks; require
  a regular non-symlink file, open it with `O_NOFOLLOW`, verify the opened
  inode matches the inspected inode, and refuse while preserving matching-
  content and dangling symlinks without invoking npm.
- [x] Create a newly journaled pending marker with exclusive `O_CREAT|O_EXCL`
  and `O_NOFOLLOW` after the absent-path check, so a symlink inserted in that
  gap cannot receive bytes; cover the race with an external sentinel test.
- [x] Interrupt after the marker is exclusively created and closed but before
  its `applied` journal append. Retry recognizes only the exact byte-identical
  file owned by its pending create record, settles the record, closes that
  interrupted transaction, then completes migration and setup.

**Reproduction:** `node .context/review-received-upgrade-interruption.js`
currently exits 1. Its JSON/log record interruption status 73, retry status 0,
`install_kind: current`, and absent pending marker, descriptor and dependencies.
Primary and architecture reviewers reproduced the gap independently. Convert
this ignored boundary probe into the durable regression described above.

**Resolution record:** `public bootstrap retry preserves MCP setup intent
across interruption after migration` passes both stubbed and real-download
variants pass. The full migration suite also covers the non-emitting-host
reconciliation case, which clears an obsolete owned marker without npm,
descriptor or dependency creation. The stubbed public-bootstrap interruption
case and that reconciliation regression pass in `node --test
tests/migrate-v5.test.js`.
`RIG_TEST_REAL_NPM=1 node --test
--test-name-pattern='public bootstrap retry preserves MCP setup intent'
tests/migrate-v5.test.js` passes 1/1: the first process exits 73 after migration,
its journal-owned marker survives, and the identical retry installs real
dependencies, launches the installed descriptor, completes the MCP handshake,
and calls `rig_instructions`. Setup intent is now journaled before migration
starts. Retry detection uses `lstat`; reads require a regular non-symlink file
opened with `O_NOFOLLOW` whose descriptor identity matches the inspected inode.
New marker creation uses the journal writer's exclusive no-follow create path,
so absence-to-create substitution cannot write through an inserted link. The
editable marker-link tests preserve external sentinels and do not invoke npm.
If interruption lands after marker bytes are written but before the journal's
`applied` append, retry reopens only a regular non-symlink file whose descriptor
identity and bytes match the pending create record, appends `applied`, and
finishes that journal transaction before migration resumes. The dedicated
`public bootstrap retry settles an exclusively created MCP marker after
interruption` regression and the complete `npm test` gate pass.
If interruption lands after marker bytes are written but before the journal's
`applied` append, retry reopens only a regular non-symlink file whose descriptor
identity and bytes match the pending create record, appends `applied`, and
finishes that journal transaction before migration resumes. The dedicated
`public bootstrap retry settles an exclusively created MCP marker after
interruption` regression passed; its prior behavior failed first with an
unowned-marker refusal and then with an open-journal refusal after marker
reconciliation.
If a
retry selects a non-emitting host, current-install recovery clears the stale
owned marker without npm, descriptor or dependency creation; that regression
passes. Fresh-install behavior remains covered.

### Finding 19 — normative design describes the removed installed shelf

**Severity:** Medium. **Evidence:** `wiki/gate2/technical-spec.md:9–15,
2415–2419,2462–2466,2566` at the reviewed SHA. The designated current design
requires every installation to materialize 55 vendored skills and describes
eight mandatory projections. The branch's amended signed contract and actual
payload instead stage zero optional skill trees and project nine native skills,
with third-party fetching during approved onboarding. Following the stale
technical authority would restore behavior contrary to the owner decision.
`wiki/specs/close-everything/06-clean-install-e2e.md:58–62` likewise describes
default `--sha` as a local archive rather than the new remote-download flow.

Acceptance criteria:

- [x] Update the current technical approach, release conditions and acceptance
  traceability to match pinned fetch metadata, approved onboarding downloads
  and current mandatory discovery. Clearly label any retained former design
  as historical so it cannot govern current delivery.
- [x] Describe default `--sha` remote download, source-tree comparison and
  archive/tree commitments accurately; distinguish explicit local `--artifact`
  evidence and post-publication `--tag` smoke tests.
- [x] Preserve the signed oracle and settled owner decisions. Run
  `node scripts/check-advanced-spec.js` and
  `node --test tests/deployment-policy-docs.test.js tests/path-b-catalog.test.js`;
  add an editable documentation consistency check that catches these current
  normative claims without treating historical source text as current policy.
- [ ] Correct the remaining source-archive claim at
  `wiki/gate2/technical-spec.md:2480–2481`: the GitHub source release includes
  tracked `rig/catalog/skills/` reference trees; the installed payload stages
  zero optional trees. Describe both accurately, matching the distribution
  hub, and keep the editable docs/catalogue suite green. Verify archive
  contents with `git archive HEAD rig/catalog/skills | tar -tf -`.

**Evidence:** primary and scope reviewers ran
`node --test --test-name-pattern='AT-PB-3 install pins' tests/path-b-catalog.test.js`
(1/1 pass). Its assertions require zero staged optional trees and nine mandatory
native skills. On `origin/qa-prod`, the assertions instead required 55 and eight,
confirming that this branch's delivery change introduced the design mismatch.
The current technical design and clean-install interface now describe zero
staged optional trees, nine mandatory native entry skills, approved pinned
upstream fetching, default exact-SHA remote archive/tree comparison, explicit
local `--artifact`, and separate post-publication `--tag` smoke. Historical
installed-shelf rationale is labelled non-governing. The editable consistency
test is `current design and clean-install docs match the pinned-fetch release
model`; `node --test tests/deployment-policy-docs.test.js
tests/path-b-catalog.test.js` passes 12/12, and
`node scripts/check-advanced-spec.js` verifies the signed 16-file, 95-case
oracle.

### Finding 20 — documentation verification and completion claims overstate evidence

**Severity:** Low. **Evidence:** `wiki/index/quick-reference.md:29–30,35–36,39`
at the reviewed SHA contains six stale size hints. Fresh
`node scripts/check-size-hints.js` exits 1, despite the approval checklist
claiming this check passes. The checklist also said all four criteria groups
were satisfied while same-SHA Linux/macOS evidence was explicitly open.

Acceptance criteria:

- [x] Refresh size hints after all wiki edits with
  `node scripts/check-size-hints.js --fix`; verify
  `node scripts/check-size-hints.js` exits zero on the final candidate.
- [x] Regenerate indexes using `node scripts/build-wiki-index.js`, then pass
  `node scripts/check-wiki-index.js` and `node scripts/check-wiki-budget.js`.
- [x] Mark only demonstrated criteria complete. Keep new findings and actual
  both-platform remote evidence open until their own checks pass; distinguish
  implementation regression completion from release eligibility and approval.

**Evidence:** before this review's documentation edits, six hints failed:
onboarding (two references), trust boundaries, distribution, review receipts and
status. The final checklist below is reopened; the implementation agent must
renew final-byte evidence after correction. Review-only notes do not fix the
underlying candidate or establish passing size-hint verification.
After the corrections, size hints were refreshed with `node scripts/check-size-hints.js
--fix` and the plain checker passes. `node scripts/build-wiki-index.js`,
`node scripts/check-wiki-index.js`, and `node scripts/check-wiki-budget.js`
also pass. The coherence gate and complete `npm test` gate pass on the local
candidate: 1,111 main tests (1,109 passed, two skipped), 15 Pi-extension tests,
and six MCP tests. Exact-QA Linux/macOS runs, final-candidate review/receipt
and owner-controlled delivery remain open below.

### Finding 21 — substituted source entry is published as a corrupt migration record

**Severity:** Medium. **Evidence:** `rig/lib/migrate.js:513` on the uncommitted
follow-up candidate links the temp basename after its last identity check.
Replacing that entry immediately before Python `os.link` publishes unrelated
bytes as `.rig/migration.json`. The later identity check refuses, but the next
identical migration refuses with `migration-corrupt`. Directory descriptors
pin the parent directories, not the source entry selected by `os.link`.

Acceptance criteria:

- [ ] Inject replacement of the source temp entry immediately before the real
  directory-relative hard link. Do not publish unrelated bytes as a trusted
  migration record; preserve the replacement's contents and mode, and preserve
  external inventory. The protected publication must bind to the validated
  record, rather than relying on an earlier pathname check.
- [ ] After that interruption/refusal, demonstrate safe recovery from valid
  owned state without a corrupt record created by migration. Keep normal
  no-clobber publication, parent/root substitution, interruption and uninstall
  behavior passing; never delete a replacement to make the test pass.
- [ ] Add an editable regression at the actual publication seam, show it red
  on this dirty candidate and green on the fix, then run
  `node --test tests/migrate-v5.test.js`. A test observing only Node
  `fs.linkSync`/`fs.unlinkSync` cannot exercise the new Python syscall boundary.

**Reproduction:** `.context/review-received-temp-entry-race.json`, public
migration publication case: `userPreserved: true`, `wrongRecordPublished:
true`, first result `refused/conflicts`, retry `refused/migration-corrupt`.
The standalone probe uses disposable fixtures and saves this case alongside
Finding 17's deletion case. This is advisory review evidence, not a binding
release receipt.

## Conditions for approval

Follow the ordered [change-management policy](../../../rig/corpus/standards/change-management.md).
Completing these findings permits renewed review; approval still requires the
reviewer's assessment and the existing release evidence.

- [ ] Each finding has passing regression evidence and a written resolution
  tied to the final candidate, including findings 17–21. Implementation
  regressions and outstanding platform evidence are tracked separately.
- [ ] Commit the complete candidate, including documentation corrections and
  regenerated wiki indexes. The working tree is clean; no concurrent writer
  changes publishable bytes during verification.
- [ ] `node scripts/check-advanced-spec.js` verifies the signed oracle. Run
  `npm test` on the final bytes and retain the complete successful log.
  The saved successful output at `.context/npm-test-final.log` reports 1,111
  main tests, 15 Pi-extension tests and six MCP tests.
- [ ] Obtain exact-commit clean-install evidence, including the upgrade MCP
  scenario above. Provisional dirty-tree snapshots and earlier commits do not
  count. Record the commit SHA, commands, results and artifact locations.
- [ ] Obtain a fresh passing wrapper-authored review receipt on those same
  publishable bytes before delivery. Preserve the existing author context and
  attempt state (one prior failure); use the already designated reviewer.
  Do not reset the counter, fabricate a receipt or consume the remaining
  binding attempt during implementation.
- [x] Versions, tracker declarations, changelog, documentation, generated wiki
  indexes, budgets, size hints and rule copies pass their existing checks.
- [ ] Through the owner-controlled delivery process, push the same candidate
  to the existing PR and require green checks on its exact head, including
  required `gate1-pin` protection. Confirm the required-check configuration
  through an authorized account; an HTTP 403 is not verification.
- [ ] An eligible independent reviewer approves the PR. The PR author cannot
  self-approve. Review/comment publication currently fails with HTTP 403;
  an authorized account must submit the review after the fixes are accepted.

After QA merge, the owner runs exact-QA health and both-platform install
eligibility before production promotion. Tag/release, tagged-download smoke
and tracker closure follow in the existing policy's order. This handoff does
not authorize an agent to perform owner-only delivery steps.
