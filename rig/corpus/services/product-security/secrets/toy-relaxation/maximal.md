# product-security.secrets.toy-relaxation — maximal

Maximal adds a replayable evidence receipt for toy relaxation. The evidence must preserve the toy_scope, expires_after_days, permit_production_use inputs that determined the result.

Inspect a second run against unchanged toy relaxation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.secrets.toy-relaxation:evidence-replay. Given the secrets.toy-relaxation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
