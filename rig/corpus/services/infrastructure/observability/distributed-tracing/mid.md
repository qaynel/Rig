# infrastructure.observability.distributed-tracing — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for distributed tracing; it does not widen ownership beyond observability.distributed-tracing. The context signals are sampling_policy. Binding checks: distributed-tracing-observability-context.

Start from the existing repository's distributed tracing convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in observability under their own verdicts.

Acceptance target: fixture:infrastructure.observability.distributed-tracing:repository-context. Given observability.distributed-tracing has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent observability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Owned scope: `observability.distributed-tracing`.

Offer: Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.

Input: `rig-services/infrastructure.observability.distributed-tracing.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Select an approved repository-owned command to verify that behavior.

minimal: trace propagation — ["http","queue"].

mid: sampling policy — "bounded-head-sampling".

maximal: record sensitive payloads — false.
