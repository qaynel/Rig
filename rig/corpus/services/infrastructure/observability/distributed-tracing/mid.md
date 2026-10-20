# infrastructure.observability.distributed-tracing — mid

Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: distributed-tracing-source-code-boundary, distributed-tracing-observability-context.

Start from the existing repository's distributed tracing convention, then name the source path or command that establishes it. For distributed tracing, inspect the repository's actual spec, source, test, or configuration for sampling_policy; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring observability services outside the distributed tracing decision for observability.distributed-tracing.

Acceptance target: policy:infrastructure.observability.distributed-tracing:mid:distributed-tracing-source-code-boundary+distributed-tracing-observability-context.

Declared predicates: distributed-tracing-source-code-boundary: `trace_propagation` is nonempty (a string or array); distributed-tracing-observability-context: `sampling_policy` is nonempty (a string or array).
