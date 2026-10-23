# Codex binding review: acceptance criteria for all eighteen findings

This is the closure checklist requested by the owner for the
[October 21 rejected review](../../sources/reviews/v6.0.0-2026-10-21-code-mode.failed.review.json).
Finding numbers below are the original JSON array order, starting at one.
The source findings remain unchanged. None is closed by authoring this page.

## Authority, scope and what earns approval

The user is a repository maintainer who needs Rig's approval, execution,
checking and removal guarantees to hold on the commands they actually use.
Success means the eighteen reported gaps are demonstrably closed, with no
quiet bypass through a compatibility CLI, installed runner, MCP call or CI.
This checklist is the acceptance oracle for remediation; writing it did not
close findings or authorize another binding review.

The criteria below interpret the current [signed acceptance contract](../../gate1/acceptance.md),
[business specification](../../gate1/business-spec.md), locked owner decisions
and [working technical specification](../../gate2/technical-spec.md). They do
not amend those authorities. Additional adversarial cases below are derived
verification examples of existing guarantees, not new product features.
Frozen tests and documents remain untouched; if stronger frozen coverage is
needed, prepare one owner-reviewable amendment for the key holder to apply
and sign. No new trust root, recovery mechanism, universal host-hook adapter
programme, or outside-repository manual install gate is required.

**Approval commitment:** I will close each finding when its listed behavior
and proof are verified on the candidate. Closing all eighteen, preserving
the remaining signed acceptance behavior, and passing the existing automated
gates is sufficient for my approval of this reviewed scope. I will not add
style preferences, speculative capabilities or a previously accepted owner
decision as new closure conditions. A genuinely new defect or regression
must be identified separately with a reproduction and its own bounded
criteria; it cannot silently change these criteria.

For every finding, supply:

- The fix or a specific, evidenced refutation of the exact reviewer claim.
  A refutation must trace the current shipped entry point and prove the
  disputed behavior against the current contract. “Legacy,” “unused,” or
  “the tests pass” alone does not refute a reachable bypass. A replaced or
  removed path needs a written reason and a proven supported replacement;
  required capability and the one-release flag compatibility remain covered.
- Runnable regression cases at that entry point, their exact command and
  observed result, and the candidate commit/worktree digest. Tests may use
  isolated fixture repositories, fixture signing keys and harmless sentinel
  data; an injected verifier that always returns true cannot prove consent.
- A working positive case and the named negative cases. At least one
  meaningful guard-removal or pre-fix failure demonstrates that the regression
  can catch the defect. Static presence checks and mocked success are not
  substitutes for execution, filesystem, signature or network observations.
- The final paths of the relevant tests and evidence, plus any updated
  design/operator claims. Test filenames are selected during implementation;
  this document does not claim that the new regressions already exist or pass.

## 1. Public apply cannot accept forged approval

**Original severity:** blocker. **Anchor:** `rig/lib/apply.js:134–150`,
`rig/lib/cli-advanced.js` apply. **Basis:** AT-PRESENCE-2, AT-SHAPE-1,
AT-PB-5 and the one-trust-root owner decision.

Pass criteria:

- Every shipped apply entry point verifies an actual signature against the
  Gate 1 key and expected identity, bound to the exact current proposal/plan,
  repository and required approval context before any approved target write.
  Caller-supplied digest equality, method names and `verified: true` confer
  no authority. An unverifiable host-native assertion is refused.
- Missing, fabricated, altered, wrong-key, wrong-identity, wrong-purpose,
  cross-repository and stale-plan approvals fail without applying changes.
  Another signer list, trust record or recovery registration cannot authorize
  them. Directly invoking the exported apply function cannot skip this check.
- A valid fixture Gate 1 signature applies exactly the approved changes,
  preserving unrelated bytes and the required journal/resume semantics.

Required proof: invoke the public CLI and its shared apply seam with the
forged JSON shape from the finding, then with real valid and invalid fixture
signatures. Compare target bytes before/after each rejection; demonstrate
that bypassing signature verification makes the forged case fail its test.

## 2. Remediation needs verified consent and a real transaction

**Original severity:** blocker. **Anchor:** `rig/lib/apply.js` remediate and
the public remediation CLI. **Basis:** AT-B6, AT-PRESENCE-2 and the
technical design's remediation transaction.

Pass criteria:

- Proposing remediation is read-only and names the exact changes and current
  input hashes. The proposal's publicly computable hash alone never grants
  consent; the real Gate 1 approval authorizes only that exact proposal.
- At the write boundary, recheck every input preimage and relevant policy
  state under transaction exclusion. Missing approval, changed input,
  changed proposal, unsupported operation, escaping path or a no-op is
  rejected before any target mutation. Concurrent remediation cannot
  overwrite another operation's unapproved state.
- A successful observed diff equals the approved diff. A partial remediation
  failure rolls back its target changes, preserves unrelated/user edits and
  reports failure. Durable transaction evidence identifies attempted,
  completed, rolled-back or interrupted work so a crash cannot become an
  unrecorded success. This rollback rule is for remediation; installation
  still follows its separate keep-applied-writes-and-resume contract.
- Re-run actual sanitation after applying the approved changes. Return the
  fresh verdict and remaining findings; never label the harness clean from
  successful writes alone.

Required proof: public propose/approve/remediate flow with a digest-only
forgery, stale input, no-op, two competing attempts, a failure after the first
write, and a killed process. Verify exact diffs, rollback/recovery evidence
and a real rescan that can still reject an incompletely remediated harness.

## 3. Zero executable checks cannot become a successful service run

**Original severity:** major. **Anchor:** `rig/lib/check-runner.js`
`runBinding`. **Basis:** AT-SHAPE-5 and AT-P6.

Pass criteria:

- `{checks:{}}`, `{checks:{missing:{}}}` and
  `{checks:{empty:{commands:[]}}}` each produce a named, nonzero coverage gap.
  Missing/empty argv, malformed command records and a mixed valid/invalid
  check map cannot silently skip the invalid required checks and pass.
- Existing generic-success/no-op rejection holds for every supported binding
  shape. Report executed check identities and counts from actual launches;
  zero launches cannot substantiate an executable-service pass.
- A real repository-adapted command may succeed or fail normally; quiet
  successful output is allowed when actual execution is evidenced. Only an
  explicitly justified convention or surfaceless disposition may take its
  contractually defined non-executable path, with its specific reason visible.

