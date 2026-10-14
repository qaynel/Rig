# testing.unit.test-case-generation — behavior-oracle slice

Policy grade slice. This slice bounds test case generation to unit.test-case-generation. It uses `test-case-generation-slice-behavior-oracle` and checks behavior_cases (nonempty): behavior cases must name the concrete repository contract..

Use a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.unit.test-case-generation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than test case generation configuration validation only; declared policy does not prove running test case generation behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Owned scope: `unit.test-case-generation`.

Offer: Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Input: `rig-services/testing.unit.test-case-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: test case generation configuration validation only; declared policy does not prove running test case generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: behavior cases — ["reject malformed input"].

mid: asserted outcomes — ["throws invalid record"].

maximal: assert implementation details — false.
