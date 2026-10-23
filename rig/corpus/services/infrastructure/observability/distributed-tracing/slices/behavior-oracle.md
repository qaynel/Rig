# infrastructure.observability.distributed-tracing — behavior-oracle slice

Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Policy grade slice `distributed-tracing-slice-behavior-oracle`: Declare how trace context propagates across HTTP and async hops. Broken propagation splits a request into orphan traces, so state the headers or carriers. Despite its name this slice is not a behavior oracle: it confirms trace propagation, a sampling policy and the sensitive-payload flag are declared; it does not show traces are collected.
