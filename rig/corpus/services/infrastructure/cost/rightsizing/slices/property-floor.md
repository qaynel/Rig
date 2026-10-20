# infrastructure.cost.rightsizing — property-floor slice

Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Policy grade slice. This slice bounds rightsizing to cost.rightsizing. It uses `rightsizing-slice-property-floor` and checks candidate_resources (nonempty): candidate resources must name the concrete repository contract.