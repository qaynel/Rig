# infrastructure.scaling-reliability.capacity-load — mid

Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: capacity-load-source-code-boundary, capacity-load-scaling-reliability-context.

Ground the decision in the existing repository's capacity load convention, then name the source path or command that establishes it. For capacity load, inspect the repository's actual spec, source, test, or configuration for slo_latency_ms; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring scaling-reliability services outside the capacity load decision for scaling-reliability.capacity-load.

Acceptance target: policy:infrastructure.scaling-reliability.capacity-load:mid:capacity-load-source-code-boundary+capacity-load-scaling-reliability-context.

Declared predicates: capacity-load-source-code-boundary: `load_workload` is nonempty (a string or array); capacity-load-scaling-reliability-context: `slo_latency_ms` is numeric and at least 250.
