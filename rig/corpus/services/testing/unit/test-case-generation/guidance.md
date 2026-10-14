# test case generation

Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Owned scope: `unit.test-case-generation`.

Offer: Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Input: `rig-services/testing.unit.test-case-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: test case generation configuration validation only; declared policy does not prove running test case generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: behavior cases — ["reject malformed input"].

mid: asserted outcomes — ["throws invalid record"].

maximal: assert implementation details — false.

