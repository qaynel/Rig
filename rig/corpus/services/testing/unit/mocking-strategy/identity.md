# testing.unit.mocking-strategy — identity

Policy grade: mocking strategy owns unit.mocking-strategy. Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Keep neighboring unit services outside the mocking strategy decision for unit.mocking-strategy. Use the configured input at `rig-services/testing.unit.mocking-strategy.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Choose a repository-owned check that observes mocking strategy from rig-services/testing.unit.mocking-strategy.json.

Acceptance target: fixture:testing.unit.mocking-strategy:policy-boundary. Given source-code is present and unit.mocking-strategy is selected, pass only when the repository binding evaluates unit.mocking-strategy and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern.

Service-specific evidence cues:
Offer: Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.
minimal: mocked boundaries — ["payment network"].
mid: real components — ["order service"].
maximal: mock unit under test — false.
