# development.documentation.api-reference — maximal

Maximal adds a replayable evidence receipt for api reference. The evidence must preserve the documented_endpoints, error_responses, authentication_documented inputs that determined the result.

Ground the decision in a second run against unchanged api reference inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: api reference configuration validation only; declared policy does not prove running api reference behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.documentation.api-reference:evidence-replay. Given the documentation.api-reference binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
