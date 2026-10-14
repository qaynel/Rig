# testing.test-data.fixtures-factories — maximal

Maximal adds a replayable evidence receipt for fixtures factories. The evidence must preserve the fixture_defaults, explicit_variants, shared_mutable_state inputs that determined the result.

Anchor the review on a second run against unchanged fixtures factories inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: fixtures factories configuration validation only; declared policy does not prove running fixtures factories behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.test-data.fixtures-factories:evidence-replay. Given the test-data.fixtures-factories binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
