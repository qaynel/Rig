# testing.unit.mocking-strategy — identity

Policy grade: mocking strategy owns unit.mocking-strategy. Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Keep sibling services in unit under their own verdicts. Use the configured input at `rig-services/testing.unit.mocking-strategy.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.unit.mocking-strategy:policy-boundary. Given source-code is present and unit.mocking-strategy is selected, pass only when the repository binding evaluates unit.mocking-strategy and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern.

Service-specific evidence cues:
Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Owned scope: `unit.mocking-strategy`.

Offer: Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Input: `rig-services/testing.unit.mocking-strategy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Select an approved repository-owned command to verify that behavior.

minimal: mocked boundaries — ["payment network"].

mid: real components — ["order service"].

maximal: mock unit under test — false.
