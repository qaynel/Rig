# testing.unit.test-case-generation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for test case generation. It checks behavior_cases (nonempty): behavior cases must name the concrete repository contract.. Binding checks: test-case-generation-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe unit.test-case-generation; bind it to the input named in `rig-services/testing.unit.test-case-generation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside unit.test-case-generation is a failure.

Acceptance target: fixture:testing.unit.test-case-generation:policy-boundary. Given source-code is present and unit.test-case-generation is selected, pass only when the repository binding evaluates unit.test-case-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Owned scope: `unit.test-case-generation`.

Offer: Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Input: `rig-services/testing.unit.test-case-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: test case generation configuration validation only; declared policy does not prove running test case generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: behavior cases — ["reject malformed input"].

mid: asserted outcomes — ["throws invalid record"].

maximal: assert implementation details — false.
