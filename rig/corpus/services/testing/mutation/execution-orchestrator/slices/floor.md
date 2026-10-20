# testing.mutation.execution-orchestrator — floor slice

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Assurance remains Policy grade.

This Policy slice checks `worker_limit` through `execution-orchestrator-slice-floor`. The good fixture supplies `worker_limit` = `2`; the bad fixture removes it.

The worker limit must meet the configured minimum before a run can be planned. Keep the failure attached to `rig-services/testing.mutation.execution-orchestrator.json`; do not infer that a mutation was generated or killed. execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.
