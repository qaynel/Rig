# infrastructure.cost.rightsizing — property-floor slice

Policy grade slice. This slice bounds rightsizing to cost.rightsizing. It uses `rightsizing-slice-property-floor` and checks candidate_resources (nonempty): candidate resources must name the concrete repository contract..

For rightsizing, choose a repository example that satisfies candidate_resources at the property-floor floor, plus a failure where candidate resources must name the concrete repository contract. is false. For rightsizing, wire `property-floor` to `rig-services/infrastructure.cost.rightsizing.json` and keep its verdict on candidate_resources; missing evidence is a named gap, with ceiling rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Choose a repository-owned check that observes rightsizing from rig-services/infrastructure.cost.rightsizing.json..

Service-specific evidence cues:
Offer: Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.
minimal: candidate resources — ["worker pool"].
mid: minimum headroom percent — 20.
maximal: resize without workload evidence — false.
