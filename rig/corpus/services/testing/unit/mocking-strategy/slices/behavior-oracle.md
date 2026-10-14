# testing.unit.mocking-strategy — behavior-oracle slice

This slice bounds mocking strategy to unit.mocking-strategy. It uses `mocking-strategy-slice-behavior-oracle` and checks mocked_boundaries (nonempty): mocked boundaries must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.unit.mocking-strategy.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Select an approved repository-owned command to verify that behavior.
