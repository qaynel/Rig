# infrastructure.scaling-reliability.autoscaling — floor and mutation-floor slice

Policy grade slice. This slice bounds autoscaling to scaling-reliability.autoscaling. It uses `autoscaling-slice-floor` and checks scaling_metric (nonempty): scaling metric must name the concrete repository contract..

Use a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.scaling-reliability.autoscaling.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Owned scope: `scaling-reliability.autoscaling`.

Offer: Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Input: `rig-services/infrastructure.scaling-reliability.autoscaling.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Select an approved repository-owned command to verify that behavior.

minimal: scaling metric — "queue depth".

mid: maximum replicas — 10.

maximal: scale to zero without wakeup — false.
