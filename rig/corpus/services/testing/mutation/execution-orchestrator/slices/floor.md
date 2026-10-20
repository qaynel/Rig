# testing.mutation.execution-orchestrator — floor slice

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Assurance remains Policy grade.

The worker limit must meet the configured minimum before a run can be planned. Configuration validation only, so it confirms a worker limit, per-mutant timeout and the shared-worktree flag are declared; it does not run workers.
