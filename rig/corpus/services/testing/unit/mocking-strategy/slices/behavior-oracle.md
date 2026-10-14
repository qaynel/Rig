# testing.unit.mocking-strategy — behavior-oracle slice

Policy grade slice. This slice bounds mocking strategy to unit.mocking-strategy. It uses `mocking-strategy-slice-behavior-oracle` and checks mocked_boundaries (nonempty): mocked boundaries must name the concrete repository contract..

For mocking strategy, choose a repository example that satisfies mocked_boundaries at the behavior-oracle floor, plus a failure where mocked boundaries must name the concrete repository contract. is false. For mocking strategy, wire `behavior-oracle` to `rig-services/testing.unit.mocking-strategy.json` and keep its verdict on mocked_boundaries; missing evidence is a named gap, with ceiling mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Choose a repository-owned check that observes mocking strategy from rig-services/testing.unit.mocking-strategy.json..

Service-specific evidence cues:
Offer: Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.
minimal: mocked boundaries — ["payment network"].
mid: real components — ["order service"].
maximal: mock unit under test — false.
