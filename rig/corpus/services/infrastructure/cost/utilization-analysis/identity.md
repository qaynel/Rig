# infrastructure.cost.utilization-analysis — identity

Policy grade: utilization analysis owns cost.utilization-analysis. Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Keep neighboring cost services outside the utilization analysis decision for cost.utilization-analysis. Read the configured input at `rig-services/infrastructure.cost.utilization-analysis.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: utilization analysis configuration validation only; declared policy does not prove running utilization analysis behavior. Choose a repository-owned check that observes utilization analysis from rig-services/infrastructure.cost.utilization-analysis.json.

Acceptance target: fixture:infrastructure.cost.utilization-analysis:policy-boundary. Given source-code is present and cost.utilization-analysis is selected, pass only when the repository binding evaluates cost.utilization-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern.

Service-specific evidence cues:
Offer: Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.
minimal: observed resources — ["cpu","memory"].
mid: observation window days — 7.
maximal: decide from single peak — false.
