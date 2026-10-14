# testing.unit.test-case-generation — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for test case generation; it does not widen ownership beyond unit.test-case-generation. The context signals are asserted_outcomes. Binding checks: test-case-generation-unit-context.

Tie acceptance to the existing repository's test case generation convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in unit under their own verdicts.

Acceptance target: fixture:testing.unit.test-case-generation:repository-context. Given unit.test-case-generation has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent unit concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Owned scope: `unit.test-case-generation`.

Offer: Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Input: `rig-services/testing.unit.test-case-generation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: test case generation configuration validation only; declared policy does not prove running test case generation behavior. Select an approved repository-owned command to verify that behavior.

minimal: behavior cases — ["reject malformed input"].

mid: asserted outcomes — ["throws invalid record"].

maximal: assert implementation details — false.
