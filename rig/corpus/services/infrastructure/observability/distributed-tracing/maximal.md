# infrastructure.observability.distributed-tracing — maximal

Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: distributed-tracing-source-code-boundary, distributed-tracing-observability-context, distributed-tracing-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.observability.distributed-tracing:maximal:distributed-tracing-source-code-boundary+distributed-tracing-observability-context+distributed-tracing-evidence-receipt.

Declared predicates: distributed-tracing-source-code-boundary: `trace_propagation` is nonempty (a string or array); distributed-tracing-observability-context: `sampling_policy` is nonempty (a string or array); distributed-tracing-evidence-receipt: `record_sensitive_payloads` equals false.
