# testing.mutation.execution-orchestrator — mid

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Policy grade, mid: Set a per-mutant timeout of at least 1000 ms. A mutant can loop forever, so bound each run. Cumulative with minimal. Binding checks: execution-orchestrator-source-code-boundary, execution-orchestrator-mutation-context.
