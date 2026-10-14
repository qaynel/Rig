# testing.mutation.execution-orchestrator — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for execution orchestrator. The evidence must preserve the worker_limit, per_mutant_timeout_ms, share_mutable_worktrees inputs that determined the result. Binding checks: execution-orchestrator-evidence-receipt.

Tie acceptance to a second run against unchanged execution orchestrator inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.execution-orchestrator:evidence-replay. Given the mutation.execution-orchestrator binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Owned scope: `mutation.execution-orchestrator`.

Offer: Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.

Input: `rig-services/testing.mutation.execution-orchestrator.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.

minimal: worker limit — 2.

mid: per mutant timeout ms — 1000.

maximal: share mutable worktrees — false.
