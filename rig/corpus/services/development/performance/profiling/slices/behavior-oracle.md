# development.performance.profiling — behavior-oracle slice

This slice bounds profiling to code-profiling, bottleneck-identification. It uses `profiling-slice-behavior-oracle` and checks workload (nonempty): workload must name the concrete repository contract..

Inspect a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.performance.profiling.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than profiling configuration validation only; declared policy does not prove running profiling behavior. Select an approved repository-owned command to verify that behavior.
