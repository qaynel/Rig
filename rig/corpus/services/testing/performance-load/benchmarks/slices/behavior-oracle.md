# testing.performance-load.benchmarks — behavior-oracle slice

Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Policy grade slice `benchmarks-slice-behavior-oracle`: Name the workload benchmarked. A benchmark of an unspecified input cannot be compared, so describe it. Despite its name this slice is not a behavior oracle: it confirms a benchmark workload, sample count and the single-sample flag are declared; it does not run benchmarks.
