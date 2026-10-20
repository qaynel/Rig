# testing.performance-load.benchmarks — maximal

Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Policy grade, maximal: Set concluding from a single sample to false. One timing cannot support a regression or optimization claim, so compare distributions. Cumulative with minimal and mid. Binding checks: benchmarks-source-code-boundary, benchmarks-performance-load-context, benchmarks-evidence-receipt.

Acceptance target: policy:testing.performance-load.benchmarks:maximal:benchmarks-source-code-boundary+benchmarks-performance-load-context+benchmarks-evidence-receipt.
Declared predicates: benchmarks-source-code-boundary: `benchmark_workload` is nonempty (a string or array); benchmarks-performance-load-context: `samples` is numeric and at least 30; benchmarks-evidence-receipt: `single_sample_conclusion` equals false.
