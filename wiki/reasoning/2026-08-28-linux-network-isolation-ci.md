---
date: 2026-08-28
source: agent
topics: trust-and-failure-boundaries, host-and-ci-coverage
decisions:
---

# Linux network isolation and CI setup

The Linux CI failures had one shared cause: the implementation checked that
`unshare` existed by running `unshare --help`, then assumed
`unshare --net -- <task>` would execute. On an unprivileged Ubuntu runner,
creating a network namespace without entering a user namespace fails before
the task starts. That made a mutating task appear clean, made a timed-out task
appear clean, and made the network-denial test pass vacuously.

The implementation now probes the exact rootless prefix,
`unshare --user --map-root-user --net --`, by launching the current Node
runtime. The same prefix is used only when that probe exits successfully. A
real probe is necessary because command availability is not capability
availability; an unsuccessful probe returns the existing blocking
`network_isolation_unavailable` state.

The GitHub Actions runner is Ubuntu 24.04, where AppArmor restricts
unprivileged user namespaces. The workflow explicitly disables that runner
restriction for the test job and runs a namespace smoke check before tests.
This preserves the default-deny contract in CI while leaving locked-down real
hosts with an honest non-pass rather than a silent degradation.

The third failure was test ordering, not installer behavior. The frozen
OpenClaw fixture's fake `npm` copies dependencies from the repository's
`rig-mcp/node_modules` directory, but the root oracle runs before the
subproject's `pretest` hook creates it. The workflow now installs the bundled
runtime before the root suite.
