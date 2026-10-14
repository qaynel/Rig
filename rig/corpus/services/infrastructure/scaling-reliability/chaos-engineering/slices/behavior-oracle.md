# infrastructure.scaling-reliability.chaos-engineering — behavior-oracle slice

This slice bounds chaos engineering to scaling-reliability.chaos-engineering. It uses `chaos-engineering-slice-behavior-oracle` and checks fault_scenarios (nonempty): fault scenarios must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Select an approved repository-owned command to verify that behavior.