Required proof: run all three reported inputs through the shared runner and
the installed check entry point, together with a real command whose observed
behavior changes between passing and failing fixture input. Removing the
empty/malformed guard must make the negative regression fail.

## 4. Approval and drift checks must govern actual execution

**Original severity:** blocker. **Anchor:** `rig/lib/lint-format.js`
`executePlan`, `runGrade`, `runReadOnly`; `rig/lib/check-runner.js`.
**Basis:** AT-LF-5, AT-LF-14, AT-LF-20 and AT-PRESENCE-2.

Pass criteria:

- Selection, planning and an unapproved run launch no repository task. A
  successful approved execution really runs exactly the listed commands,
  components and working directories and records the observed outcome;
  returning `executed` without launching them is not success.
- The real dispatch boundary verifies the current plan and its signature and
  consumes its single-use authorization atomically with dispatch. A repeated,
  cloned, serialized, restarted-process or concurrent presentation cannot
  authorize a second execution. A fresh approval can authorize a later run.
- Changing the task definition, referenced executable/script, configuration,
  component, working directory or other approved binding input stops before
  that task runs. Report the drift and require rediscovery and fresh approval;
  neither the changed command nor stale approved text runs as a fallback.
- All shipping routes to repository-owned lint tasks obey the boundary,
  including installed Policy/Context/Evidence and CI routes. Setting `CI`
  or calling a lower-level runner is not authorization. Reconcile design
  text that exempts a route without authority from the signed contract.

Required proof: use harmless task launch observations through each distinct
shipping dispatch route. Show zero launches without approval, the exact
launches with one valid approval, at most one execution under two competing
processes, rejection after restart, and zero launches after command drift.
Calling only the detached approval helper does not close this finding.

## 5. Untrusted tasks cannot escape the filesystem or environment boundary

**Original severity:** blocker. **Anchor:** `rig/lib/spawn-guarded.js`
network sandbox and `rig/lib/lint-format.js` task spawn.
**Basis:** AT-LF-21, AT-LF-24 and business-spec D28.

Pass criteria:

- A task actually launched through the shipping runner cannot read or write
  out-of-repository data using an absolute path, parent traversal, an escaping
  repository symlink or a symlinked working directory. The sandbox must
  constrain the running process and its descendants; validating only the
  top-level cwd/argv does not suffice. Any runtime/toolchain access needed
  to launch the tool must not expose arbitrary user or credential files.
- Refuse escaping symlink read/write/cwd operations with a boundary failure.
  An ambient parent-process credential/environment sentinel is absent unless
  its variable is explicitly allowlisted; the allowlist itself cannot become
  an automatic grant to secret-bearing ambient state.
- Legitimate in-repository commands still run under the enforced boundary.
  If the required isolation facility is missing or cannot enforce the
  contract, refuse the task with a named unavailable state and setup guidance;
  do not execute unrestricted or claim isolated success.

Required proof: real task attempts against harmless outside read/write
sentinels, direct and symlink paths, child processes and an ambient variable,
plus a permitted in-repository task. Observe denied access and unchanged
outside bytes on each claimed runtime platform; an available network-only
sandbox is insufficient. Evidence of missing facilities must remain a gap,
not substitute for the positive isolated execution case.

## 6. Omitted network declaration must deny task network access

**Original severity:** major. **Anchor:** `rig/lib/check-runner.js`
`runConfiguredArgv`. **Basis:** AT-LF-22, AT-LF-5 and AT-BASE-2.

Pass criteria:

- Missing network fields on both ordinary and generated component bindings
  mean no outbound connectivity. No compatibility branch launches an
  undeclared command unrestricted; malformed declarations fail visibly.
- A network connection is possible only under the exact approved command's
  explicit grant and applicable activated policy. A caller-added field or
  merely committed policy file cannot manufacture user approval or widen it.
  Existing capability/resource constraints remain enforced.
- When isolation is unavailable, return the named non-passing gap without
  launching the task unrestricted. Diagnostics, docs and generated bindings
  match this behavior rather than advertising temporary default allowance.

Required proof: a real local listener and the installed runner show no
successful connection for omitted and explicit-deny fields, a successful
connection with a valid explicit grant, and no unguarded launch when the
isolation mechanism is unavailable. Repeat the missing-field case with a
binding produced by apply, not just a hand-written test binding.

## 7. Discovery, user choices and scope must reach the executed command

**Original severity:** major. **Anchor:** `rig/lib/lint-format.js`
discovery/selection/scope and `rig/lib/lint-grade.js` installed execution.
**Basis:** AT-LF-1–4, AT-LF-10, AT-LF-19 and locked agent-led adaptation.

Pass criteria:

- The agent-led inspection/proposal flow exposes nested components and an
  unfamiliar ecosystem from repository evidence, without restricting the
  product to a fixed language/tool roster. Deterministic code inventories and
  validates; the host agent owns semantic discovery and command choice.
  Unknown components remain visible as gaps instead of silently disappearing.
- A declared task with a non-standard name can be bound by its actual role;
  an ambiguous role requires user choice. Existing user tools/configuration
  survive unless the exact replacement/setup change is approved.
- Deselected components are absent from the applied bindings and all actual
  runs. The chosen scope survives plan creation, apply, reinstall and
  installed execution; no later helper regenerates the recommendation over it.
- A default local run checks only changed, non-ignored files in the correct
  component cwd. Demonstrate the actual target set, not a scope label beside
  an unmodified `eslint .`/`prettier --check .` command. An unsupported scoped
  binding becomes a visible gap rather than silently widening. Explicit
  whole-repository/eligible CI execution uses its stated whole scope.
- Excluded/uncovered components and the limits on aggregate support remain
  visible; their exclusion cannot create a whole-repository support claim.

Required proof: install from a multi-component fixture containing an
unfamiliar nested component, non-standard and ambiguous declared tasks,
changed/clean/ignored files and a deselected component. Observe actual file
targets/cwd through public local and eligible CI execution after apply and
resume; include a filename containing spaces to catch unsafe argument binding.

## 8. Every read-only execution route detects mutation and abnormal failure

**Original severity:** major. **Anchor:** component `check.commands` route in
`rig/lib/check-runner.js`; `rig/lib/lint-format.js` `runReadOnly`.
**Basis:** AT-LF-7, AT-LF-11, AT-LF-15 and AT-LF-16.

