# development.debugging.structured-debugging — maximal

Maximal adds a replayable evidence receipt for structured debugging. The evidence must preserve the reproduction_steps, ranked_hypotheses, change_before_reproduction inputs that determined the result.

Tie acceptance to a second run against unchanged structured debugging inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: structured debugging configuration validation only; declared policy does not prove running structured debugging behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.debugging.structured-debugging:evidence-replay. Given the debugging.structured-debugging binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
