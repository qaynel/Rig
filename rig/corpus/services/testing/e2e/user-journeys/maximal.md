# testing.e2e.user-journeys — maximal

Maximal adds a replayable evidence receipt for user journeys. The evidence must preserve the journeys, observable_outcomes, assert_only_page_loaded inputs that determined the result.

Inspect a second run against unchanged user journeys inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: user journeys configuration validation only; declared policy does not prove running user journeys behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.e2e.user-journeys:evidence-replay. Given the e2e.user-journeys binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
