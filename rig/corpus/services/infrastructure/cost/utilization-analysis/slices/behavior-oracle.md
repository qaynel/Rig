# infrastructure.cost.utilization-analysis — behavior-oracle slice

Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Policy grade slice `utilization-analysis-slice-behavior-oracle`: List the resources observed, such as CPU and memory. Watching one resource misses the constrained one, so name each. Despite its name this slice is not a behavior oracle: it confirms observed resources, the observation window and the single-peak flag are declared; it does not read utilization data.
