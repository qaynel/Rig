# testing.unit.mocking-strategy — mid

Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: mocking-strategy-source-code-boundary, mocking-strategy-unit-context.

Acceptance target: policy:testing.unit.mocking-strategy:mid:mocking-strategy-source-code-boundary+mocking-strategy-unit-context.

Declared predicates: mocking-strategy-source-code-boundary: `mocked_boundaries` is nonempty (a string or array); mocking-strategy-unit-context: `real_components` is nonempty (a string or array).
