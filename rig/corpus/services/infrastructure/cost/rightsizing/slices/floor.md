# infrastructure.cost.rightsizing — floor and mutation-floor slice

Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Policy grade slice. This slice bounds rightsizing to cost.rightsizing. It uses `rightsizing-slice-floor` and checks candidate_resources (nonempty): candidate resources must name the concrete repository contract.