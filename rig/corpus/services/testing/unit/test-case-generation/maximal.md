# testing.unit.test-case-generation — maximal

Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Policy grade, maximal: Set asserting implementation details to false. Asserting private structure makes refactoring costly, so assert outputs. Cumulative with minimal and mid. Binding checks: test-case-generation-source-code-boundary, test-case-generation-unit-context, test-case-generation-evidence-receipt.

Acceptance target: policy:testing.unit.test-case-generation:maximal:test-case-generation-source-code-boundary+test-case-generation-unit-context+test-case-generation-evidence-receipt.
Declared predicates: test-case-generation-source-code-boundary: `behavior_cases` is nonempty (a string or array); test-case-generation-unit-context: `asserted_outcomes` is nonempty (a string or array); test-case-generation-evidence-receipt: `assert_implementation_details` equals false.
