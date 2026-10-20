# testing.performance-load.benchmarks — mid

Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: benchmarks-source-code-boundary, benchmarks-performance-load-context.

Acceptance target: policy:testing.performance-load.benchmarks:mid:benchmarks-source-code-boundary+benchmarks-performance-load-context.

Declared predicates: benchmarks-source-code-boundary: `benchmark_workload` is nonempty (a string or array); benchmarks-performance-load-context: `samples` is numeric and at least 30.
