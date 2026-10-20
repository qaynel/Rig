# testing.mutation.execution-orchestrator — identity

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Policy grade. Bound concurrent mutation workers, per-mutant runtime, and workspace isolation. Two workers sharing a writable source tree can contaminate each other’s test result.

Applicable surface: source-code.

Owned scope: `mutation.execution-orchestrator`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Read `rig-services/testing.mutation.execution-orchestrator.json`; malformed input remains attributable to that path. The good and bad fixtures show the configuration boundary, not a mutation run.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.

Policy checks: minimal requires `worker_limit` = `2`; mid adds `per_mutant_timeout_ms` = `1000`; maximal requires `share_mutable_worktrees` = `false`.
