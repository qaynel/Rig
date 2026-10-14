# development.performance.profiling — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for profiling. The evidence must preserve the workload, measured_metrics, optimize_without_measurement inputs that determined the result. Binding checks: profiling-evidence-receipt.

Trace the verdict to a second run against unchanged profiling inputs. Record the workload, measured_metrics, optimize_without_measurement inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this profiling result is stale. The ceiling remains: profiling configuration validation only; declared policy does not prove running profiling behavior. Choose a repository-owned check that observes profiling from rig-services/development.performance.profiling.json.

Acceptance target: fixture:development.performance.profiling:evidence-replay. Given the code-profiling binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.
minimal: workload — "1000 item reads".
mid: measured metrics — ["latency_ms","allocations"].
maximal: optimize without measurement — false.
