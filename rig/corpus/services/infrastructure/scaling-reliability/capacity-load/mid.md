# infrastructure.scaling-reliability.capacity-load — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for capacity load; it does not widen ownership beyond scaling-reliability.capacity-load. The context signals are slo_latency_ms. Binding checks: capacity-load-scaling-reliability-context.

Ground the decision in the existing repository's capacity load convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in scaling-reliability under their own verdicts.

Acceptance target: fixture:infrastructure.scaling-reliability.capacity-load:repository-context. Given scaling-reliability.capacity-load has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent scaling reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Owned scope: `scaling-reliability.capacity-load`.

Offer: Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Input: `rig-services/infrastructure.scaling-reliability.capacity-load.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: capacity load configuration validation only; declared policy does not prove running capacity load behavior. Select an approved repository-owned command to verify that behavior.

minimal: load workload — "100 concurrent requests".

mid: slo latency ms — 250.

maximal: unbounded load duration — false.
