# Advanced operator guide

## Workflow

```text
inspect -> host review -> recommend -> user selection (rig.json)
  -> plan -> apply -> check
```

Remediation is separate and requires an explicit proposal digest approval.

## CLI

```sh
node rig/materialize.js inspect --target <repo> --host <host-id> --out inspection.json
# host agent writes review.json from inspection + sanitation-review skill
node rig/materialize.js recommend --target <repo> --review review.json --out menu.json
# write leaf selections to <repo>/rig.json
node rig/materialize.js plan --target <repo> --manifest <repo>/rig.json --review review.json --out plan.json
node rig/materialize.js apply --target <repo> --manifest <repo>/rig.json --review review.json --plan plan.json
node .rig/bin/check.js --scope diff    # local/dev
node .rig/bin/check.js --scope repo    # CI
```

Legacy Basic path is unchanged:

```sh
node rig/materialize.js --target <repo> --manifest <basic-config.json>
```

## Safety

- No Rig model key, daemon, or persistent memory store (B1).
- Baseline (sanitation evidence, drift rule, exact-copy check, secret floor,
  git/CI check command) always installs, even with an empty selection.
- Unverified host/CI surfaces degrade explicitly; only GitHub Actions emits an
  automatic CI workflow today (`rig/lib/ci-adapters.js`).
- Reports under `reports/rig/` cover failed / vacuous / coverage_gap only.
