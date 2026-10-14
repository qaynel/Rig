# testing.integration.external-service — maximal

Maximal adds a replayable evidence receipt for external service. The evidence must preserve the external_contracts, failure_cases, require_production_account inputs that determined the result.

Tie acceptance to a second run against unchanged external service inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: external service configuration validation only; declared policy does not prove running external service behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.integration.external-service:evidence-replay. Given the integration.external-service binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
