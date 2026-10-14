# testing.maintenance.dead-test-pruning — behavior-oracle slice

This slice bounds dead test pruning to maintenance.dead-test-pruning. It uses `dead-test-pruning-slice-behavior-oracle` and checks obsolete_cases (nonempty): obsolete cases must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.maintenance.dead-test-pruning.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than dead test pruning configuration validation only; declared policy does not prove running dead test pruning behavior. Select an approved repository-owned command to verify that behavior.
