# infrastructure.scaling-reliability.capacity-load — floor and mutation-floor slice

This slice bounds capacity load to scaling-reliability.capacity-load. It uses `capacity-load-slice-floor` and checks load_workload (nonempty): load workload must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.scaling-reliability.capacity-load.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than capacity load configuration validation only; declared policy does not prove running capacity load behavior. Select an approved repository-owned command to verify that behavior.
