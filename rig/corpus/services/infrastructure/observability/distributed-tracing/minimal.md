# infrastructure.observability.distributed-tracing — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for distributed tracing. It checks trace_propagation (nonempty): trace propagation must name the concrete repository contract.. Binding checks: distributed-tracing-source-code-boundary.

Use a repository-owned command or existing native check that can observe observability.distributed-tracing; bind it to the input named in `rig-services/infrastructure.observability.distributed-tracing.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside observability.distributed-tracing is a failure.

Acceptance target: fixture:infrastructure.observability.distributed-tracing:policy-boundary. Given source-code is present and observability.distributed-tracing is selected, pass only when the repository binding evaluates observability.distributed-tracing and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Owned scope: `observability.distributed-tracing`.

Offer: Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Input: `rig-services/infrastructure.observability.distributed-tracing.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Select an approved repository-owned command to verify that behavior.

minimal: trace propagation — ["http","queue"].

mid: sampling policy — "bounded-head-sampling".

maximal: record sensitive payloads — false.
