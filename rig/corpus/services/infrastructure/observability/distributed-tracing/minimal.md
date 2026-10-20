# infrastructure.observability.distributed-tracing — minimal

Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Policy grade, minimal: Declare how trace context propagates across HTTP and async hops. Broken propagation splits a request into orphan traces, so state the headers or carriers. Binding checks: distributed-tracing-source-code-boundary.

Acceptance target: policy:infrastructure.observability.distributed-tracing:minimal:distributed-tracing-source-code-boundary.
Declared predicates: distributed-tracing-source-code-boundary: `trace_propagation` is nonempty (a string or array).
