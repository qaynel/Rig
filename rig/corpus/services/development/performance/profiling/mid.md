# development.performance.profiling — mid

Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: profiling-source-code-boundary, profiling-performance-context.

Start from the existing repository's profiling convention, then name the source path or command that establishes it. For profiling, inspect the repository's actual spec, source, test, or configuration for measured_metrics; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring performance services outside the profiling decision for code-profiling, bottleneck-identification.

Acceptance target: policy:development.performance.profiling:mid:profiling-source-code-boundary+profiling-performance-context.

Declared predicates: profiling-source-code-boundary: `workload` is nonempty (a string or array); profiling-performance-context: `measured_metrics` is nonempty (a string or array).
