# infrastructure.scaling-reliability.capacity-load — minimal

Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Policy grade, minimal: Describe the workload used to size capacity. Capacity against an unspecified load means nothing, so state the request mix and rate. Binding checks: capacity-load-source-code-boundary.

Acceptance target: policy:infrastructure.scaling-reliability.capacity-load:minimal:capacity-load-source-code-boundary.
Declared predicates: capacity-load-source-code-boundary: `load_workload` is nonempty (a string or array).
