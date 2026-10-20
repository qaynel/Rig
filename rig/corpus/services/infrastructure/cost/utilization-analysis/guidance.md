# utilization-analysis

Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Owned scope: `cost.utilization-analysis`. Input: `rig-services/infrastructure.cost.utilization-analysis.json`.

Coverage ceiling: Configuration validation only, so it confirms observed resources, the observation window and the single-peak flag are declared; it does not read utilization data.

minimal: observed resources — ["cpu","memory"]. List the resources observed, such as CPU and memory. Watching one resource misses the constrained one, so name each.

mid: observation window days — 7. Observe for at least 7 days. A shorter window misses weekly cycles, so cover a representative period.

maximal: decide from single peak — false. Set deciding from a single peak to false. One spike does not establish steady-state capacity, so use the distribution.
