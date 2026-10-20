# testing.unit.test-case-generation — identity

Policy grade: test case generation owns unit.test-case-generation. Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Keep neighboring unit services outside the test case generation decision for unit.test-case-generation. Trace the verdict to the configured input at `rig-services/testing.unit.test-case-generation.json`; malformed input is still attributed to that path.

Disposition: executable. Anchor the review on the limit: test case generation configuration validation only; declared policy does not prove running test case generation behavior. Choose a repository-owned check that observes test case generation from rig-services/testing.unit.test-case-generation.json.

Acceptance target: policy:testing.unit.test-case-generation:minimal:test-case-generation-source-code-boundary.

Declared predicates: test-case-generation-source-code-boundary: `behavior_cases` is nonempty (a string or array).
