# infrastructure.observability.distributed-tracing — minimal

Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for distributed tracing. The minimal boundary for distributed tracing checks trace_propagation (nonempty): trace propagation must name the concrete repository contract. Binding checks: distributed-tracing-source-code-boundary.

Use a repository-owned command or existing native check that can observe observability.distributed-tracing; bind it to the input named in `rig-services/infrastructure.observability.distributed-tracing.json` and preserve the check's failure status. When adopting this in an existing repository, connect distributed tracing to the command that inspects trace_propagation and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside observability.distributed-tracing as a failure.

Acceptance target: policy:infrastructure.observability.distributed-tracing:minimal:distributed-tracing-source-code-boundary.

Declared predicates: distributed-tracing-source-code-boundary: `trace_propagation` is nonempty (a string or array).
