# product-security.red-team.dast — maximal

Maximal adds a replayable evidence receipt for dast. The evidence must preserve the target_origin, authorized_scope, scan_unapproved_targets inputs that determined the result.

Ground the decision in a second run against unchanged dast inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: dast configuration validation only; declared policy does not prove running dast behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.dast:evidence-replay. Given the red-team.dast binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
