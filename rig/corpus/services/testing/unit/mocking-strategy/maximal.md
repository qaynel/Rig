# testing.unit.mocking-strategy — maximal

Maximal adds a replayable evidence receipt for mocking strategy. The evidence must preserve the mocked_boundaries, real_components, mock_unit_under_test inputs that determined the result.

Inspect a second run against unchanged mocking strategy inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.unit.mocking-strategy:evidence-replay. Given the unit.mocking-strategy binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
