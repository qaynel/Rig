# infrastructure.observability.distributed-tracing — maximal

Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Policy grade, maximal: Set recording sensitive payloads to false. Request bodies as trace attributes leak data, so record identifiers only. Cumulative with minimal and mid. Binding checks: distributed-tracing-source-code-boundary, distributed-tracing-observability-context, distributed-tracing-evidence-receipt.

Acceptance target: policy:infrastructure.observability.distributed-tracing:maximal:distributed-tracing-source-code-boundary+distributed-tracing-observability-context+distributed-tracing-evidence-receipt.
Declared predicates: distributed-tracing-source-code-boundary: `trace_propagation` is nonempty (a string or array); distributed-tracing-observability-context: `sampling_policy` is nonempty (a string or array); distributed-tracing-evidence-receipt: `record_sensitive_payloads` equals false.
