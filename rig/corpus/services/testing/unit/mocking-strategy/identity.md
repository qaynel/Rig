# testing.unit.mocking-strategy — identity

Policy grade: mocking strategy owns unit.mocking-strategy. Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Keep neighboring unit services outside the mocking strategy decision for unit.mocking-strategy. Use the configured input at `rig-services/testing.unit.mocking-strategy.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Choose a repository-owned check that observes mocking strategy from rig-services/testing.unit.mocking-strategy.json.

Acceptance target: policy:testing.unit.mocking-strategy:minimal:mocking-strategy-source-code-boundary.

Declared predicates: mocking-strategy-source-code-boundary: `mocked_boundaries` is nonempty (a string or array).
