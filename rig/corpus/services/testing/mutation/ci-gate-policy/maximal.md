# testing.mutation.ci-gate-policy — maximal

Maximal adds a replayable evidence receipt for ci gate policy. The evidence must preserve the minimum_score_percent, timeout_policy, allow_unrun_mutants inputs that determined the result.

Start from a second run against unchanged ci gate policy inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.ci-gate-policy:evidence-replay. Given the mutation.ci-gate-policy binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
