# infrastructure.scaling-reliability.capacity-load — behavior-oracle slice

This slice bounds capacity load to scaling-reliability.capacity-load. It uses `capacity-load-slice-behavior-oracle` and checks load_workload (nonempty): load workload must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.scaling-reliability.capacity-load.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than capacity load configuration validation only; declared policy does not prove running capacity load behavior. Select an approved repository-owned command to verify that behavior.
