# testing.performance-load.benchmarks — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for benchmarks; it does not widen ownership beyond performance-load.benchmarks. The context signals are samples. Binding checks: benchmarks-performance-load-context.

Use the existing repository's benchmarks convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in performance-load under their own verdicts.

Acceptance target: fixture:testing.performance-load.benchmarks:repository-context. Given performance-load.benchmarks has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent performance load concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Owned scope: `performance-load.benchmarks`.

Offer: Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.

Input: `rig-services/testing.performance-load.benchmarks.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: benchmarks configuration validation only; declared policy does not prove running benchmarks behavior. Select an approved repository-owned command to verify that behavior.

minimal: benchmark workload — "serialize 1000 records".

mid: samples — 30.

maximal: single sample conclusion — false.
