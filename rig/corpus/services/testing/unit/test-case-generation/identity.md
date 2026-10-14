# testing.unit.test-case-generation — identity

Policy grade: test case generation owns unit.test-case-generation. Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Keep sibling services in unit under their own verdicts. Trace the verdict to the configured input at `rig-services/testing.unit.test-case-generation.json`; malformed input is still attributed to that path.

Disposition: convention. Anchor the review on the limit: test case generation configuration validation only; declared policy does not prove running test case generation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.unit.test-case-generation:policy-boundary. Given source-code is present and unit.test-case-generation is selected, pass only when the repository binding evaluates unit.test-case-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern.

Service-specific evidence cues:
Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Owned scope: `unit.test-case-generation`.

Offer: Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Input: `rig-services/testing.unit.test-case-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: test case generation configuration validation only; declared policy does not prove running test case generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: behavior cases — ["reject malformed input"].

mid: asserted outcomes — ["throws invalid record"].

maximal: assert implementation details — false.
