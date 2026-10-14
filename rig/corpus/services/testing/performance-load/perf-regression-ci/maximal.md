# testing.performance-load.perf-regression-ci — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for perf regression ci. The evidence must preserve the tracked_metrics, regression_budget_percent, ignore_threshold_failure inputs that determined the result. Binding checks: perf-regression-ci-evidence-receipt.

Trace the verdict to a second run against unchanged perf regression ci inputs. Record the tracked_metrics, regression_budget_percent, ignore_threshold_failure inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this perf regression ci result is stale. The ceiling remains: perf regression ci configuration validation only; declared policy does not prove running perf regression ci behavior. Choose a repository-owned check that observes perf regression ci from rig-services/testing.performance-load.perf-regression-ci.json.

Acceptance target: fixture:testing.performance-load.perf-regression-ci:evidence-replay. Given the performance-load.perf-regression-ci binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.
minimal: tracked metrics — ["p95 latency"].
mid: regression budget percent — 10.
maximal: ignore threshold failure — false.
