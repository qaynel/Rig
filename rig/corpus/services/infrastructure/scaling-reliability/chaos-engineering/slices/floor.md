# infrastructure.scaling-reliability.chaos-engineering — floor and mutation-floor slice

This slice bounds chaos engineering to scaling-reliability.chaos-engineering. It uses `chaos-engineering-slice-floor` and checks fault_scenarios (nonempty): fault scenarios must name the concrete repository contract..

Use a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Select an approved repository-owned command to verify that behavior.
