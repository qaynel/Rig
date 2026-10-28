# Advanced operator guide

## Workflow

```text
rig-onboarding: inspect -> propose useful capabilities -> user approves exact proposal -> apply -> check
```

The repository's host agent uses local context to choose relevant capabilities,
including optional services and grades. The mandatory safety baseline remains
installed regardless of that selection. The user reviews and approves the exact
proposal before repository files change. Remediation is separate: the owner
approves the exact proposal and preimage digests with a Gate 1 signature. A
caller-supplied proposal digest alone is not consent.
Path B approval also binds SHA256 of the real repository path; a signature
for an identical proposal in another clone is refused. Prepare runs enabled
sanitation before capability review, blocks/quarantines unsafe harness input,
and records explicitly disabled sanitation as not run without a clean verdict.

For the active 6.0.0 QA closeout, use the [eighteen-finding acceptance
criteria](../../wiki/specs/close-everything/2026-10-21-code-mode-review-acceptance.md),
[current scope](../../wiki/specs/close-everything/2026-10-22-qa-closure-scope.md),
and read-only continuation script at `.context/qa-closure/handoff.sh`.

## Local lint and format grades

The host agent inventories the repository and records its interpretation in
`rig-lint-format.json`: schema version 1, an explicit `diff` or `repo` scope,
`components`, and `excluded` roots with reasons. Each component supplies its
root, repository `evidence_paths`, include/ignore patterns, and command roles
(`format_check`, `lint`, optional `format`). Each role names `argv`, a repository
`source`, and `network: "none"` or `"required"`. A changed-file command must have
one literal `{files}` argument; Rig substitutes individual matching paths
without shell splitting. Unknown ecosystems remain visible to the agent;
uncovered files and excluded roots suppress whole-repository support.

Selection and installation authorize no repository task. Local checks and
installed CI require a fresh exact execution plan signed by the existing Gate 1
key. Run `git init` first if necessary: single-use consumption requires
clone-local Git storage. Use the handoff below, then run
`node .rig/bin/check.js --service development.code-quality.lint-format`.
The active-runtime `.rig/bin/rig check` command uses the same boundary.

At `mid` or `maximal`, clean Policy commands write
`reports/rig/lint-format-context-review-request.json` when a current Context
review is needed.

Have the repository agent review the listed changed files against the listed
rule sources. Save the completed request as
`.rig/lint-format/context-review.json`, adding a nonempty `summary`, an explicit
`verdict` of `pass` or `fail`, and `findings` with `file`, `rule`, and `meaning`
for each violation. The file and rule values must come from the request. A pass
requires an empty findings list. A failed review reports its violations and
stops before Evidence; a missing verdict or contradictory review is incomplete.
Prepare and sign a fresh execution approval before rerunning the check; the
previous approval was consumed even if the run stopped at a review gap.
A clean `mid` reports Context; `maximal` reruns the commands and writes
`reports/rig/lint-format-evidence.json` only when their observed output and
inputs match. A changed file, rule, or command makes the old review stale. Generated Rig reports do not invalidate that review; read-only commands that write reports are still rejected as mutations.
Evidence replay retains every observed command outcome, including timeout or
signal failures; a failed replay does not produce an Evidence receipt. Local
reports keep that detail redacted, while CI emits safe aggregates only.

For a separate autofix that passes source filenames, include the discovered
`scoped_files` list in the signed fix/verify plan, for example `['a.js']` for
`formatter --write a.js` followed by `formatter --check a.js`. Paths are relative
to the command cwd and must be file operands in both commands. Only their
observed post-fix bytes may become verification inputs. Executable, explicit
`source`, configuration and modes remain pinned. Missing scope or definition
drift reports `verification: not_run` with `command_drift`; prepare a corrected
plan rather than treating an unlaunched verifier as a failed check.

This local receipt is independent of a separately approved CI integration.
If any command changes source bytes or modes, Rig stops before launching the
next command and reports the changed paths and before/after evidence. It leaves
the changed files available for inspection.

### Exact execution approval handoff

Run this from the installed repository after its binding is applied. `local`
uses the selected local grade and scope. Replace it with `ci` to prepare the
whole-repository Policy command list used by an Evidence-grade CI binding.
The runtime version and executable bytes must match the machine that will run
the plan; a signature prepared for a different clone, executable, policy
generation, source configuration, scope, or command order is refused.

