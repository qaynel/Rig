# testing.unit.test-case-generation — minimal

Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Policy grade, minimal: List the behaviors the cases cover. Cases tied to structure break on refactor, so describe observable behavior. Binding checks: test-case-generation-source-code-boundary.

Acceptance target: policy:testing.unit.test-case-generation:minimal:test-case-generation-source-code-boundary.
Declared predicates: test-case-generation-source-code-boundary: `behavior_cases` is nonempty (a string or array).
