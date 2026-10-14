# infrastructure.scaling-reliability.autoscaling — behavior-oracle slice

This slice bounds autoscaling to scaling-reliability.autoscaling. It uses `autoscaling-slice-behavior-oracle` and checks scaling_metric (nonempty): scaling metric must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.scaling-reliability.autoscaling.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Select an approved repository-owned command to verify that behavior.
