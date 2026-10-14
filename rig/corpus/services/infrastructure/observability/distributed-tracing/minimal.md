# infrastructure.observability.distributed-tracing — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for distributed tracing. The minimal boundary for distributed tracing checks trace_propagation (nonempty): trace propagation must name the concrete repository contract.. Binding checks: distributed-tracing-source-code-boundary.

Use a repository-owned command or existing native check that can observe observability.distributed-tracing; bind it to the input named in `rig-services/infrastructure.observability.distributed-tracing.json` and preserve the check's failure status. When adopting this in an existing repository, connect distributed tracing to the command that inspects trace_propagation and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside observability.distributed-tracing as a failure.

Acceptance target: fixture:infrastructure.observability.distributed-tracing:policy-boundary. Given source-code is present and observability.distributed-tracing is selected, pass only when the repository binding evaluates observability.distributed-tracing and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern. The ceiling is distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Choose a repository-owned check that observes distributed tracing from rig-services/infrastructure.observability.distributed-tracing.json..

Service-specific evidence cues:
Offer: Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.
minimal: trace propagation — ["http","queue"].
mid: sampling policy — "bounded-head-sampling".
maximal: record sensitive payloads — false.
