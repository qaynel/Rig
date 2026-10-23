# infrastructure.cost.rightsizing — behavior-oracle slice

Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Policy grade slice `rightsizing-slice-behavior-oracle`: List the resources considered for resizing. Without candidates nothing is selected from data, so name each resource. Despite its name this slice is not a behavior oracle: it confirms candidate resources, headroom and the no-evidence-resize flag are declared; it does not read workload measurements.
