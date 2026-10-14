# development.performance.profiling — maximal

Maximal adds a replayable evidence receipt for profiling. The evidence must preserve the workload, measured_metrics, optimize_without_measurement inputs that determined the result.

Trace the verdict to a second run against unchanged profiling inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: profiling configuration validation only; declared policy does not prove running profiling behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.performance.profiling:evidence-replay. Given the code-profiling binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
