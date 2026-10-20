# testing.mutation.execution-orchestrator — behavior-oracle slice

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Assurance remains Policy grade.

The policy oracle for this service is `execution-orchestrator-slice-behavior-oracle`, and it validates `worker_limit`. Two workers sharing a writable source tree can contaminate each other’s test result.

A passing result means the input meets this one rule. It does not show the mutation tool or its oracle ran. For that claim, use a repository-owned execution check and report the observed result.
