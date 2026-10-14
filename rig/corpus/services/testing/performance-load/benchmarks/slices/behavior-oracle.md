# testing.performance-load.benchmarks — behavior-oracle slice

This slice bounds benchmarks to performance-load.benchmarks. It uses `benchmarks-slice-behavior-oracle` and checks benchmark_workload (nonempty): benchmark workload must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.performance-load.benchmarks.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than benchmarks configuration validation only; declared policy does not prove running benchmarks behavior. Select an approved repository-owned command to verify that behavior.
