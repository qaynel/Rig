# testing.performance-load.benchmarks — identity

Policy grade: benchmarks owns performance-load.benchmarks. Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Keep neighboring performance-load services outside the benchmarks decision for performance-load.benchmarks. Tie acceptance to the configured input at `rig-services/testing.performance-load.benchmarks.json`; malformed input is still attributed to that path.

Disposition: executable. Read the limit: benchmarks configuration validation only; declared policy does not prove running benchmarks behavior. Choose a repository-owned check that observes benchmarks from rig-services/testing.performance-load.benchmarks.json.

Acceptance target: policy:testing.performance-load.benchmarks:minimal:benchmarks-source-code-boundary.

Declared predicates: benchmarks-source-code-boundary: `benchmark_workload` is nonempty (a string or array).
