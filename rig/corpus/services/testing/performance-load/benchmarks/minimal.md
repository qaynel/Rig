# testing.performance-load.benchmarks — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for benchmarks. The minimal boundary for benchmarks checks benchmark_workload (nonempty): benchmark workload must name the concrete repository contract.. Binding checks: benchmarks-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe performance-load.benchmarks; bind it to the input named in `rig-services/testing.performance-load.benchmarks.json` and preserve the check's failure status. When adopting this in an existing repository, connect benchmarks to the command that inspects benchmark_workload and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside performance-load.benchmarks as a failure.

Acceptance target: fixture:testing.performance-load.benchmarks:policy-boundary. Given source-code is present and performance-load.benchmarks is selected, pass only when the repository binding evaluates performance-load.benchmarks and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern. The ceiling is benchmarks configuration validation only; declared policy does not prove running benchmarks behavior. Choose a repository-owned check that observes benchmarks from rig-services/testing.performance-load.benchmarks.json..

Service-specific evidence cues:
Offer: Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.
minimal: benchmark workload — "serialize 1000 records".
mid: samples — 30.
maximal: single sample conclusion — false.
