# execution orchestrator

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Assurance remains Policy grade.

Bound concurrent mutation workers, per-mutant runtime, and workspace isolation. Two workers sharing a writable source tree can contaminate each other’s test result.

The policy input is `rig-services/testing.mutation.execution-orchestrator.json`. Keep its configuration visible to review: minimal supplies `worker_limit` = `2`; mid adds `per_mutant_timeout_ms` = `1000`; maximal sets `share_mutable_worktrees` = `false`.


The native check validates this service’s declared policy only; it does not run the service. For runtime assurance, run an approved repository-owned command and preserve its exit status.
