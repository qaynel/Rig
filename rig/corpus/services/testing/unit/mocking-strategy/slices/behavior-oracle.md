# testing.unit.mocking-strategy — behavior-oracle slice

Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Policy grade slice. This slice bounds mocking strategy to unit.mocking-strategy. It uses `mocking-strategy-slice-behavior-oracle` and checks mocked_boundaries (nonempty): mocked boundaries must name the concrete repository contract.