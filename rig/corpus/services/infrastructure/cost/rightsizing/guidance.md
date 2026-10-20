# rightsizing

Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Owned scope: `cost.rightsizing`. Input: `rig-services/infrastructure.cost.rightsizing.json`.

Coverage ceiling: Configuration validation only, so it confirms candidate resources, headroom and the no-evidence-resize flag are declared; it does not read workload measurements.

minimal: candidate resources — ["worker pool"]. List the resources considered for resizing. Without candidates nothing is selected from data, so name each resource.

mid: minimum headroom percent — 20. Keep minimum headroom of at least 20 percent. Shrinking to zero headroom risks outages on a spike, so retain the margin.

maximal: resize without workload evidence — false. Set resizing without workload evidence to false. Configuration alone cannot justify shrinking production, so require measurements.
