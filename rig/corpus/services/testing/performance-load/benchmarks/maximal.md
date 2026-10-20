# testing.performance-load.benchmarks — maximal

Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: benchmarks-source-code-boundary, benchmarks-performance-load-context, benchmarks-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.performance-load.benchmarks:maximal:benchmarks-source-code-boundary+benchmarks-performance-load-context+benchmarks-evidence-receipt.

Declared predicates: benchmarks-source-code-boundary: `benchmark_workload` is nonempty (a string or array); benchmarks-performance-load-context: `samples` is numeric and at least 30; benchmarks-evidence-receipt: `single_sample_conclusion` equals false.
