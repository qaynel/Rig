# profiling

Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Owned scope: `code-profiling`, `bottleneck-identification`.

Offer: Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Input: `rig-services/development.performance.profiling.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: profiling configuration validation only; declared policy does not prove running profiling behavior. Select an approved repository-owned command to verify that behavior.

minimal: workload — "1000 item reads".

mid: measured metrics — ["latency_ms","allocations"].

maximal: optimize without measurement — false.

