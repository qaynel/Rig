# testing.performance-load.benchmarks — minimal

Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Policy grade, minimal: Name the workload benchmarked. A benchmark of an unspecified input cannot be compared, so describe it. Binding checks: benchmarks-source-code-boundary.

Acceptance target: policy:testing.performance-load.benchmarks:minimal:benchmarks-source-code-boundary.
Declared predicates: benchmarks-source-code-boundary: `benchmark_workload` is nonempty (a string or array).
