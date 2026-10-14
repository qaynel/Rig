# infrastructure.cost.rightsizing — behavior-oracle slice

This slice bounds rightsizing to cost.rightsizing. It uses `rightsizing-slice-behavior-oracle` and checks candidate_resources (nonempty): candidate resources must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.cost.rightsizing.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Select an approved repository-owned command to verify that behavior.
