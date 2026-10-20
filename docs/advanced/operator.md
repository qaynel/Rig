# Advanced operator guide

## Workflow

```text
rig-onboarding: inspect -> propose useful capabilities -> user approves exact proposal -> apply -> check
```

The repository's host agent uses local context to choose relevant capabilities,
including optional services and grades. The mandatory safety baseline remains
installed regardless of that selection. The user reviews and approves the exact
proposal before repository files change. Remediation is separate and requires
an explicit proposal-digest approval.

## Local lint and format grades

After selecting the lint and format service at `mid` or `maximal`, run
`.rig/bin/rig check --service development.code-quality.lint-format` in the
installed repository. Rig runs the repository's read-only format and lint
commands first. A clean run writes
`reports/rig/lint-format-context-review-request.json` when a current Context
review is needed.

Have the repository agent review the listed changed files against the listed
rule sources. Save the completed request as
`.rig/lint-format/context-review.json`, adding a nonempty `summary`, an explicit
`verdict` of `pass` or `fail`, and `findings` with `file`, `rule`, and `meaning`
for each violation. The file and rule values must come from the request. A pass
requires an empty findings list. A failed review reports its violations and
stops before Evidence; a missing verdict or contradictory review is incomplete.
Rerun the same check. A clean `mid` reports Context; `maximal` reruns the commands and writes
`reports/rig/lint-format-evidence.json` only when their observed output and
inputs match. A changed file, rule, or command makes the old review stale.
This local receipt is independent of a separately approved CI integration.
If any command changes source bytes or modes, Rig stops before launching the
next command and reports the changed paths and before/after evidence. It leaves
the changed files available for inspection.

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
# Approve the exact plan through a host-native attestation or an external signature.
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

A `fail` verdict is real signal: fix it, then re-review once. The wrapper
enforces the cap itself — a third consecutive fail for the same
`--author-context` refuses to spawn another reviewer (`--force-rereview`
overrides it, as an explicit, visible step, not silent retry). Pass `--interim`
for a cheap sanity-check pass with a cheap `--model`: it prints the verdict and
findings but never writes the binding receipt. Only a run without `--interim`
produces the receipt the gate relies on, and it should use the model the
release designates.

Direct payload materialization, for a prepared manifest:

```sh
node rig/materialize.js --target <repo> --manifest <basic-config.json>
```

## Safety

- No Rig model key, daemon, or persistent memory store (B1).
- Baseline (sanitation evidence, drift rule, exact-copy check, secret floor,
  git/CI check command) always installs, even with an empty selection.
- Unsupported host/CI surfaces degrade explicitly. GitHub Actions, GitLab CI,
  CircleCI, Jenkins, Buildkite, and Azure Pipelines have additive adapters;
  each requires plan approval before mutation.
- Reports under `reports/rig/` cover failed / vacuous / coverage_gap only.
