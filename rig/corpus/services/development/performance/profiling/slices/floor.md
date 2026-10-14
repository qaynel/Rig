# development.performance.profiling — floor and mutation-floor slice

Policy grade slice. This slice bounds profiling to code-profiling, bottleneck-identification. It uses `profiling-slice-floor` and checks workload (nonempty): workload must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.performance.profiling.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than profiling configuration validation only; declared policy does not prove running profiling behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Owned scope: `code-profiling`, `bottleneck-identification`.

Offer: Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Input: `rig-services/development.performance.profiling.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: profiling configuration validation only; declared policy does not prove running profiling behavior. Select an approved repository-owned command to verify that behavior.

minimal: workload — "1000 item reads".

mid: measured metrics — ["latency_ms","allocations"].

maximal: optimize without measurement — false.
