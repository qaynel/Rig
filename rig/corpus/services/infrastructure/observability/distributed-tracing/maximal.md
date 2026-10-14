# infrastructure.observability.distributed-tracing — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for distributed tracing. The evidence must preserve the trace_propagation, sampling_policy, record_sensitive_payloads inputs that determined the result. Binding checks: distributed-tracing-evidence-receipt.

Trace the verdict to a second run against unchanged distributed tracing inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.observability.distributed-tracing:evidence-replay. Given the observability.distributed-tracing binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Owned scope: `observability.distributed-tracing`.

Offer: Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Input: `rig-services/infrastructure.observability.distributed-tracing.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Select an approved repository-owned command to verify that behavior.

minimal: trace propagation — ["http","queue"].

mid: sampling policy — "bounded-head-sampling".

maximal: record sensitive payloads — false.
