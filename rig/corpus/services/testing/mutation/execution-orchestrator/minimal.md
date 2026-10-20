# testing.mutation.execution-orchestrator — minimal

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Grade: minimal. Assurance remains Policy grade. This check rejects a policy with no worker_limit: the bad fixture has `worker_limit` = `-1`, while the accepted fixture has `worker_limit` = `2`.

Set `worker_limit` to at least 2. The result says only that the configured operator or input is present. The worker limit must meet the configured minimum before a run can be planned.

Input: `rig-services/testing.mutation.execution-orchestrator.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: policy:testing.mutation.execution-orchestrator:minimal:execution-orchestrator-source-code-boundary.

Declared predicates: execution-orchestrator-source-code-boundary: `worker_limit` is numeric and at least 2.

Check: `execution-orchestrator-source-code-boundary`.
