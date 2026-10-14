# testing.mutation.execution-orchestrator — behavior-oracle slice

Policy grade slice. This slice bounds execution orchestrator to mutation.execution-orchestrator. It uses `execution-orchestrator-slice-behavior-oracle` and checks worker_limit (minimum 2): worker limit must meet the configured minimum of 2..

For execution orchestrator, choose a repository example that satisfies worker_limit at the behavior-oracle floor, plus a failure where worker limit must meet the configured minimum of 2. is false. For execution orchestrator, wire `behavior-oracle` to `rig-services/testing.mutation.execution-orchestrator.json` and keep its verdict on worker_limit; missing evidence is a named gap, with ceiling execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Choose a repository-owned check that observes execution orchestrator from rig-services/testing.mutation.execution-orchestrator.json..

Service-specific evidence cues:
Offer: Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.
minimal: worker limit — 2.
mid: per mutant timeout ms — 1000.
maximal: share mutable worktrees — false.
