# infrastructure.observability.distributed-tracing — maximal

Maximal adds a replayable evidence receipt for distributed tracing. The evidence must preserve the trace_propagation, sampling_policy, record_sensitive_payloads inputs that determined the result.

Trace the verdict to a second run against unchanged distributed tracing inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.observability.distributed-tracing:evidence-replay. Given the observability.distributed-tracing binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
