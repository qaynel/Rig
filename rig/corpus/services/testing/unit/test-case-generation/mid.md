# testing.unit.test-case-generation — mid

Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Policy grade, mid: State a concrete expected outcome per case. An assertion without an expected value proves nothing, so write it. Cumulative with minimal. Binding checks: test-case-generation-source-code-boundary, test-case-generation-unit-context.

Acceptance target: policy:testing.unit.test-case-generation:mid:test-case-generation-source-code-boundary+test-case-generation-unit-context.
Declared predicates: test-case-generation-source-code-boundary: `behavior_cases` is nonempty (a string or array); test-case-generation-unit-context: `asserted_outcomes` is nonempty (a string or array).
