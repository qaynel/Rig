# development.performance.profiling — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for profiling; it does not widen ownership beyond code-profiling, bottleneck-identification. For profiling, inspect these context signals: measured_metrics. Binding checks: profiling-performance-context.

Start from the existing repository's profiling convention, then name the source path or command that establishes it. For profiling, inspect the repository's actual spec, source, test, or configuration for measured_metrics; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring performance services outside the profiling decision for code-profiling, bottleneck-identification.

Acceptance target: fixture:development.performance.profiling:repository-context. Given code-profiling has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent performance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Profile a representative workload and name the measured resource costs. Do not optimize from intuition when a repeatable measurement can establish the bottleneck.
minimal: workload — "1000 item reads".
mid: measured metrics — ["latency_ms","allocations"].
maximal: optimize without measurement — false.
