# development.performance.profiling — maximal

Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: profiling-source-code-boundary, profiling-performance-context, profiling-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.performance.profiling:maximal:profiling-source-code-boundary+profiling-performance-context+profiling-evidence-receipt.

Declared predicates: profiling-source-code-boundary: `workload` is nonempty (a string or array); profiling-performance-context: `measured_metrics` is nonempty (a string or array); profiling-evidence-receipt: `optimize_without_measurement` equals false.
