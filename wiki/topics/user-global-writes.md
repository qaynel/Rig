# User-global writes

## What it is

Where a vendor offers only a user-global configuration surface, Rig may append
or namespaced-merge outside the repository. Every entry is attributed from the
first install to a generated clone-local install identity, and uninstall removes
only entries belonging to that identity. [Gate 2 §7.4](../gate2/technical-spec.md#74-user-global-writes-and-repository-attribution)

## Why it is this way

Refusing every global surface would make some supported host axes impossible;
unattributed writes would make safe removal impossible. A clone-local identity
under `git rev-parse --git-path rig/` survives normal repository use without
becoming committed shared state, and linked worktrees remain distinct installs.
[Gate 1 D9](../gate1/business-spec.md)

## What binds it

`D9`, `AD-25`, and `AD-26` require additive preservation, attribution, and
install-time blast-radius disclosure. `AT-HOME-*` tests first install, repeat
install, multi-repository coexistence, and removal. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Overwrite, late attribution, retrofitting ownership after the first install,
and a prune subsystem for orphaned entries were rejected. The product reports
orphans; it does not guess who owns them. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen global-write rule: [Gate 1 §2](../gate1/business-spec.md)
- Identity and merge mechanics: [Gate 2 §7.4](../gate2/technical-spec.md#74-user-global-writes-and-repository-attribution)
- Install disclosure: [Gate 2 §7.5](../gate2/technical-spec.md#75-install-line-output)

## What is still open

The host registry still needs exact contracts for every axis whose MCP or other
configuration is user-global. Those contracts and byte-landing tests are release
work. [Host and CI coverage](host-and-ci-coverage.md)
