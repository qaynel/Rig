# development.architecture.design-review — floor and mutation-floor slice

This slice bounds design review to architecture.design-review. It uses `design-review-slice-floor` and checks reviewed_interfaces (nonempty): reviewed interfaces must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.architecture.design-review.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than design review configuration validation only; declared policy does not prove running design review behavior. Select an approved repository-owned command to verify that behavior.
