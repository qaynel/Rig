# testing.unit.mocking-strategy — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for mocking strategy. The evidence must preserve the mocked_boundaries, real_components, mock_unit_under_test inputs that determined the result. Binding checks: mocking-strategy-evidence-receipt.

Inspect a second run against unchanged mocking strategy inputs. Record the mocked_boundaries, real_components, mock_unit_under_test inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this mocking strategy result is stale. The ceiling remains: mocking strategy configuration validation only; declared policy does not prove running mocking strategy behavior. Choose a repository-owned check that observes mocking strategy from rig-services/testing.unit.mocking-strategy.json.

Acceptance target: fixture:testing.unit.mocking-strategy:evidence-replay. Given the unit.mocking-strategy binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.
minimal: mocked boundaries — ["payment network"].
mid: real components — ["order service"].
maximal: mock unit under test — false.
