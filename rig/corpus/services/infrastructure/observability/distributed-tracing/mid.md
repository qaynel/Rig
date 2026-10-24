# infrastructure.observability.distributed-tracing — mid

Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Policy grade, mid: Declare the sampling policy. Unbounded sampling costs money and storage, so set a rate or rule. Cumulative with minimal. Binding checks: distributed-tracing-source-code-boundary, distributed-tracing-observability-context.

Acceptance target: policy:infrastructure.observability.distributed-tracing:mid:distributed-tracing-source-code-boundary+distributed-tracing-observability-context.
Declared predicates: distributed-tracing-source-code-boundary: `trace_propagation` is nonempty (a string or array); distributed-tracing-observability-context: `sampling_policy` is nonempty (a string or array).
