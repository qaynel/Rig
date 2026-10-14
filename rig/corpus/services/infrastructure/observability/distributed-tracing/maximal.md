# infrastructure.observability.distributed-tracing — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for distributed tracing. The evidence must preserve the trace_propagation, sampling_policy, record_sensitive_payloads inputs that determined the result. Binding checks: distributed-tracing-evidence-receipt.

Trace the verdict to a second run against unchanged distributed tracing inputs. Record the trace_propagation, sampling_policy, record_sensitive_payloads inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this distributed tracing result is stale. The ceiling remains: distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Choose a repository-owned check that observes distributed tracing from rig-services/infrastructure.observability.distributed-tracing.json.

Acceptance target: fixture:infrastructure.observability.distributed-tracing:evidence-replay. Given the observability.distributed-tracing binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.
minimal: trace propagation — ["http","queue"].
mid: sampling policy — "bounded-head-sampling".
maximal: record sensitive payloads — false.
