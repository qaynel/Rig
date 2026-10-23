# infrastructure.scaling-reliability.capacity-load — maximal

Evaluate capacity under a declared workload and latency objective. Bound the experiment duration and stop conditions before putting pressure on an environment.

Policy grade, maximal: Set unbounded load duration to false. An experiment without a stop time can damage the environment, so bound its length. Cumulative with minimal and mid. Binding checks: capacity-load-source-code-boundary, capacity-load-scaling-reliability-context, capacity-load-evidence-receipt.

Acceptance target: policy:infrastructure.scaling-reliability.capacity-load:maximal:capacity-load-source-code-boundary+capacity-load-scaling-reliability-context+capacity-load-evidence-receipt.
Declared predicates: capacity-load-source-code-boundary: `load_workload` is nonempty (a string or array); capacity-load-scaling-reliability-context: `slo_latency_ms` is numeric and at least 250; capacity-load-evidence-receipt: `unbounded_load_duration` equals false.
