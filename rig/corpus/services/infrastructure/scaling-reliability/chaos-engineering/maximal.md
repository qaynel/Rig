# infrastructure.scaling-reliability.chaos-engineering — maximal

Maximal adds a replayable evidence receipt for chaos engineering. The evidence must preserve the fault_scenarios, stop_conditions, production_experiment_without_approval inputs that determined the result.

Tie acceptance to a second run against unchanged chaos engineering inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.scaling-reliability.chaos-engineering:evidence-replay. Given the scaling-reliability.chaos-engineering binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
