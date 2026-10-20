# infrastructure.cost.utilization-analysis — floor and mutation-floor slice

Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Policy grade slice. This slice bounds utilization analysis to cost.utilization-analysis. It uses `utilization-analysis-slice-floor` and checks observed_resources (nonempty): observed resources must name the concrete repository contract.