Pass criteria:

- Before/after observations surround actual read-only task execution on
  installed Policy, Context, Evidence and eligible CI paths, including both
  bare-command and component-command binding shapes. No route avoids the
  guarantee by selecting a lower grade or CI mode.
- A task that changes bytes, mode, creates or deletes a path causes a
  non-passing mutation result with exact paths and before/after evidence.
  Stop before the next planned command, preserve the changed tree and
  evidence, and never automatically restore or continue.
- A nonzero exit, signal or other abnormal end is reported as such rather
  than `clean`. A clean result requires observed completion and no mutation;
  required output redaction and local-only evidence still apply.

Required proof: a two-command installed plan whose first command mutates and
whose second has an observable harmless effect. Prove the mutation is
reported, preserved and prevents the second launch. Repeat for each distinct
dispatch implementation and cover a non-mutating nonzero/signalled task.

## 9. Path B lint-format must exercise the promised service and grade

**Original severity:** major. **Anchor:** `rig/lib/service-catalogue.js`
`bindServices`/`runNativeService` and canonical lint-format check definitions.
**Basis:** AT-SHAPE-3, AT-SHAPE-5, AT-LF-7–9 and AT-P6.

Pass criteria:

- Approved Path B selection and installed execution of lint-format at Policy
  runs real repo-adapted lint/format checks on the stated input. Nonempty
  command strings and `autofix_during_check: false` alone cannot pass it.
- Invalid source that the configured real checker rejects fails the selected
  service; corrected input passes. Missing/nonexistent commands are named
  nonzero gaps with setup guidance. Convention/configuration checks may
  supplement but cannot replace the required executable lint-format vertical.
- A requested Context grade preserves completed Policy work and adds a valid
  request-bound semantic review; Evidence adds actual independent replay and
  a verifiable receipt bound to inputs and review. Missing, stale, mismatched
  or failing evidence cannot become a claimed higher-grade pass. Expose the
  completed lower grade and the higher-grade gap honestly.
- The catalogue's grade/coverage wording matches these outcomes. Do not
  invent Context/Evidence or remove required Policy behavior to make the
  configuration-only path look sufficient.

Required proof: use the approved install/onboard/select/apply/check flow with
a real checker, a nonexistent executable and bad/good source. Exercise
Policy, missing/valid Context and mismatched/valid Evidence through the
installed service path; validate the resulting receipt's bindings.

## 10. Installed git and CI gates run the enabled baseline

**Original severity:** major. **Anchor:** `rig/catalog/baseline/check.js`,
`rig/lib/guard.js` pre-commit shim and `rig/lib/checks.js`.
**Basis:** AT-B1–4, AT-BASE-4–6, AT-B7, AT-CI-3 and AT-LF-13.

Pass criteria:

- A real commit through the installed hook runs the enabled staged-harness
  sanitation, exact-copy and deterministic staged-secret floors, selected
  applicable checks and preserved user hook according to the documented
  ordering/failure contract. It must not reduce the baseline to one secret
  script. Semantic drift runs at its required enabled surface with current
  review evidence. A CLI helper that the installed hook never invokes is
  insufficient.
- The actual installed CI command runs all enabled repo-applicable baseline
  controls and selected services in dependency order. Lint-format runs there
  at Evidence only; a pre-existing Rig CI job does not cause Policy/Context
  lint-format execution. Failed dependencies remain visibly not run.
- Both dispatchers load verified active policy and honor disabled leaves and
  disabled enforcement surfaces. They neither run nor claim protection for
  disabled/unrun checks. Invalid policy fails closed; no caller-controlled
  policy object can override activated permissions.
- Disable/re-enable invalidates previous protection evidence. Results bind
  the current policy, enablement generation, implementation, input and
  control/surface, and a re-enabled control remains pending until a fresh
  check actually runs. Local/development checks default to diff/staged scope;
  CI uses repository scope.
- Host axes Rig does not integrate remain explicit `not_integrated` gaps
  under the locked decision; this finding does not require new adapters for
  every host or permit a Rig-owned declaration to count as an emitted hook.

Required proof: install into a fixture repository and invoke real `git
commit` and the emitted CI command. Independently seed sanitation, exact-copy,
semantic-drift and secret failures; observe each required control deny or
report its actual gap. Repeat with signed control disable/re-enable,
pre-existing user hook and each lint-format grade. Check actual command
execution and evidence generations, not just generated script substrings.

## 11. Scan staged bytes and require current semantic review evidence

**Original severity:** major. **Anchor:** `rig/lib/git-dispatch.js`
`stagedHarnessFiles`/`runPreCommit`; `rig/lib/checks.js` `semanticDrift`.
**Basis:** AT-B2, AT-B4, AT-BASE-6 and technical-spec §8.8.

Pass criteria:

- Commit-time sanitation reads the Git index content that will be committed,
  not the working-tree version of a staged filename. A clean unstaged edit
  cannot conceal malicious staged content. Enumeration handles repository
  filenames safely, including spaces/newlines and the relevant rename/delete
  cases; an index-read failure is not a clean scan.
- Staged sanitation uses the same authoritative detection/verdict contract
  as adoption/remediation, rather than a smaller private regex that omits
  required findings. Uncertain/unverifiable content remains a gap or
  quarantine as prescribed; it cannot silently become ALLOW.
- Enabled semantic drift requires structured host-agent review of the
  current relevant contexts and relationships. Missing, malformed,
  note-only, failing or stale review is non-passing. Review input digests
  actually match current content; a nonempty digest string does not suffice.
- A known contradiction between two unmarked, non-identical context fixtures
  is found by the semantic review flow even without a deprecated marker or
  magic phrase. The host agent supplies semantic judgment; deterministic
  validation binds and validates its evidence rather than pretending a
  keyword list establishes semantic consistency.

Required proof: stage a harmful harness, replace its working-tree content
with safe text and attempt a real commit; it is denied. Reverse the staged
and unstaged contents to prove which bytes were scanned. Exercise the known
contradiction and missing/stale/altered review cases through the enabled
installed check, with input hashes recomputed from the actual fixture bytes.

## 12. Policy publication and one-use action dispatch are atomic and signed

**Original severity:** major. **Anchor:** `rig/lib/policy.js` activation and
`grantApproval`; `rig/lib/enforcement.js` `consumeOneUseApproval`.
**Basis:** AT-BASE-4–7, AT-PRESENCE-2, AT-HOST-2 and technical-spec §8.

