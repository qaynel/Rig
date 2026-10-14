# infrastructure.observability.distributed-tracing — floor and mutation-floor slice

Policy grade slice. This slice bounds distributed tracing to observability.distributed-tracing. It uses `distributed-tracing-slice-floor` and checks trace_propagation (nonempty): trace propagation must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.observability.distributed-tracing.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Owned scope: `observability.distributed-tracing`.

Offer: Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Input: `rig-services/infrastructure.observability.distributed-tracing.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Select an approved repository-owned command to verify that behavior.

minimal: trace propagation — ["http","queue"].

mid: sampling policy — "bounded-head-sampling".

maximal: record sensitive payloads — false.
