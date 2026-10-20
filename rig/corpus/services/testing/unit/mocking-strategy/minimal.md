# testing.unit.mocking-strategy — minimal

Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Policy grade, minimal: List the costly external boundaries that are mocked. Mocking everything proves nothing, so name only true boundaries. Binding checks: mocking-strategy-source-code-boundary.

Acceptance target: policy:testing.unit.mocking-strategy:minimal:mocking-strategy-source-code-boundary.
Declared predicates: mocking-strategy-source-code-boundary: `mocked_boundaries` is nonempty (a string or array).
