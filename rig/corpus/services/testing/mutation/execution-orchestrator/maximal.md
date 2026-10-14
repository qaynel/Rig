# testing.mutation.execution-orchestrator — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for execution orchestrator. The evidence must preserve the worker_limit, per_mutant_timeout_ms, share_mutable_worktrees inputs that determined the result. Binding checks: execution-orchestrator-evidence-receipt.

Tie acceptance to a second run against unchanged execution orchestrator inputs. Record the worker_limit, per_mutant_timeout_ms, share_mutable_worktrees inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this execution orchestrator result is stale. The ceiling remains: execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Choose a repository-owned check that observes execution orchestrator from rig-services/testing.mutation.execution-orchestrator.json.

Acceptance target: fixture:testing.mutation.execution-orchestrator:evidence-replay. Given the mutation.execution-orchestrator binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Bound mutation workers and timeouts while isolating each modified source tree. Shared mutable worktrees allow one mutant to contaminate another verdict.
minimal: worker limit — 2.
mid: per mutant timeout ms — 1000.
maximal: share mutable worktrees — false.
