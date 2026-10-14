# testing.strategy.pyramid-balance — maximal

Maximal adds a replayable evidence receipt for pyramid balance. The evidence must preserve the unit_suites, integration_suites, e2e_only_strategy inputs that determined the result.

Ground the decision in a second run against unchanged pyramid balance inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: pyramid balance configuration validation only; declared policy does not prove running pyramid balance behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.strategy.pyramid-balance:evidence-replay. Given the strategy.pyramid-balance binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
