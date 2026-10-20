# testing.mutation.execution-orchestrator — property-floor slice

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Assurance remains Policy grade.

This slice verifies the configured `worker_limit` rule using `execution-orchestrator-slice-property-floor`. Bound concurrent mutation workers, per-mutant runtime, and workspace isolation.

The accepted fixture contains `worker_limit` = `2`; the invalid fixture demonstrates the missing-field case. This checks policy shape only, not a property of generated mutants.
