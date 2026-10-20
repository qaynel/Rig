# infrastructure.cost.utilization-analysis — mid

Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: utilization-analysis-source-code-boundary, utilization-analysis-cost-context.

Start from the existing repository's utilization analysis convention, then name the source path or command that establishes it. For utilization analysis, inspect the repository's actual spec, source, test, or configuration for observation_window_days; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring cost services outside the utilization analysis decision for cost.utilization-analysis.

Acceptance target: policy:infrastructure.cost.utilization-analysis:mid:utilization-analysis-source-code-boundary+utilization-analysis-cost-context.

Declared predicates: utilization-analysis-source-code-boundary: `observed_resources` is nonempty (a string or array); utilization-analysis-cost-context: `observation_window_days` is numeric and at least 7.
