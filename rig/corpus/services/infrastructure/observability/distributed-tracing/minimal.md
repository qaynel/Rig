# infrastructure.observability.distributed-tracing — minimal

Minimal establishes a non-vacuous policy boundary for distributed tracing. It checks trace_propagation (nonempty): trace propagation must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe observability.distributed-tracing; bind it to the input named in `rig-services/infrastructure.observability.distributed-tracing.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside observability.distributed-tracing is a failure.

Acceptance target: fixture:infrastructure.observability.distributed-tracing:policy-boundary. Given source-code is present and observability.distributed-tracing is selected, pass only when the repository binding evaluates observability.distributed-tracing and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern. A passing policy check does not establish runtime behavior.
