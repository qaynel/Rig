# development.performance.profiling — mid

Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Policy grade, mid: List the measured resource costs, such as CPU time or memory. Without numbers the bottleneck is a guess, so record the metrics. Cumulative with minimal. Binding checks: profiling-source-code-boundary, profiling-performance-context.

Acceptance target: policy:development.performance.profiling:mid:profiling-source-code-boundary+profiling-performance-context.
Declared predicates: profiling-source-code-boundary: `workload` is nonempty (a string or array); profiling-performance-context: `measured_metrics` is nonempty (a string or array).
