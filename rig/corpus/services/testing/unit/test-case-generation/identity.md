# testing.unit.test-case-generation — identity

Policy grade: test-case-generation owns unit.test-case-generation. Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Input: `rig-services/testing.unit.test-case-generation.json`. Configuration validation only, so it confirms behavior cases, asserted outcomes and the implementation-detail flag are declared; it does not generate tests.

Disposition: executable.
Acceptance target: policy:testing.unit.test-case-generation:minimal:test-case-generation-source-code-boundary.
Declared predicates: test-case-generation-source-code-boundary: `behavior_cases` is nonempty (a string or array).
