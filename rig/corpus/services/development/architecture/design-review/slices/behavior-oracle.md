# development.architecture.design-review — behavior-oracle slice

This slice bounds design review to architecture.design-review. It uses `design-review-slice-behavior-oracle` and checks reviewed_interfaces (nonempty): reviewed interfaces must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.architecture.design-review.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than design review configuration validation only; declared policy does not prove running design review behavior. Select an approved repository-owned command to verify that behavior.
