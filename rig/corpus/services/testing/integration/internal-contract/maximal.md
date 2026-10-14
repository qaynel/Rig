# testing.integration.internal-contract — maximal

Maximal adds a replayable evidence receipt for internal contract. The evidence must preserve the producer_schema, consumer_versions, allow_breaking_change inputs that determined the result.

Ground the decision in a second run against unchanged internal contract inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: internal contract configuration validation only; declared policy does not prove running internal contract behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.integration.internal-contract:evidence-replay. Given the integration.internal-contract binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