Pass criteria:

- Concurrent activations based on the same prior policy/sequence cannot
  both succeed or overwrite a later activation. Recheck the prior state at
  the exclusive commit boundary; only the correctly signed exact candidate
  becomes current.
- Active policy and receipt are published with recoverable transaction
  semantics. At every interruption point readers either use a matching
  verified revision or report a non-passing incomplete state; they never
  accept a mixed or unsigned pair. Recovery deterministically restores or
  completes the approved revision without losing a newer user choice.
- Temporary/transaction files cannot follow a pre-created attacker symlink
  or overwrite unrelated files; creation and replacement preserve their
  required ownership/mode and fail safely on collisions.
- An action grant requires real Gate 1 authorization bound to the unchanged
  action/repository and relevant current context. Unsigned grant files,
  `used: false`, cloned objects or a new process cannot mint or reset it.
  The shipping action dispatcher atomically consumes persistent one-use
  state; at most one competing process dispatches the action. Revoked,
  altered and consumed grants are refused. Activated permanent policy
  choices retain their separately specified precedence.

Required proof: two processes activate distinct signed candidates from one
prior state; exactly one wins. Interrupt between each publication step and
exercise recovery/read behavior. Pre-create a temporary-path symlink to an
outside sentinel. Race two public action dispatches against one real signed
grant, then retry a cloned grant after process restart: at most one actual
action occurs, with the signed legitimate first-use case still working.

## 13. CI integration preserves valid configurations and earns verification

**Original severity:** major. **Anchor:** `rig/lib/ci-adapters.js`
`detectProvider`, `mergeExisting`, `planCiIntegration`.
**Basis:** AT-CI-1–4 and the existing six-provider contract.

Pass criteria:

- Classification validates the actual provider configuration and supported
  merge shape. An explicit provider option is not permission to bypass
  malformed/unknown/colliding configuration checks. Unknown or unsupported
  shapes fail visibly with original bytes unchanged.
- Approved integration into supported existing configuration is additive,
  preserving every unrelated job/value, valid structure and user hook.
  GitLab text concatenation cannot create duplicate/conflicting keys, and
  Jenkins cannot receive a second incompatible pipeline. A second apply
  creates no duplicates or material rewrite; removal reverses only Rig's
  attributable addition and preserves later user changes.
- Absent CI creates nothing until provider selection and exact approval.
  Emitted jobs run the real installed repo-scope gate, use only necessary
  permissions, require no repository secrets, and preserve local-only
  findings and active-grade applicability.
- `integrated`/emitted is distinguishable from execution-verified. A provider
  integration is not called verified until its first actual provider run
  executes the emitted job successfully. Parse/render tests or a mocked
  executor cannot replace that evidence; failed/unavailable provider runs
  remain explicitly non-verified with the remaining setup named.

Required proof: valid and malformed/unknown/explicit-provider fixtures for
each of the six claimed CI adapters, parsing the complete result and deeply
comparing unrelated state. Include the reported GitLab/Jenkins edge shapes,
repeat apply and remove. Attach the real first-run job identity, candidate
SHA, invoked command and result for each provider execution claim; a missing
run is recorded as missing, not certified by an emitted-text test.

## 14. No output route leaks findings or collapses abnormal endings

**Original severity:** major. **Anchor:** `rig/lib/checks.js` `runChecks`,
check CLI, staged guard, installed copy-check errors and `rig/lib/reports.js`.
**Basis:** AT-SECRET-1, AT-REPORT-1, AT-LF-15 and AT-LF-16.

Pass criteria:

- With model-assisted triage disabled, matched credential content never
  reaches agent-visible return objects, stdout/stderr, thrown exceptions,
  external scanner inherited streams or diagnostics. Apply the boundary
  before publication, including copy-check and early-failure paths; redacting
  only the report writer does not close other routes.
- Local reports remain ignored, actionable and redacted for secret/PII and
  host-rooted data. In CI the emitted output contains only verdict, counts
  and safe rule identities, without finding detail or report uploads.
  Routine passes are omitted; failed, vacuous, coverage-gap and dependency
  not-run states remain distinguishable where the contract requires them.
- Only exact, disclosure-bound, verified active user opt-in opens the
  model-assisted matched-content field. A plain edited boolean cannot open
  it, and deactivation/stale or invalid activation closes it immediately.
  This opt-in does not authorize printing finding detail in CI logs.
- Induced `timeout`, `cancelled`, `missing_dependency`, `signalled`,
  `partial_output` and `command_not_found` each retain a distinct reported
  non-passing state from task result through local report and public outcome,
  rather than becoming `clean`, `pass` or undifferentiated `failed`.

Required proof: inject unique harmless credential-shaped sentinels into
failing child stdout/stderr, scanner output, copy-check errors and exceptions.
Capture every shipping CLI/MCP/CI output route and returned object; prove the
default absence of those sentinels and of CI finding detail. Exercise signed
triage enable/disable and all six abnormal endings through real commands or
controlled cancellation/dependency failure, then inspect persisted reports.

## 15. Journal readers agree on corruption and weight includes preimages

**Original severity:** major. **Anchor:** `rig/lib/payload.js` `journalWriter`;
`rig/lib/onboarding-check.js` journal/weight readers.
**Basis:** AT-INSTALL-1, AT-UNINSTALL-1–2, AT-PB-4, AT-PB-10,
AT-HD-11 and the canonical lifecycle journal contract.

Pass criteria:

- All install/resume/check/remove readers apply the same authoritative
  journal validation. Malformed non-final JSON, invalid record structure or
  contradictory sequence/ownership history cannot be silently discarded to
  reconstruct a cleaner/smaller install. Stop before unsafe writes/removal
  and identify the corrupt record without claiming complete/clean state.
- A crash-truncated final line receives exactly the documented canonical
  recovery behavior on every reader, preserving valid prior records and
  interrupted-operation evidence. Do not independently invent a more
  permissive parser in another path.
- Payload weight includes attributable journal/ledger and stored preimage
  files as well as managed/owned output bytes, counted once under the
  established accounting model. Unrelated user data is not charged as Rig
  payload. Corruption cannot lower the weight by silently removing records.
  Growth remains a truthful warning rather than a new arbitrary hard cap.

