# product-security.license-compliance.license-diff — maximal

Maximal adds a replayable evidence receipt for license diff. The evidence must preserve the previous_inventory, current_inventory, accept_new_licenses_automatically inputs that determined the result.

Ground the decision in a second run against unchanged license diff inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: license diff configuration validation only; declared policy does not prove running license diff behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.license-compliance.license-diff:evidence-replay. Given the license-compliance.license-diff binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
