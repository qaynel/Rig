# testing.mutation.execution-orchestrator — maximal

Maximal adds a replayable evidence receipt for execution orchestrator. The evidence must preserve the worker_limit, per_mutant_timeout_ms, share_mutable_worktrees inputs that determined the result.

Tie acceptance to a second run against unchanged execution orchestrator inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.execution-orchestrator:evidence-replay. Given the mutation.execution-orchestrator binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