Required proof: corrupt the middle and truncate the tail of the same real
installation journal, then invoke install/resume/check/remove and compare
their safe behavior. Grow a stored preimage without changing the ordinary
generated-output set and independently count bytes/files; reported weight
must increase accordingly. Ordinary valid resume/removal must still work.

## 16. Coverage writes are durable and higher grades retain lower checks

**Original severity:** major. **Anchor:** `rig/lib/lint-format.js`
`applyCoverage`; generic binding generation in `rig/lib/apply.js`.
**Basis:** AT-LF-6, AT-LF-17–18, AT-SHAPE-1, AT-SHAPE-3 and AT-INSTALL-1.

Pass criteria:

- Coverage apply verifies real Gate 1 approval of the exact current plan;
  a caller-computable digest is not consent. Each configuration, managed
  block and CI mutation uses the durable installation journal at the write
  boundary; a returned in-memory `manifest_records` array is not the ledger.
- A crash between intended and completed writes leaves recoverable pending
  evidence, incomplete status and no protection claim. Resume reconciles
  actual bytes without duplication; uninstall uses that same durable ledger
  to remove exactly Rig's additions while preserving user source/fix edits.
  Required writes that cannot be safely journaled cannot proceed silently.
- Binding generation uses the cumulative effective check set at the chosen
  service grade, including required dependency slices, with no lower-grade
  check dropped or unnecessarily duplicated. The installed runner executes
  those checks; a higher-grade label alone does not establish composition.

Required proof: kill a public coverage apply at real write boundaries and
then resume or uninstall from disk state in a new process; compare unrelated
bytes and manifested artifacts. Use a fixture service with separately
observable Policy/Context/Evidence checks and select the highest grade;
force each lower-grade check to fail in turn and observe installed failure.

## 17. First-enable history scanning needs trustworthy, actionable evidence

**Original severity:** major. **Anchor:** `rig/lib/secret-history.js`
`scanBeforeActivation`. **Basis:** AT-B3, AT-SECRET-1 and technical-spec §8.8.

Pass criteria:

- Enabling the leak-scanner service runs a real vetted scanner over the
  documented full-history/ref scope. Validate supported tool version,
  scanner identity, effective configuration and output contract; finding an
  executable with the right filename and receiving exit zero is insufficient.
  An arbitrary no-op file with that name must not prove history clean.
- Persist evidence bound to current repository/ref state, scanner/version,
  configuration and normalized finding set. A missing/unsupported tool,
  malformed output, timeout/nonzero execution or concurrent history/config
  change is non-passing, reports the specific reason and setup guidance,
  and does not mark the history service active.
- Findings produce an actionable local redacted report with safe locations,
  rule identities and remediation context, without matched secrets reaching
  the model. An output hash plus the literal word `redacted` is not actionable.
  The independently enabled staged-secret floor remains active even when
  history activation fails.
- Activation after findings requires a clean real rescan or a genuine user
  waiver authorized by the Gate 1 key and bound to exactly that current
  scanner/version, history/ref, configuration and finding set. Changed,
  added or stale findings invalidate the waiver. A waiver is reported as
  accepted findings, never mislabelled as a clean scan.

Required proof: run a supported real scanner on fixture Git history with a
harmless credential-shaped finding in an earlier commit, then remediate and
rescan. Also test a no-op impostor scanner, unsupported version, malformed
output, execution failure, concurrent history/config change and missing tool.
Verify exact-finding waiver acceptance and rejection after any bound input
changes, plus preservation of the staged-secret floor and redacted reports.

## 18. Shared global configuration keeps pre-existing lexical bytes

**Original severity:** major. **Anchor:** `rig/lib/global-writes.js`
`writeJson` and global JSON merge/removal paths.
**Basis:** AT-HOME-1–2, AT-SHAPE-1 and the recorded global-write risk.

Pass criteria:

- An approved global append/namespaced addition preserves every pre-existing
  user-owned value's lexical bytes, including number precision/notation,
  escape sequences, ordering and formatting. Parsing and reserializing the
  whole shared JSON file is not accepted as byte-preserving merely because
  the parsed objects compare equal. The completed file remains valid.
- Each entry has repository attribution from the first install; install
  output discloses the exact external file and global effect before writing.
  Reinstall replaces only that repository's entry without accumulation.
- With repositories A and B sharing a global file, uninstalling A removes
  only A's unchanged managed entries. B and unrelated user bytes remain
  byte-identical and functional. Conflicting/user-modified or malformed
  content is preserved with a named non-passing/manual-repair state; never
  resolve uncertainty by rewriting the user's file wholesale.
- Preserve the separately signed OpenClaw exception: only explicit opt-in
  invokes the native `openclaw mcp set/unset` route. Rig never implements its
  own OpenClaw JSON5 parse/reformat/write path, and prerequisite/removal
  failure leaves the required configuration/runtime repair boundary intact.

Required proof: through real global-install/reinstall/remove entry points in
an isolated fixture home, use shared JSON containing a beyond-safe-integer
value, exponent notation, escaped strings and distinctive whitespace/order.
Compare untouched byte spans before and after A/B install, A reinstall and
A removal; compare the final original file when all unchanged additions are
removed. Include malformed/user-edited entries and inspect native OpenClaw
invocations without touching the operator's real global configuration.

## Closure ledger and final verification

All entries start **open**. During remediation attach evidence to the matching
row; “addressed” is not a closure verdict. A reviewer verifies the observable
criteria and records either **closed** or the exact still-failing criterion.
One test may cover several rows if it demonstrates each stated boundary.

