# infrastructure.cost.utilization-analysis — behavior-oracle slice

Policy grade slice. This slice bounds utilization analysis to cost.utilization-analysis. It uses `utilization-analysis-slice-behavior-oracle` and checks observed_resources (nonempty): observed resources must name the concrete repository contract..

For utilization analysis, choose a repository example that satisfies observed_resources at the behavior-oracle floor, plus a failure where observed resources must name the concrete repository contract. is false. For utilization analysis, wire `behavior-oracle` to `rig-services/infrastructure.cost.utilization-analysis.json` and keep its verdict on observed_resources; missing evidence is a named gap, with ceiling utilization analysis configuration validation only; declared policy does not prove running utilization analysis behavior. Choose a repository-owned check that observes utilization analysis from rig-services/infrastructure.cost.utilization-analysis.json..

Service-specific evidence cues:
Offer: Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.
minimal: observed resources — ["cpu","memory"].
mid: observation window days — 7.
maximal: decide from single peak — false.
