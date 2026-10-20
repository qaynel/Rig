# infrastructure.observability.distributed-tracing — behavior-oracle slice

Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Policy grade slice. This slice bounds distributed tracing to observability.distributed-tracing. It uses `distributed-tracing-slice-behavior-oracle` and checks trace_propagation (nonempty): trace propagation must name the concrete repository contract.