| Finding | Closure scope | Status | Evidence / verification result |
|---|---|---|---|
| 1 | Signed approval on every apply path | Closed — finding proof reviewed | Real SSHSIG checks reject forged metadata, wrong key/identity/purpose and cross-repository replay. Lock-time CAS now rejects changed user bytes; pointer resume permits only reconstruction from a hash-verified preimage. `tests/advanced-apply.test.js`, `tests/remediation-apply-coverage.test.js`, `tests/remediation-review-integrity.test.js`. |
| 2 | Approved transactional remediation and rescan | Closed — finding proof reviewed | Signed proposal/preimages/policy, exclusive transaction, crash recovery, rollback and real sanitation rescan are implemented. New publish-boundary edit and journal-link regressions preserve user data. `tests/remediation-apply-coverage.test.js`, `tests/remediation-review-integrity.test.js`, `tests/advanced-apply.test.js`. |
| 3 | Empty/malformed executable bindings fail | Closed — finding proof reviewed | Shared runner rejects empty/mixed/malformed maps before launch and records actual counts. Real installed Path B missing-executable case remains `missing_tool`, never success. `tests/remediation-task-acceptance.test.js`, `tests/remediation-discovery-pathb.test.js`, `tests/trust-root-review-fixes.test.js`. Public installed native-service positive/negative and source UI/missing-dependency parity: `tests/qa-installed-check-closure.test.js`. |
| 4 | Consent, single use and drift at real dispatch | Closed — finding proof reviewed | Task definitions/resources/active policy are signed; executable resolution is shared with launch. Durable clone-local consumption survives races, restart and .rig deletion. `tests/remediation-dispatch-boundaries.test.js`, `tests/remediation-task-acceptance.test.js`; current actual Linux boundary run passes 37 cases. |
| 5 | Task filesystem/environment isolation | Closed — finding proof reviewed | Real macOS and Linux Bubblewrap tests cover outside home/tmp/sibling reads, child processes, escaping symlinks, protected .git/.rig aliases, environment removal and allowed contained work. `tests/task-filesystem-sandbox.test.js`; `.context/qa-closure/linux-current.log` is 37/37. |
| 6 | Default-deny network on all binding shapes | Closed — finding proof reviewed | Omitted network mode denies or refuses safely. Generic network requires committed limits plus an exact signed one-use execution plan. Real listener grant/refusal oracle passes 2/2. `tests/remediation-dispatch-boundaries.test.js`, `tests/advanced-oracle.test.js`; `tests/remediation-installed-boundaries.test.js` adds public-apply-generated listener denial, unsigned refusal and exact signed single-use connection. |
| 7 | Agent-led discovery and execution scope/choice | Closed — finding proof reviewed | Repository inventory accepts arbitrary evidence; exact approved selection, ambiguity, scope and ignore filtering reach dispatched argv/cwd. New directory-ignore regression covers nested dist descendants. `tests/remediation-discovery-pathb.test.js`, `tests/remediation-review-runtime.test.js`. Strict owned-path inventory retains edited/stale bytes and rejects corrupt current/legacy history: `tests/inspection-integrity.test.js`. |
| 8 | Read-only mutation detection on every route | Closed — finding proof reviewed | Shared snapshots include source under build/vendor and preserve before/after evidence after timeout/memory/nonzero endings; later commands stop. `tests/remediation-dispatch-boundaries.test.js`, `tests/remediation-task-acceptance.test.js`, `tests/task-filesystem-sandbox.test.js`. `tests/remediation-installed-boundaries.test.js` adds installed maximal CI timeout/mutation evidence, preserved edits and second-command refusal. Real public source and installed local/CI processes persist before/after evidence, timeout and dependent not-run states: `tests/qa-installed-check-closure.test.js`. |
| 9 | Real Path B lint-format and cumulative grades | Closed — finding proof reviewed | Real installed Policy/Context/Evidence tests use good/bad source, missing executable, missing/current Context and mismatched/valid replay. CI now retains maximal grade and must create a fresh Evidence receipt containing formatter and linter work. `tests/remediation-discovery-pathb.test.js`, `tests/advanced-lint-format.test.js`. |
| 10 | Installed policy-aware git/CI baseline | Closed — finding proof reviewed | Actual installed hook/CI exercise enabled sanitation, semantic, exact-copy and secret floors, preserved user hook and signed disable/re-enable. GITHUB_ACTIONS-only routing uses CI scope too. `tests/remediation-policy-baseline.test.js`, `tests/remediation-review-runtime.test.js`. Registry-derived plus legacy harness coverage through actual staged/installed pre-commit and CI: `tests/git-dispatch-harness.test.js`. |
| 11 | Index-byte sanitation and current semantic review | Closed — finding proof reviewed | Staged blobs and context-index metadata govern commit checks. Empty/omitted context rosters fail; missing/current/stale relationship reviews are validated. Actual fallback metadata bytes bind protection evidence. `tests/remediation-policy-baseline.test.js`, `tests/remediation-review-runtime.test.js`, `tests/trust-root-review-fixes.test.js`. Supported-root staged bytes and semantic roster coverage use the authoritative registry: `tests/git-dispatch-harness.test.js`. |
| 12 | Atomic policy publication and signed one-use dispatch | Closed — finding proof reviewed | Signed policy CAS is locked and recoverable; real competing dispatch consumes a grant exactly once. Both action-grant CLI routes now require signed inputs and emit a reusable grant. `tests/remediation-policy-baseline.test.js`, `tests/remediation-action-cli.test.js`. |
| 13 | Preserving CI integration and honest first-run state | Closed — finding proof reviewed | Six-provider merge/repeat/remove and malformed-shape tests pass 7/7; native Ruby YAML parser accepts all five YAML artifacts. Providers remain supported with execution unverified/first_run_required until an actual provider run exists. `tests/remediation-ci-merge.test.js`, `.context/qa-closure/ci-native-parse.log`. |
| 14 | Output privacy and abnormal-ending taxonomy | Closed — finding proof reviewed | CLI/installed CI/MCP/report/metadata captures, private-key blocks and actual abnormal task endings use shared redaction and safe aggregates; invalid active triage policy refuses detail. `tests/remediation-ci-privacy.test.js`, `tests/basic-guard-scanner.test.js`. `tests/remediation-signed-privacy.test.js` adds actual standalone/CLI/report captures plus disclosure-confirmed Gate 1 signed enable/disable; the standalone checker now suppresses private paths and raw exceptions. Slack-family output/report/metadata redaction and Linux real signals versus exit143, bounded output and child cleanup: `tests/remediation-ci-privacy.test.js`, `tests/check-runner-signal.test.js`. |
| 15 | Strict shared journal semantics and complete weight | Closed — finding proof reviewed | Shared parser now requires complete ownership/state/operation history before mutation, preserves legitimate legacy create records and truncated-tail recovery evidence. Missing ownership cannot authorize deletion; preimages count once. `tests/remediation-review-journal.test.js`, `tests/remediation-history-global-journal.test.js`. Inventory, report publication and lifecycle share `rig/lib/journal-records.js`, including current/legacy readers and install-state computation. |
| 16 | Durable coverage writes and cumulative binding | Closed — finding proof reviewed | Coverage verifies exact Gate 1 signatures and writes through the locked durable installer journal, with real SIGKILL recovery/removal and user-edit preservation tests. Higher grades use cumulative effective checks. `tests/remediation-apply-coverage.test.js`, `tests/remediation-task-acceptance.test.js`. |
| 17 | Verified history scan and exact-finding waiver | Closed — finding proof reviewed | Pinned official Gitleaks, full-history/ref/config binding, actionable redacted finding locations, exact signed waiver, changed-input rejection and clean rescan have real scanner tests. `tests/remediation-history-global-journal.test.js`, `tests/advanced-secret.test.js`. |
| 18 | Byte-preserving attributed global mutations | Closed — finding proof reviewed | Lexical JSON addition/removal retains unrelated bytes in both A/B removal orders and reinstall. Sidecar hard links are now refused and metadata publishes atomically. Native OpenClaw remains opt-in. `tests/global-mcp-writes.test.js`, `tests/remediation-history-global-journal.test.js`, `tests/remediation-review-integrity.test.js`. |

