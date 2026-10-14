# development.performance.profiling — property-floor slice

Policy grade slice. This slice bounds profiling to code-profiling, bottleneck-identification. It uses `profiling-slice-property-floor` and checks workload (nonempty): workload must name the concrete repository contract..

For profiling, choose a repository example that satisfies workload at the property-floor floor, plus a failure where workload must name the concrete repository contract. is false. For profiling, wire `property-floor` to `rig-services/development.performance.profiling.json` and keep its verdict on workload; missing evidence is a named gap, with ceiling profiling configuration validation only; declared policy does not prove running profiling behavior. Choose a repository-owned check that observes profiling from rig-services/development.performance.profiling.json..

Service-specific evidence cues:
Offer: Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.
minimal: workload — "1000 item reads".
mid: measured metrics — ["latency_ms","allocations"].
maximal: optimize without measurement — false.
