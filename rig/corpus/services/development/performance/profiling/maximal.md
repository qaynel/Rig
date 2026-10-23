# development.performance.profiling — maximal

Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Policy grade, maximal: Set optimizing without measurement to false. Optimizing from intuition wastes effort and can regress other paths, so measure first. Cumulative with minimal and mid. Binding checks: profiling-source-code-boundary, profiling-performance-context, profiling-evidence-receipt.

Acceptance target: policy:development.performance.profiling:maximal:profiling-source-code-boundary+profiling-performance-context+profiling-evidence-receipt.
Declared predicates: profiling-source-code-boundary: `workload` is nonempty (a string or array); profiling-performance-context: `measured_metrics` is nonempty (a string or array); profiling-evidence-receipt: `optimize_without_measurement` equals false.
