# infrastructure.cost.utilization-analysis — identity

Policy grade: utilization analysis owns cost.utilization-analysis. Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Keep neighboring cost services outside the utilization analysis decision for cost.utilization-analysis. Read the configured input at `rig-services/infrastructure.cost.utilization-analysis.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: utilization analysis configuration validation only; declared policy does not prove running utilization analysis behavior. Choose a repository-owned check that observes utilization analysis from rig-services/infrastructure.cost.utilization-analysis.json.

Acceptance target: policy:infrastructure.cost.utilization-analysis:minimal:utilization-analysis-source-code-boundary.

Declared predicates: utilization-analysis-source-code-boundary: `observed_resources` is nonempty (a string or array).
