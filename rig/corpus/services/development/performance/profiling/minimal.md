# development.performance.profiling — minimal

Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Policy grade, minimal: Name the representative workload that was profiled. A profile of an unspecified run cannot be repeated, so describe the input and environment. Binding checks: profiling-source-code-boundary.

Acceptance target: policy:development.performance.profiling:minimal:profiling-source-code-boundary.
Declared predicates: profiling-source-code-boundary: `workload` is nonempty (a string or array).
