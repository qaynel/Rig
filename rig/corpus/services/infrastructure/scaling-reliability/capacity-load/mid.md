# infrastructure.scaling-reliability.capacity-load — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for capacity load; it does not widen ownership beyond scaling-reliability.capacity-load. For capacity load, inspect these context signals: slo_latency_ms. Binding checks: capacity-load-scaling-reliability-context.

Ground the decision in the existing repository's capacity load convention, then name the source path or command that establishes it. For capacity load, inspect the repository's actual spec, source, test, or configuration for slo_latency_ms; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring scaling-reliability services outside the capacity load decision for scaling-reliability.capacity-load.

Acceptance target: fixture:infrastructure.scaling-reliability.capacity-load:repository-context. Given scaling-reliability.capacity-load has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent scaling reliability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.
minimal: load workload — "100 concurrent requests".
mid: slo latency ms — 250.
maximal: unbounded load duration — false.