```sh
node - local <<'NODE'
const fs = require('node:fs');
const target = fs.realpathSync('.');
const id = 'development.code-quality.lint-format';
const binding = JSON.parse(fs.readFileSync('.rig/service-bindings.json', 'utf8'))[id];
if (!binding) throw new Error('Apply the selected lint-format binding first');
const ci = process.argv[2] === 'ci';
if (ci && binding.grade !== 'maximal') throw new Error('CI lint enforcement requires Evidence grade');
const inputs = require('./.rig/lib/lint-grade').installedGradeInputs({
  target, binding, scope: ci ? 'repo' : binding.scope || 'diff', policyOnly: ci,
});
if (inputs.gap) throw new Error(inputs.gap.reason);
if (!inputs.commands.length) throw new Error('No selected files need executable checks');
const commands = inputs.grade === 'maximal' ? [...inputs.commands, ...inputs.commands] : inputs.commands;
const consent = require('./.rig/lib/task-consent');
const plan = consent.planExecution({ target, selected: true, commands });
const challenge = consent.createPlanApprovalChallenge(plan);
fs.mkdirSync('.rig/lint-format', { recursive: true });
for (const [name, value] of [['execution-plan', plan], ['execution-challenge', challenge]]) {
  fs.writeFileSync(`.rig/lint-format/${name}.json`, JSON.stringify(value, null, 2) + '\n');
}
fs.writeFileSync('.rig/lint-format/execution-challenge.txt', challenge.message);
console.log(`Review .rig/lint-format/execution-plan.json; ${commands.length} commands; ${plan.plan_digest}`);
NODE
```

The human key holder reviews that plan and signs its unchanged challenge using
the same key used for Gate 1. Substitute the existing key's path; an agent must
not run this signing step or create a substitute key.

```sh
ssh-keygen -Y sign -f /path/to/existing-gate1-key -n rig-plan-approval .rig/lint-format/execution-challenge.txt
```

Assemble the public signature receipt, then execute once:

```sh
node <<'NODE'
const fs = require('node:fs');
const challenge = JSON.parse(fs.readFileSync('.rig/lint-format/execution-challenge.json', 'utf8'));
const { identity } = require('./.rig/lib/trust-root').readTrustRoot(process.cwd());
const approval = { schema_version: 1, kind: 'plan-approval',
  plan_digest: challenge.plan_digest, approval_id: challenge.approval_id,
  approval: { method: 'external-sshsig', identity,
    signature: fs.readFileSync('.rig/lint-format/execution-challenge.txt.sig', 'utf8') } };
fs.writeFileSync('.rig/lint-format/execution-approval.json', JSON.stringify(approval, null, 2) + '\n');
NODE
node .rig/bin/check.js --service development.code-quality.lint-format
```

For the CI plan, run the final command with `CI=true` on the exact prepared
checkout. Repeated CI jobs need newly approved plans; generation and local
executable binding prevent treating this receipt as a portable standing grant.
The plan file and signature can be prepared without a private key on the runner.
Required network or raised limits additionally need a matching committed
`.rig/execution-policy.json` grant; that file alone authorizes no lint task.

## Public install

Use `install rig [--host <host>]... [--target <repository>] [--version <tag>]`.
It installs the active runtime and catalogue, then tells the user to invoke
`rig-onboarding` in a host agent. Onboarding is explicit: installation does
not inspect or adapt the repository automatically, and no change is made until
its summary is approved.

`install.sh` and `rig/bootstrap.sh` remain subordinate compatibility and
diagnostic paths. The public launcher always enables the active runtime.

## Legacy configurator CLI (compatibility path)

The manifest-based `materialize` commands remain for compatibility with existing
integrations. New onboarding should use `rig-onboarding` as described above;
do not turn the legacy `select` command into a second user-facing service picker.
This compatibility path stores an explicit service manifest in `rig.json`.

## Legacy CLI reference

From a source checkout use `node rig/materialize.js`; from a tagged release
install use `.rig/bin/rig` with the same arguments. The installed command is
present only for active-runtime installs (`--with-runtime`).

