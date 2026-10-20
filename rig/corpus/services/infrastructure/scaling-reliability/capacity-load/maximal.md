# infrastructure.scaling-reliability.capacity-load — maximal

Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: capacity-load-source-code-boundary, capacity-load-scaling-reliability-context, capacity-load-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.scaling-reliability.capacity-load:maximal:capacity-load-source-code-boundary+capacity-load-scaling-reliability-context+capacity-load-evidence-receipt.

Declared predicates: capacity-load-source-code-boundary: `load_workload` is nonempty (a string or array); capacity-load-scaling-reliability-context: `slo_latency_ms` is numeric and at least 250; capacity-load-evidence-receipt: `unbounded_load_duration` equals false.
