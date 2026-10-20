# testing.performance-load.benchmarks — identity

Policy grade: benchmarks owns performance-load.benchmarks. Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Input: `rig-services/testing.performance-load.benchmarks.json`. Configuration validation only, so it confirms a benchmark workload, sample count and the single-sample flag are declared; it does not run benchmarks.

Disposition: executable.
Acceptance target: policy:testing.performance-load.benchmarks:minimal:benchmarks-source-code-boundary.
Declared predicates: benchmarks-source-code-boundary: `benchmark_workload` is nonempty (a string or array).
