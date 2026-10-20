# mocking strategy

Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Owned scope: `unit.mocking-strategy`.

Offer: Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Input: `rig-services/testing.unit.mocking-strategy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Select an approved repository-owned command to verify that behavior.

minimal: mocked boundaries — ["payment network"].

mid: real components — ["order service"].

maximal: mock unit under test — false.
