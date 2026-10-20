# testing.unit.mocking-strategy — minimal

Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for mocking strategy. The minimal boundary for mocking strategy checks mocked_boundaries (nonempty): mocked boundaries must name the concrete repository contract. Binding checks: mocking-strategy-source-code-boundary.

Acceptance target: policy:testing.unit.mocking-strategy:minimal:mocking-strategy-source-code-boundary.

Declared predicates: mocking-strategy-source-code-boundary: `mocked_boundaries` is nonempty (a string or array).
