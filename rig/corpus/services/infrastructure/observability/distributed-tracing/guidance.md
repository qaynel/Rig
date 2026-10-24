# distributed-tracing

Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Owned scope: `observability.distributed-tracing`. Input: `rig-services/infrastructure.observability.distributed-tracing.json`.

Coverage ceiling: Configuration validation only, so it confirms trace propagation, a sampling policy and the sensitive-payload flag are declared; it does not show traces are collected.

minimal: trace propagation — ["http","queue"]. Declare how trace context propagates across HTTP and async hops. Broken propagation splits a request into orphan traces, so state the headers or carriers.

mid: sampling policy — "bounded-head-sampling". Declare the sampling policy. Unbounded sampling costs money and storage, so set a rate or rule.

maximal: record sensitive payloads — false. Set recording sensitive payloads to false. Request bodies as trace attributes leak data, so record identifiers only.
