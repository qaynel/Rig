# infrastructure.cost.rightsizing — floor and mutation-floor slice

Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Policy grade slice `rightsizing-slice-floor`: List the resources considered for resizing. Without candidates nothing is selected from data, so name each resource.
