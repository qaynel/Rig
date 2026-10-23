# infrastructure.cost.utilization-analysis — minimal

Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Policy grade, minimal: List the resources observed, such as CPU and memory. Watching one resource misses the constrained one, so name each. Binding checks: utilization-analysis-source-code-boundary.

Acceptance target: policy:infrastructure.cost.utilization-analysis:minimal:utilization-analysis-source-code-boundary.
Declared predicates: utilization-analysis-source-code-boundary: `observed_resources` is nonempty (a string or array).
