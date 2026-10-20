# testing.unit.mocking-strategy — maximal

Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: mocking-strategy-source-code-boundary, mocking-strategy-unit-context, mocking-strategy-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.unit.mocking-strategy:maximal:mocking-strategy-source-code-boundary+mocking-strategy-unit-context+mocking-strategy-evidence-receipt.

Declared predicates: mocking-strategy-source-code-boundary: `mocked_boundaries` is nonempty (a string or array); mocking-strategy-unit-context: `real_components` is nonempty (a string or array); mocking-strategy-evidence-receipt: `mock_unit_under_test` equals false.
