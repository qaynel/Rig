# infrastructure.observability.distributed-tracing — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for distributed tracing; it does not widen ownership beyond observability.distributed-tracing. For distributed tracing, inspect these context signals: sampling_policy. Binding checks: distributed-tracing-observability-context.

Start from the existing repository's distributed tracing convention, then name the source path or command that establishes it. For distributed tracing, inspect the repository's actual spec, source, test, or configuration for sampling_policy; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring observability services outside the distributed tracing decision for observability.distributed-tracing.

Acceptance target: fixture:infrastructure.observability.distributed-tracing:repository-context. Given observability.distributed-tracing has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent observability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Propagate trace context across HTTP and asynchronous boundaries and bound sampling costs. Sensitive request bodies must not become trace attributes.
minimal: trace propagation — ["http","queue"].
mid: sampling policy — "bounded-head-sampling".
maximal: record sensitive payloads — false.
