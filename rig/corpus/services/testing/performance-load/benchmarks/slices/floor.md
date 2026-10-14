# testing.performance-load.benchmarks — floor and mutation-floor slice

Policy grade slice. This slice bounds benchmarks to performance-load.benchmarks. It uses `benchmarks-slice-floor` and checks benchmark_workload (nonempty): benchmark workload must name the concrete repository contract..

Inspect a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.performance-load.benchmarks.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than benchmarks configuration validation only; declared policy does not prove running benchmarks behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Owned scope: `performance-load.benchmarks`.

Offer: Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Input: `rig-services/testing.performance-load.benchmarks.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: benchmarks configuration validation only; declared policy does not prove running benchmarks behavior. Select an approved repository-owned command to verify that behavior.

minimal: benchmark workload — "serialize 1000 records".

mid: samples — 30.

maximal: single sample conclusion — false.
