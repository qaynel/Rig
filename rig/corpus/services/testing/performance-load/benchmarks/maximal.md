# testing.performance-load.benchmarks — maximal

Maximal adds a replayable evidence receipt for benchmarks. The evidence must preserve the benchmark_workload, samples, single_sample_conclusion inputs that determined the result.

Start from a second run against unchanged benchmarks inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: benchmarks configuration validation only; declared policy does not prove running benchmarks behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.performance-load.benchmarks:evidence-replay. Given the performance-load.benchmarks binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
