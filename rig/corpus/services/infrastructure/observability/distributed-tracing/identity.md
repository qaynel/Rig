# infrastructure.observability.distributed-tracing — identity

Policy grade: distributed-tracing owns observability.distributed-tracing. Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Input: `rig-services/infrastructure.observability.distributed-tracing.json`. Configuration validation only, so it confirms trace propagation, a sampling policy and the sensitive-payload flag are declared; it does not show traces are collected.

Disposition: executable.
Acceptance target: policy:infrastructure.observability.distributed-tracing:minimal:distributed-tracing-source-code-boundary.
Declared predicates: distributed-tracing-source-code-boundary: `trace_propagation` is nonempty (a string or array).
