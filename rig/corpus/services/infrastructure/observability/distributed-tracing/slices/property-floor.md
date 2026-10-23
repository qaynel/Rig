# infrastructure.observability.distributed-tracing — property-floor slice

Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Policy grade slice `distributed-tracing-slice-property-floor`: Declare how trace context propagates across HTTP and async hops. Broken propagation splits a request into orphan traces, so state the headers or carriers.
