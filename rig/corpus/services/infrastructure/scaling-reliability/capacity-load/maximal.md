# infrastructure.scaling-reliability.capacity-load — maximal

Maximal adds a replayable evidence receipt for capacity load. The evidence must preserve the load_workload, slo_latency_ms, unbounded_load_duration inputs that determined the result.

Use a second run against unchanged capacity load inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: capacity load configuration validation only; declared policy does not prove running capacity load behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.scaling-reliability.capacity-load:evidence-replay. Given the scaling-reliability.capacity-load binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