```sh
node rig/materialize.js inspect --target <repo> --hosts auto --out inspection.json
node rig/materialize.js host-review --target <repo> --inspection inspection.json --out review.json
node rig/materialize.js recommend --target <repo> --review review.json --out menu.json
node rig/materialize.js select --menu menu.json --out <repo>/rig.json --service id=grade
node rig/materialize.js plan --target <repo> --manifest <repo>/rig.json --review review.json --out plan.json
# Approve the exact plan with a signature by the Gate 1 key (no host-native approval exists yet).
node rig/materialize.js apply --target <repo> --manifest <repo>/rig.json --review review.json --plan plan.json --approval approval.json
.rig/bin/rig check --target <repo>
```

Model-assisted secret triage is enabled only through a disclosed policy plan:

```sh
node rig/materialize.js policy propose --target <repo> --policy <network-policy.json> --out <policy-proposal.json>
node rig/materialize.js policy activate --target <repo> --proposal <policy-proposal.json> --approval <policy-approval.json>
node rig/materialize.js policy status --target <repo>
```

The proposal carries the third-party disclosure and exact activation challenge.
External approval signs `rig-policy-activation-v1`, the proposal digest, and a
trailing newline under SSHSIG namespace `rig-policy-activation`. The approval
JSON carries the signer identity, armored signature, proposal digest, and
confirmed disclosure digests. A JSON `verified: true` assertion is not accepted.

Rig has one trust root: the key that signs the Gate 1 lock. The installer ships
its public half as `.rig/trust/gate1.allowed-signers`, and every approval —
plan approvals, lint-format plan and setup approvals, and policy activation —
verifies against that key alone, with the identity it lists (`gate1-owner`).
There is no separate policy-signer setup, recovery registration, rotation,
recovery, or trust-on-first-use, and a signer list planted elsewhere in the
repository approves nothing. Editing the installed trust root is drift. If the
Gate 1 key is lost Rig offers no recovery path.

Removal is available from the same shipped runtime:

```sh
node rig/materialize.js uninstall --target <repo>
node rig/materialize.js uninstall --target <repo> --purge
```

Purge prints its report/run-history deletion list before deleting those usage
artifacts. The user-owned `.rig/network-policy.json` is preserved.
The removal result and ordinary `reports/rig/last-uninstall.json` include
`verification`: `verified_clean` means the recorded managed content is gone;
`checked` and `counts` summarize every recorded path, and `differences` lists only paths with outside user edits or best-effort problems, with their preimage and final digests.
Snapshots are evidence only and are never restored. Missing or corrupt
preimages and unlocatable managed markers produce `best_effort` with named
paths. Legacy teardown status `removed` alone is not a verification verdict.

Release review uses `scripts/review-receipt.js`. Claude is the default reviewer;
`--reviewer codex` uses a fresh ephemeral read-only Codex process with the same
prompt and receipt validator when the default driver is unavailable. It is a
release-only gate — never a mid-development inner loop; use `rig-tdd`'s
`npm run test:rig` / single-test-file loop for that instead.

A binding review starts only after deterministic preflight, all known findings
are resolved, the candidate is frozen and relevant CI is green. Consolidate a
failing review into one remediation batch. Re-review focuses on that batch and
its interactions, retains all required acceptance verdicts, and records any
serious new defect. No mandatory finding may remain open at success.

The wrapper enforces authorization — a third completed failing review for the same
`--author-context` refuses to spawn another reviewer (`--force-rereview`
overrides it only after explicit owner authorization, without resetting history).
Provider errors and timeouts do not consume completed-verdict attempts.
Pass `--interim`
for a cheap sanity-check pass with a cheap `--model`: it prints the verdict and
findings but never writes the binding receipt. Only a run without `--interim`
produces the receipt the gate relies on, and it should use the model the
release designates. A pass never deletes the review audit trail.

Use `--remediate` for the one targeted follow-up to the latest completed failed
binding report. The wrapper refuses an unchanged candidate or an already-resolved
batch. Return all acceptance verdicts and one disposition per carried finding,
with a current repository-file SHA-256 reference and an explicit reviewer check
assessment. That assessment is not proof the command executed: use independently
verified CI and the signed integration batch for execution provenance. An
exhausted cap needs the explicit owner-authorized `--force-rereview`; that flag
permits one additional completed binding attempt per author context. Provider
errors and interim checks do not spend it; a pass cannot replenish it. Corrupt
history refuses rather than resetting counters, and changing contexts preserves
each context's existing history.

