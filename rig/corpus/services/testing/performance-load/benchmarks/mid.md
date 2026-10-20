# testing.performance-load.benchmarks — mid

Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Policy grade, mid: Take at least 30 samples. Fewer cannot characterize variance, so declare the sample count. Cumulative with minimal. Binding checks: benchmarks-source-code-boundary, benchmarks-performance-load-context.

Acceptance target: policy:testing.performance-load.benchmarks:mid:benchmarks-source-code-boundary+benchmarks-performance-load-context.
Declared predicates: benchmarks-source-code-boundary: `benchmark_workload` is nonempty (a string or array); benchmarks-performance-load-context: `samples` is numeric and at least 30.
