# testing.performance-load.benchmarks — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for benchmarks. It checks benchmark_workload (nonempty): benchmark workload must name the concrete repository contract.. Binding checks: benchmarks-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe performance-load.benchmarks; bind it to the input named in `rig-services/testing.performance-load.benchmarks.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside performance-load.benchmarks is a failure.

Acceptance target: fixture:testing.performance-load.benchmarks:policy-boundary. Given source-code is present and performance-load.benchmarks is selected, pass only when the repository binding evaluates performance-load.benchmarks and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Owned scope: `performance-load.benchmarks`.

Offer: Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Input: `rig-services/testing.performance-load.benchmarks.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: benchmarks configuration validation only; declared policy does not prove running benchmarks behavior. Select an approved repository-owned command to verify that behavior.

minimal: benchmark workload — "serialize 1000 records".

mid: samples — 30.

maximal: single sample conclusion — false.