Approval of this review scope requires all eighteen rows closed, not just
the four original blockers. It also requires the current signed oracle to
verify, the complete `npm test` gate to pass on the final candidate, and the
implementation/design/operator documentation to agree. Record exact-byte
evidence after the last product or documentation change. A contradiction
between a stale design claim and the signed contract is resolved in favor
of the contract; no signed guarantee is weakened to make a test pass.

These commands are existing verification entry points, not a claim that they
already exercise every new adversarial case:

```sh
node scripts/check-advanced-spec.js
node scripts/build-wiki-index.js --check
node scripts/check-wiki-budget.js
git diff --check
npm test
```

Run focused regressions while fixing each behavior; run the full gate after
the final candidate is ready. Document any unavailable tool/provider proof
as incomplete evidence, not a green result. Genuine product-contract gaps
retain their named unsupported/not-integrated meaning; they do not justify
omitting a mandatory implemented vertical or declaring a missing check run.

## Historical candidate verification — 2026-10-21

The earlier focused command passed 152/152 tests:
`node --test tests/advanced-acceptance.test.js tests/advanced-apply.test.js
tests/runtime-onboarding.test.js tests/spawn-guard-allowlist.test.js
tests/advanced-lint-format.test.js tests/advanced-oracle.test.js
tests/shipping-boundaries.test.js tests/global-mcp-writes.test.js
tests/path-b-weight.test.js`. `node scripts/build-wiki-index.js`,
`node scripts/check-wiki-budget.js`, `node scripts/check-spawn-guard.js`, and
`git diff --check` passed.

The owner then signed the prepared Gate 1 amendment. The initial full
`npm test` exposed two environment/fixture failures, which have since been
fixed. The focused command
`node --test tests/catalogue-installed.test.js tests/rig-bootstrap.test.js`
passes 25/25. After rebuilding generated wiki indexes, a fresh full `npm test`
passed: main suite 1,191 passed and 2 skipped, Pi extension 15 passed, and MCP
6 passed. The 18 rows remain open until each required finding-specific proof
passes on the same final candidate.

My evidence-based approval of these findings is distinct from the required
fresh-session binding receipt and from production promotion. No new binding
attempt is authorized here. Preserve author context
`v6.0.0-qa-readiness-2026-10-17`, receipt path
`.context/qa-readiness-final-review.json` and its existing failure count of
ten. Obtain fresh owner authorization for another capped binding attempt;
never reset the history. A receipt, if later produced, must validate against
the final reviewed bytes and full acceptance-ID set. Exact-QA automated
health and real-download clean-install/promotion evidence remain the existing
separate release steps under the deployment policy.

## Historical sandbox-fix verification — 2026-10-21

The latest full run before these fixes completed the main suite with 1,187
passing and two skipped tests, and five failures. Four failures were frozen
lint-format fixtures writing observations outside the repository sandbox; the
fifth hand-built installed-runner fixture omitted `sandbox.js`. The fixes now
report replay/network observations through task outcomes, preserve an explicit
filesystem-isolation-unavailable result, and include the shared module in the
fixture.

After those changes, the focused command
`node --test --test-name-pattern='AT-LF-9|AT-LF-22|RIG-141' tests/advanced-oracle.test.js`
passed 4/4, and
`node --test tests/review-received-diagnostics.test.js tests/task-filesystem-sandbox.test.js`
passed 7/7. The owner then updated and signed the Gate 1 manifest using the
approved digest delta:

```sh
node scripts/approve-gate1.js --confirm-digest-delta baa6178531319ce81a4d40ddadd10776d874a24543f218bdf05410aee7459c3e
```

`node scripts/check-advanced-spec.js` now verifies the signed oracle (16
files, 95 acceptance cases). The first full run exposed two stale assertions
in `tests/guarantee-coverage.test.js`: disabled task isolation now correctly
returns `filesystem_isolation_unavailable`, rather than the lower-level
`sandbox-disabled` state. Both expectations were updated. The focused command
`node --test --test-name-pattern='AT-PROC-1d|AT-PROC-1r'
tests/guarantee-coverage.test.js` passes 2/2.

The next logged full `npm test` passed: main suite 1,197 passed and two
skipped; Pi extension 15 passed; MCP 6 passed. This run includes the
wrong-key/cross-repository apply regressions, empty-root Linux bwrap mount
plan, staged index-byte sanitation, shared sanitizer detection,
byte-preserving global JSON member edits, and output-redaction changes. The
focused output/privacy and installed-runner suite passed 91/91. A preceding
full invocation failed with a large wiki diff; the isolated wiki checks
passed 13/13 and the logged full rerun passed. Finding-specific adversarial
execution and independent review evidence remain incomplete, so all 18
findings stay open.


## Historical recovery checkpoint — 2026-10-22

The owner-provided scope and continuation procedure are in
[the QA closure scope](2026-10-22-qa-closure-scope.md) and
[the handoff](../../../.context/qa-closure/HANDOFF.md); the read-only state
report is `.context/qa-closure/handoff.sh`. The latest recorded main-suite run in
`.context/full-main-final-candidate.log` has 1,246 passed and 11 failed. The frozen fixture amendment
is stable and awaits this exact human key-holder action:

