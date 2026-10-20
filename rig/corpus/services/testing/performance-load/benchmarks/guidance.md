# benchmarks

Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Owned scope: `performance-load.benchmarks`. Input: `rig-services/testing.performance-load.benchmarks.json`.

Coverage ceiling: Configuration validation only, so it confirms a benchmark workload, sample count and the single-sample flag are declared; it does not run benchmarks.

minimal: benchmark workload — "serialize 1000 records". Name the workload benchmarked. A benchmark of an unspecified input cannot be compared, so describe it.

mid: samples — 30. Take at least 30 samples. Fewer cannot characterize variance, so declare the sample count.

maximal: single sample conclusion — false. Set concluding from a single sample to false. One timing cannot support a regression or optimization claim, so compare distributions.
