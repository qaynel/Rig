# infrastructure.scaling-reliability.capacity-load — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for capacity load. The evidence must preserve the load_workload, slo_latency_ms, unbounded_load_duration inputs that determined the result. Binding checks: capacity-load-evidence-receipt.

Use a second run against unchanged capacity load inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: capacity load configuration validation only; declared policy does not prove running capacity load behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.scaling-reliability.capacity-load:evidence-replay. Given the scaling-reliability.capacity-load binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Owned scope: `scaling-reliability.capacity-load`.

Offer: Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Input: `rig-services/infrastructure.scaling-reliability.capacity-load.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: capacity load configuration validation only; declared policy does not prove running capacity load behavior. Select an approved repository-owned command to verify that behavior.

minimal: load workload — "100 concurrent requests".

mid: slo latency ms — 250.

maximal: unbounded load duration — false.
