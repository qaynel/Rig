# testing.performance-load.benchmarks — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for benchmarks; it does not widen ownership beyond performance-load.benchmarks. For benchmarks, inspect these context signals: samples. Binding checks: benchmarks-performance-load-context.

Use the existing repository's benchmarks convention, then name the source path or command that establishes it. For benchmarks, inspect the repository's actual spec, source, test, or configuration for samples; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring performance-load services outside the benchmarks decision for performance-load.benchmarks.

Acceptance target: fixture:testing.performance-load.benchmarks:repository-context. Given performance-load.benchmarks has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent performance load concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.
minimal: benchmark workload — "serialize 1000 records".
mid: samples — 30.
maximal: single sample conclusion — false.
