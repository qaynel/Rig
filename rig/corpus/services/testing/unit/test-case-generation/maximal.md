# testing.unit.test-case-generation — maximal

Generate tests from observable behavior and give every case a concrete expected outcome. Assertions against private implementation structure make refactoring needlessly expensive.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: test-case-generation-source-code-boundary, test-case-generation-unit-context, test-case-generation-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.unit.test-case-generation:maximal:test-case-generation-source-code-boundary+test-case-generation-unit-context+test-case-generation-evidence-receipt.

Declared predicates: test-case-generation-source-code-boundary: `behavior_cases` is nonempty (a string or array); test-case-generation-unit-context: `asserted_outcomes` is nonempty (a string or array); test-case-generation-evidence-receipt: `assert_implementation_details` equals false.
