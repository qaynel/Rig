# testing.unit.test-case-generation — property-floor slice

This slice bounds test case generation to unit.test-case-generation. It uses `test-case-generation-slice-property-floor` and checks behavior_cases (nonempty): behavior cases must name the concrete repository contract..

Use a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.unit.test-case-generation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than test case generation configuration validation only; declared policy does not prove running test case generation behavior. Select an approved repository-owned command to verify that behavior.
