# testing.unit.test-case-generation — mid

Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: test-case-generation-source-code-boundary, test-case-generation-unit-context.

Tie acceptance to the existing repository's test case generation convention, then name the source path or command that establishes it. For test case generation, inspect the repository's actual spec, source, test, or configuration for asserted_outcomes; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring unit services outside the test case generation decision for unit.test-case-generation.

Acceptance target: policy:testing.unit.test-case-generation:mid:test-case-generation-source-code-boundary+test-case-generation-unit-context.

Declared predicates: test-case-generation-source-code-boundary: `behavior_cases` is nonempty (a string or array); test-case-generation-unit-context: `asserted_outcomes` is nonempty (a string or array).
