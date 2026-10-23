# infrastructure.cost.utilization-analysis — identity

Policy grade: utilization-analysis owns cost.utilization-analysis. Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Input: `rig-services/infrastructure.cost.utilization-analysis.json`. Configuration validation only, so it confirms observed resources, the observation window and the single-peak flag are declared; it does not read utilization data.

Disposition: executable.
Acceptance target: policy:infrastructure.cost.utilization-analysis:minimal:utilization-analysis-source-code-boundary.
Declared predicates: utilization-analysis-source-code-boundary: `observed_resources` is nonempty (a string or array).
