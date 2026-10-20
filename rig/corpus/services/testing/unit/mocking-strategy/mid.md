# testing.unit.mocking-strategy — mid

Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Policy grade, mid: List the real components the unit uses. Without them the test checks a mock, so name the collaborators exercised. Cumulative with minimal. Binding checks: mocking-strategy-source-code-boundary, mocking-strategy-unit-context.

Acceptance target: policy:testing.unit.mocking-strategy:mid:mocking-strategy-source-code-boundary+mocking-strategy-unit-context.
Declared predicates: mocking-strategy-source-code-boundary: `mocked_boundaries` is nonempty (a string or array); mocking-strategy-unit-context: `real_components` is nonempty (a string or array).
