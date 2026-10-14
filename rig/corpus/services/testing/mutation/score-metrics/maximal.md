# testing.mutation.score-metrics — maximal

Maximal adds a replayable evidence receipt for score metrics. The evidence must preserve the killed_mutants, valid_mutants, include_invalid_mutants_in_score inputs that determined the result.

Ground the decision in a second run against unchanged score metrics inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.score-metrics:evidence-replay. Given the mutation.score-metrics binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
