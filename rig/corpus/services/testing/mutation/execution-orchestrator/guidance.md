# execution orchestrator

Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Owned scope: `mutation.execution-orchestrator`.

Offer: Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Input: `rig-services/testing.mutation.execution-orchestrator.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.

minimal: worker limit — 2.

mid: per mutant timeout ms — 1000.

maximal: share mutable worktrees — false.

