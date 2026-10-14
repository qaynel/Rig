# testing.performance-load.perf-regression-ci — maximal

Maximal adds a replayable evidence receipt for perf regression ci. The evidence must preserve the tracked_metrics, regression_budget_percent, ignore_threshold_failure inputs that determined the result.

Trace the verdict to a second run against unchanged perf regression ci inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: perf regression ci configuration validation only; declared policy does not prove running perf regression ci behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.performance-load.perf-regression-ci:evidence-replay. Given the performance-load.perf-regression-ci binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
