# benchmarks

Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Owned scope: `performance-load.benchmarks`.

Offer: Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Input: `rig-services/testing.performance-load.benchmarks.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: benchmarks configuration validation only; declared policy does not prove running benchmarks behavior. Select an approved repository-owned command to verify that behavior.

minimal: benchmark workload — "serialize 1000 records".

mid: samples — 30.

maximal: single sample conclusion — false.

