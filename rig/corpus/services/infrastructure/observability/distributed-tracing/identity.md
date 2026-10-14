# infrastructure.observability.distributed-tracing — identity

Policy grade: distributed tracing owns observability.distributed-tracing. Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Keep sibling services in observability under their own verdicts. Read the configured input at `rig-services/infrastructure.observability.distributed-tracing.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.observability.distributed-tracing:policy-boundary. Given source-code is present and observability.distributed-tracing is selected, pass only when the repository binding evaluates observability.distributed-tracing and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern.

Service-specific evidence cues:
Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Owned scope: `observability.distributed-tracing`.

Offer: Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Input: `rig-services/infrastructure.observability.distributed-tracing.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Select an approved repository-owned command to verify that behavior.

minimal: trace propagation — ["http","queue"].

mid: sampling policy — "bounded-head-sampling".

maximal: record sensitive payloads — false.
