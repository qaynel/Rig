# testing.regression.snapshot-golden — maximal

Maximal adds a replayable evidence receipt for snapshot golden. The evidence must preserve the golden_paths, reviewed_diffs, automatic_snapshot_acceptance inputs that determined the result.

Tie acceptance to a second run against unchanged snapshot golden inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.regression.snapshot-golden:evidence-replay. Given the regression.snapshot-golden binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
