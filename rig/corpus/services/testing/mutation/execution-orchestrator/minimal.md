# testing.mutation.execution-orchestrator — minimal

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Grade: minimal. Assurance remains Policy grade.

Set `worker_limit` to at least 2. The worker limit must meet the configured minimum before a run can be planned.

Input: `rig-services/testing.mutation.execution-orchestrator.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: Configuration validation only, so it confirms a worker limit, per-mutant timeout and the shared-worktree flag are declared; it does not run workers.

Acceptance target: policy:testing.mutation.execution-orchestrator:minimal:execution-orchestrator-source-code-boundary.

Declared predicates: execution-orchestrator-source-code-boundary: `worker_limit` is numeric and at least 2.

Check: `execution-orchestrator-source-code-boundary`.
