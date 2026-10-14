# testing.regression.change-impact — maximal

Maximal adds a replayable evidence receipt for change impact. The evidence must preserve the changed_interfaces, affected_suites, select_by_filename_only inputs that determined the result.

Trace the verdict to a second run against unchanged change impact inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: change impact configuration validation only; declared policy does not prove running change impact behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.regression.change-impact:evidence-replay. Given the regression.change-impact binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
