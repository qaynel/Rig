# testing.mutation.execution-orchestrator — behavior-oracle slice

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Assurance remains Policy grade.

Two workers sharing a writable source tree can contaminate each other’s test result.