Ordinary feature-to-`qa-prod` CI does not require a release signature, public
release or published archive digest. Exact-QA production promotion runs the
comprehensive release gates. Authenticated publication uses the existing owner
key; afterward, set `RIG_PUBLIC_ARCHIVE_SHA256` from the authenticated archive
and run the post-publication workflow against the actual release asset. A local
archive or CI artifact cannot satisfy public-release acceptance.

The installed release-evidence API labels mutable local readiness as provisional.
Production uses the existing GitHub origin/workflow identity and a batch signed
under the existing Gate 1 root over the exact Git SHA, source, worker state and
check evidence. Publication requires its own real signature over the exact
candidate, evidence and artifact; the guarded handoff reuses that key. Historical
artifact validation verifies the public signature proof kept in local release
state. The shipped artifact contains no signer identity, key reference or
signature. Verify actual public bytes after publication against the independently
trusted digest; do not treat local publication fixtures as public-release proof.

Direct payload materialization, for a prepared manifest:

```sh
node rig/materialize.js --target <repo> --manifest <basic-config.json>
```

## Safety

- No Rig model key, daemon, or persistent memory store (B1).
- Baseline (sanitation evidence, drift rule, exact-copy check, secret floor,
  git/CI check command and its executable dependencies) always installs through
  bootstrap, catalogue apply, and migration, even with an empty selection.
  Optional plumbing and the full command runtime still require active delivery.
- Semantic drift requires a current host-agent review in
  `.rig/context-index.json`, with exact input digests and a reasoned judgment
  for every pair of indexed instruction documents. Pre-commit checks read
  staged document bytes; stage reviewed changes before committing.
- Unsupported host/CI surfaces degrade explicitly. GitHub Actions, GitLab CI,
  CircleCI, Jenkins, Buildkite, and Azure Pipelines have additive adapters;
  each requires plan approval before mutation. Emitted files and local merge
  tests do not certify a real provider first run. Unsupported YAML/Groovy shapes
  are preserved and refused, including Azure root `steps`/`stages` layouts.
- Repository tasks run with isolated environment, filesystem/network restrictions
  and resource ceilings; unavailable isolation is a named non-passing result.
  Undeclared network access is denied. Read-only mutation halts later commands.
  Linux execution requires Bubblewrap and enabled user namespaces; missing
  prerequisites refuse execution. CI runner setup installs and probes them.
- Reports under `reports/rig/` include failed, vacuous, gaps, and distinct
  abnormal endings. Source and installed commands retain changed paths and
  before/after digests after mutation, including timeout failures, and record
  dependent checks as not run. Local reports remain ignored and redacted;
  CI publishes only verdict, counts and rule identities, without report uploads.
- First-enable history scanning accepts only SHA-pinned official Gitleaks
  8.30.1 binaries for macOS/Linux arm64/x64. Missing/untrusted binaries,
  shallow history, malformed output or changed refs fail closed. Install the
  [official release](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1),
  revoke real credentials and repair history, then rescan. An exception requires
  the Gate 1 holder's signature over the exact current report's `waiver_message`
  in namespace `rig-history-waiver`; the waiver binds refs, scanner binary,
  configuration and findings. It accepts those findings and never claims clean.

### Signed one-use action grants

Prepare the exact action with `node rig/materialize.js policy grant-proposal
--target <repo> --action <action.json> --out <proposal.json>`. The Gate 1 key
holder signs `actionApprovalMessage(proposal)` from `rig/lib/enforcement.js`
under SSHSIG namespace `rig-action-approval`; the authorization JSON contains
`method: "external-sshsig"`, the Gate 1 `identity`, and the signature text.
Issue with `policy grant-approval --target <repo> --action <action.json>
--proposal <proposal.json> --approval <authorization.json> --out <grant.json>`.
The saved file is the signed grant consumed by `policy evaluate --target
<repo> --action <action.json> --approval <grant.json>`. The compatibility
wrapper takes `<target> <action.json> <proposal.json> <authorization.json>`
and emits the same grant JSON. Unsigned requests are refused; the issued
grant survives process restart and can dispatch once in that clone only.

Global JSON/YAML configuration updates refuse symbolic or hard links and
leave linked files untouched for manual repair. Accepted updates preserve
existing file mode and unrelated lexical bytes, recheck the input before
atomic publication, and retain attributable ownership for later removal.
