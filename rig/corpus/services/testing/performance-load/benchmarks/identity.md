# testing.performance-load.benchmarks — identity

benchmarks owns performance-load.benchmarks. Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Keep sibling services in performance-load under their own verdicts. Tie acceptance to the configured input at `rig-services/testing.performance-load.benchmarks.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: benchmarks configuration validation only; declared policy does not prove running benchmarks behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.performance-load.benchmarks:policy-boundary. Given source-code is present and performance-load.benchmarks is selected, pass only when the repository binding evaluates performance-load.benchmarks and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern.
