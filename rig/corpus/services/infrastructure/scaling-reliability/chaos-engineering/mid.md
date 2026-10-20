# infrastructure.scaling-reliability.chaos-engineering — mid

Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: chaos-engineering-source-code-boundary, chaos-engineering-scaling-reliability-context.

Inspect the existing repository's chaos engineering convention, then name the source path or command that establishes it. For chaos engineering, inspect the repository's actual spec, source, test, or configuration for stop_conditions; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring scaling-reliability services outside the chaos engineering decision for scaling-reliability.chaos-engineering.

Acceptance target: policy:infrastructure.scaling-reliability.chaos-engineering:mid:chaos-engineering-source-code-boundary+chaos-engineering-scaling-reliability-context.

Declared predicates: chaos-engineering-source-code-boundary: `fault_scenarios` is nonempty (a string or array); chaos-engineering-scaling-reliability-context: `stop_conditions` is nonempty (a string or array).
