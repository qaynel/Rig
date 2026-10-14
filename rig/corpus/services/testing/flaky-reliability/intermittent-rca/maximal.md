# testing.flaky-reliability.intermittent-rca — maximal

Maximal adds a replayable evidence receipt for intermittent rca. The evidence must preserve the observed_conditions, reproduction_attempts, blame_randomness_without_evidence inputs that determined the result.

Tie acceptance to a second run against unchanged intermittent rca inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: intermittent rca configuration validation only; declared policy does not prove running intermittent rca behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.flaky-reliability.intermittent-rca:evidence-replay. Given the flaky-reliability.intermittent-rca binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
