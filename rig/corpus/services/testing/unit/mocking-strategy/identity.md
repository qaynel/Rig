# testing.unit.mocking-strategy — identity

Policy grade: mocking-strategy owns unit.mocking-strategy. Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Input: `rig-services/testing.unit.mocking-strategy.json`. Configuration validation only, so it confirms mocked boundaries, real components and the mock-subject flag are declared; it does not run the tests.

Disposition: executable.
Acceptance target: policy:testing.unit.mocking-strategy:minimal:mocking-strategy-source-code-boundary.
Declared predicates: mocking-strategy-source-code-boundary: `mocked_boundaries` is nonempty (a string or array).
