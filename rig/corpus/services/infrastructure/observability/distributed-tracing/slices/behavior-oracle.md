# infrastructure.observability.distributed-tracing — behavior-oracle slice

Policy grade slice. This slice bounds distributed tracing to observability.distributed-tracing. It uses `distributed-tracing-slice-behavior-oracle` and checks trace_propagation (nonempty): trace propagation must name the concrete repository contract..

For distributed tracing, choose a repository example that satisfies trace_propagation at the behavior-oracle floor, plus a failure where trace propagation must name the concrete repository contract. is false. For distributed tracing, wire `behavior-oracle` to `rig-services/infrastructure.observability.distributed-tracing.json` and keep its verdict on trace_propagation; missing evidence is a named gap, with ceiling distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Choose a repository-owned check that observes distributed tracing from rig-services/infrastructure.observability.distributed-tracing.json..

Service-specific evidence cues:
Offer: Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.
minimal: trace propagation — ["http","queue"].
mid: sampling policy — "bounded-head-sampling".
maximal: record sensitive payloads — false.
