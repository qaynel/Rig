# testing.strategy.pyramid-balance — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for pyramid balance. The evidence must preserve the unit_suites, integration_suites, e2e_only_strategy inputs that determined the result. Binding checks: pyramid-balance-evidence-receipt.

Ground the decision in a second run against unchanged pyramid balance inputs. Record the unit_suites, integration_suites, e2e_only_strategy inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this pyramid balance result is stale. The ceiling remains: pyramid balance configuration validation only; declared policy does not prove running pyramid balance behavior. Choose a repository-owned check that observes pyramid balance from rig-services/testing.strategy.pyramid-balance.json.

Acceptance target: fixture:testing.strategy.pyramid-balance:evidence-replay. Given the strategy.pyramid-balance binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.
minimal: unit suites — ["parser"].
mid: integration suites — ["api database"].
maximal: e2e only strategy — false.
