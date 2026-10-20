# infrastructure.observability.distributed-tracing — identity

Policy grade: distributed tracing owns observability.distributed-tracing. Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Keep neighboring observability services outside the distributed tracing decision for observability.distributed-tracing. Read the configured input at `rig-services/infrastructure.observability.distributed-tracing.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Choose a repository-owned check that observes distributed tracing from rig-services/infrastructure.observability.distributed-tracing.json.

Acceptance target: policy:infrastructure.observability.distributed-tracing:minimal:distributed-tracing-source-code-boundary.

Declared predicates: distributed-tracing-source-code-boundary: `trace_propagation` is nonempty (a string or array).