```sh
node scripts/approve-gate1.js --confirm-digest-delta b093070363c5dc1a3ac6c4f991e76e6a53e577371c44c051b732b29275075de4
```

This signature is pending; agents must not perform it. All eighteen rows above
remain open. No green full-gate result, passing binding receipt, or QA-prod
readiness is claimed.

## Historical candidate — 2026-10-22

Three Luna agents repaired the assigned failures, independently reviewed all
eighteen criteria, then fixed the additional concrete reproductions. The
latest combined acceptance command passes 213/213 on macOS; the real
Docker/Linux Bubblewrap command passes 43/43. Pi passes 15/15 and MCP 6/6.
Logs are under `.context/qa-closure/`; these focused results do not replace
the full signed gate or binding review. The mirrored broad main run passed1274 tests and failed four on its starting
bytes; the three reported code/coherence regressions have passing focused
fixes, while the oracle remains unsigned. Live tracker coherence now passes
all66 declarations and the dedicated suite7/7. No row is closed from a test count alone.

`npm test` currently refuses the stale frozen-fixture signature before
running test code. The human key holder must run the exact prepared command:

```sh
node scripts/approve-gate1.js --confirm-digest-delta b093070363c5dc1a3ac6c4f991e76e6a53e577371c44c051b732b29275075de4
```

After signing, run `.context/qa-closure/run-verification.sh`, reconcile final
evidence for every row, then obtain the authorized fresh binding receipt
with the original author context and preserved counter. Owner authorization
for necessary review is already recorded; no repeated permission prompt is
required. The only human action identified at this checkpoint is signing.
The branch has not been pushed or declared ready by this session.

## Owner-signed verification — 2026-10-22 17:23 UTC

The owner has signed the prepared amendment. Independent verification passes
16 files and95 acceptance cases. The fresh read-only closure reconciliation
is retained in `.context/qa-closure/owner-signed-closure-audit.md`; its
criterion13 addendum applies the explicit honest first-run-gap contract.
Rows6,8,14 remain open while their installed public-process proofs finish.
Fifteen rows are closed on finding-specific evidence; this is not full-gate,
binding-review, push or deployment approval. The complete npm gate and a
fresh exact-byte binding receipt remain required before pushing.


## Final candidate verification checkpoint — 2026-10-22 17:26 UTC

All eighteen finding rows have reviewed implementation and regression evidence.
The acceptance requirements in sections1–18 remain unchanged. The owner-signed
oracle verifies16 files and95 acceptance cases. The first signed full npm run
passed main1284, Pi15 and MCP6 with zero failures and two main-suite skips.
That diagnostic run overlapped final proof additions, so a new full gate on the
frozen committed candidate is required before pushing. The two new maintained
proof files pass8/8; workflow checks pass8/8. Linux CI now explicitly installs
Bubblewrap and enables/probes rootless namespaces before sandbox execution.

Finding closure does not replace release approval. The remaining sequence is:
commit these final bytes, run the full npm gate, obtain and validate a fresh
binding receipt using the preserved author context and attempt history, then
push PR153 and require green checks on its exact head. Later promotion uses
only automated health and real-download clean-install evidence on the exact
QA commit. No additional human signature is currently required.

## Binding review result — 2026-10-22 17:46 UTC

The clean signed candidate passed full npm: main1292, Pi15, MCP6; zero failures,
two main-suite skips. Live coherence passes66/66. The fresh binding review
then rejected seven real gaps documented in
[the retained report](../../sources/reviews/v6.0.0-2026-10-22-qa-candidate.failed.review.json).
Affected rows3,7,8,10,11,14,15 are reopened pending direct shipping-route proofs.
The other rows retain their finding-specific evidence but do not certify the
whole release. Three Luna repair lanes own the shared seams. No push or
readiness is claimed. After fixes, freeze again and repeat the full gate and
binding review; the completed human signature remains valid.

## Repaired-candidate freeze — 2026-10-22 18:23 UTC

All eighteen rows again have reviewed finding-specific evidence after repairing
the seven gaps from the retained failed binding review. The original sections
1–18 are unchanged (SHA2568641dcca7d4a121acdb420e231ff51b81a3edf408d5597304c399d941bfdaed1).
The signed oracle verifies16 files/95 acceptance cases. Independent cross-review
found one installed dependent-report gap; its real-process red/green check is
fixed. The fresh Linux work also preserves SIGTERM separately from exit143,
retains private device/proc mounts for nested tools, bounds output metadata,
and terminates on overflow even if descendants hold pipes.

Evidence: Linux sandbox/signal25/25, full Linux guarantee44/44, root public
Linux integration34/34 and macOS55/55; final Linux signal/installed-network/spawn
inventory15/15 and macOS signal/inventory12/12. The last two runs follow removal
of a redundant direct kill; the committed spawn debt remains22 sites. CI output
stays aggregate-only while ignored redacted local reports retain mutation and
dependency states. Other provider execution remains honestly first_run_required
where not observed, under criterion13.

This is a candidate freeze checkpoint, not release approval. Commit final
product/docs, run the complete npm gate on those exact clean bytes, then obtain
and validate a fresh binding receipt with the preserved context/counter. Only
then push PR153 and require green checks on its exact head. Production uses
exact-QA automated health and real-download install evidence. No new human
signature or external owner blocker has been identified.


## October23 binding-review follow-up freeze

The final0a4d7292 gate passed main1314/Pi15/MCP6, followed by five concrete new defects in the [retained failed review](../../sources/reviews/v6.0.0-2026-10-23-qa-candidate.failed.review.json). The [bounded follow-up criteria and proof](2026-10-23-binding-review-followup.md) cover clone-bound Path B consent, enabled adopt sanitation, explicit signed autofix operand scope, replay abnormal endings and partial-install per-control protection. The original sections1–18 above remain byte-for-byte unchanged.

All five repairs now have focused evidence and integrated host/Linux187/187 passes. Final Path B additions pass all126 host cases and10 Linux/MCP cases; cross-repository rejection preserves target bytes/modes, quarantine blocks, and a genuine signed sanitation disablement reports not_run with no ALLOW verdict. Autofix's first unsafe interpreter heuristic was replaced by exact signed scope and independent replacement-script negatives. No owner signing action is pending. Commit/freeze, complete full npm and obtain a fresh passing exact-byte receipt before push/required PR checks. No current receipt, new push or readiness is claimed by this checkpoint.
