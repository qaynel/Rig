# testing.performance-load.benchmarks — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for benchmarks. The evidence must preserve the benchmark_workload, samples, single_sample_conclusion inputs that determined the result. Binding checks: benchmarks-evidence-receipt.

Start from a second run against unchanged benchmarks inputs. Record the benchmark_workload, samples, single_sample_conclusion inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this benchmarks result is stale. The ceiling remains: benchmarks configuration validation only; declared policy does not prove running benchmarks behavior. Choose a repository-owned check that observes benchmarks from rig-services/testing.performance-load.benchmarks.json.

Acceptance target: fixture:testing.performance-load.benchmarks:evidence-replay. Given the performance-load.benchmarks binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Benchmark a named workload with enough repeated samples to characterize variance. A single timing measurement cannot support a regression or optimization claim.
minimal: benchmark workload — "serialize 1000 records".
mid: samples — 30.
maximal: single sample conclusion — false.
