# development.performance.profiling — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for profiling. The evidence must preserve the workload, measured_metrics, optimize_without_measurement inputs that determined the result. Binding checks: profiling-evidence-receipt.

Trace the verdict to a second run against unchanged profiling inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: profiling configuration validation only; declared policy does not prove running profiling behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.performance.profiling:evidence-replay. Given the code-profiling binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Owned scope: `code-profiling`, `bottleneck-identification`.

Offer: Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Input: `rig-services/development.performance.profiling.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: profiling configuration validation only; declared policy does not prove running profiling behavior. Select an approved repository-owned command to verify that behavior.

minimal: workload — "1000 item reads".

mid: measured metrics — ["latency_ms","allocations"].

maximal: optimize without measurement — false.
