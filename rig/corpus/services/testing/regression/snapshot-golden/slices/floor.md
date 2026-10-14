# testing.regression.snapshot-golden — floor and mutation-floor slice

This slice bounds snapshot golden to regression.snapshot-golden. It uses `snapshot-golden-slice-floor` and checks golden_paths (nonempty): golden paths must name the concrete repository contract..

Use a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.regression.snapshot-golden.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Select an approved repository-owned command to verify that behavior.
