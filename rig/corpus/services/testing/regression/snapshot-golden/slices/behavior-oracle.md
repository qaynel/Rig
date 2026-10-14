# testing.regression.snapshot-golden — behavior-oracle slice

This slice bounds snapshot golden to regression.snapshot-golden. It uses `snapshot-golden-slice-behavior-oracle` and checks golden_paths (nonempty): golden paths must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.regression.snapshot-golden.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Select an approved repository-owned command to verify that behavior.
