# testing.unit.mocking-strategy — maximal

Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Policy grade, maximal: Set mocking the unit under test to false. A mocked unit proves only what the mock was told to return, so test the real one. Cumulative with minimal and mid. Binding checks: mocking-strategy-source-code-boundary, mocking-strategy-unit-context, mocking-strategy-evidence-receipt.

Acceptance target: policy:testing.unit.mocking-strategy:maximal:mocking-strategy-source-code-boundary+mocking-strategy-unit-context+mocking-strategy-evidence-receipt.
Declared predicates: mocking-strategy-source-code-boundary: `mocked_boundaries` is nonempty (a string or array); mocking-strategy-unit-context: `real_components` is nonempty (a string or array); mocking-strategy-evidence-receipt: `mock_unit_under_test` equals false.
