# infrastructure.cost.utilization-analysis — mid

Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Policy grade, mid: Observe for at least 7 days. A shorter window misses weekly cycles, so cover a representative period. Cumulative with minimal. Binding checks: utilization-analysis-source-code-boundary, utilization-analysis-cost-context.

Acceptance target: policy:infrastructure.cost.utilization-analysis:mid:utilization-analysis-source-code-boundary+utilization-analysis-cost-context.
Declared predicates: utilization-analysis-source-code-boundary: `observed_resources` is nonempty (a string or array); utilization-analysis-cost-context: `observation_window_days` is numeric and at least 7.
