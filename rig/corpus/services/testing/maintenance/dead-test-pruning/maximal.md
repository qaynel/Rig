# testing.maintenance.dead-test-pruning — maximal

Maximal adds a replayable evidence receipt for dead test pruning. The evidence must preserve the obsolete_cases, replacement_evidence, delete_live_regressions inputs that determined the result.

Tie acceptance to a second run against unchanged dead test pruning inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: dead test pruning configuration validation only; declared policy does not prove running dead test pruning behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.maintenance.dead-test-pruning:evidence-replay. Given the maintenance.dead-test-pruning binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
