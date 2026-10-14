# development.documentation.adrs — maximal

Maximal adds a replayable evidence receipt for adrs. The evidence must preserve the decision, alternatives, consequences inputs that determined the result.

Ground the decision in a second run against unchanged adrs inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: adrs configuration validation only; declared policy does not prove running adrs behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.documentation.adrs:evidence-replay. Given the documentation.adrs binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
