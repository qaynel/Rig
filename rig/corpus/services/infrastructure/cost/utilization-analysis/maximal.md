# infrastructure.cost.utilization-analysis — maximal

Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Policy grade, maximal: Set deciding from a single peak to false. One spike does not establish steady-state capacity, so use the distribution. Cumulative with minimal and mid. Binding checks: utilization-analysis-source-code-boundary, utilization-analysis-cost-context, utilization-analysis-evidence-receipt.

Acceptance target: policy:infrastructure.cost.utilization-analysis:maximal:utilization-analysis-source-code-boundary+utilization-analysis-cost-context+utilization-analysis-evidence-receipt.
Declared predicates: utilization-analysis-source-code-boundary: `observed_resources` is nonempty (a string or array); utilization-analysis-cost-context: `observation_window_days` is numeric and at least 7; utilization-analysis-evidence-receipt: `decide_from_single_peak` equals false.
