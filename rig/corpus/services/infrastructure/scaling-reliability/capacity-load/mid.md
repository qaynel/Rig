# infrastructure.scaling-reliability.capacity-load — mid

Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Policy grade, mid: Set the latency objective in milliseconds, at least 250. A tighter figure cannot be evidenced here, so choose a measurable limit. Cumulative with minimal. Binding checks: capacity-load-source-code-boundary, capacity-load-scaling-reliability-context.

Acceptance target: policy:infrastructure.scaling-reliability.capacity-load:mid:capacity-load-source-code-boundary+capacity-load-scaling-reliability-context.
Declared predicates: capacity-load-source-code-boundary: `load_workload` is nonempty (a string or array); capacity-load-scaling-reliability-context: `slo_latency_ms` is numeric and at least 250.
