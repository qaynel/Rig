# profiling

Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Owned scope: `code-profiling, bottleneck-identification`. Input: `rig-services/development.performance.profiling.json`.

Coverage ceiling: Configuration validation only, so it confirms the workload, measured metrics and the no-guess flag are declared; it does not show a profile was actually taken.

minimal: workload — "1000 item reads". Name the representative workload that was profiled. A profile of an unspecified run cannot be repeated, so describe the input and environment.

mid: measured metrics — ["latency_ms","allocations"]. List the measured resource costs, such as CPU time or memory. Without numbers the bottleneck is a guess, so record the metrics.

maximal: optimize without measurement — false. Set optimizing without measurement to false. Optimizing from intuition wastes effort and can regress other paths, so measure first.
