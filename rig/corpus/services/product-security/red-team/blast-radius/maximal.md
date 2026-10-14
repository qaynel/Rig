# product-security.red-team.blast-radius — maximal

Maximal adds a replayable evidence receipt for blast radius. The evidence must preserve the privilege_scopes, isolation_boundaries, cross_tenant_access inputs that determined the result.

Anchor the review on a second run against unchanged blast radius inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: blast radius configuration validation only; declared policy does not prove running blast radius behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.blast-radius:evidence-replay. Given the red-team.blast-radius binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
