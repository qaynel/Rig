# infrastructure.scaling-reliability.capacity-load — behavior-oracle slice

Policy grade slice. This slice bounds capacity load to scaling-reliability.capacity-load. It uses `capacity-load-slice-behavior-oracle` and checks load_workload (nonempty): load workload must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.scaling-reliability.capacity-load.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than capacity load configuration validation only; declared policy does not prove running capacity load behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Owned scope: `scaling-reliability.capacity-load`.

Offer: Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Input: `rig-services/infrastructure.scaling-reliability.capacity-load.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: capacity load configuration validation only; declared policy does not prove running capacity load behavior. Select an approved repository-owned command to verify that behavior.

minimal: load workload — "100 concurrent requests".

mid: slo latency ms — 250.

maximal: unbounded load duration — false.
