# Advanced operator guide

## Workflow

```text
inspect -> host review -> recommend -> user selection (rig.json)
  -> plan -> apply -> check
```

Remediation is separate and requires an explicit proposal digest approval.

## Public install

Use `install rig [--host <host>]... [--target <repository>] [--version <tag>]`.
It installs the active runtime and catalogue, then tells the user to invoke
`rig-onboarding` in a host agent. Onboarding is explicit: installation does
not inspect or adapt the repository automatically, and no change is made until
its summary is approved.

`install.sh` and `rig/bootstrap.sh` remain subordinate compatibility and
diagnostic paths. The public launcher always enables the active runtime.

## CLI

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
confirmed disclosure digests; Rig verifies it against
`.rig/policy/allowed-signers`. A JSON `verified: true` assertion is not accepted.

Signer recovery uses the separate recovery namespace and trust store:

```sh
node rig/materialize.js policy recovery-challenge --target <repo> --replacement <replacement.json> --identity <recovery-id> --out <challenge.json>
node rig/materialize.js policy recover --target <repo> --challenge <challenge.json> --approval <recovery-approval.json>
```

The recovery approval signs `rig-policy-recovery-v1`, the challenge digest, and
a trailing newline under namespace `rig-policy-recovery`. Recovery requires a
pre-registered distinct credential and commits its receipt before burning old
approvals or advancing evidence state.

Removal is available from the same shipped runtime:

```sh
node rig/materialize.js uninstall --target <repo>
node rig/materialize.js uninstall --target <repo> --purge
```

Purge prints its report/run-history deletion list before deleting those usage
artifacts. The user-owned `.rig/network-policy.json` is preserved.

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

Legacy Basic path is unchanged:

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
