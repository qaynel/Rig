# testing.unit.mocking-strategy — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for mocking strategy. The evidence must preserve the mocked_boundaries, real_components, mock_unit_under_test inputs that determined the result. Binding checks: mocking-strategy-evidence-receipt.

Inspect a second run against unchanged mocking strategy inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.unit.mocking-strategy:evidence-replay. Given the unit.mocking-strategy binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Owned scope: `unit.mocking-strategy`.

Offer: Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Input: `rig-services/testing.unit.mocking-strategy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Select an approved repository-owned command to verify that behavior.

minimal: mocked boundaries — ["payment network"].

mid: real components — ["order service"].

maximal: mock unit under test — false.
