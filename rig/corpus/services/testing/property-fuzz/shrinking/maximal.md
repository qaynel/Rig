# testing.property-fuzz.shrinking — maximal

Maximal adds a replayable evidence receipt for shrinking. The evidence must preserve the failure_predicate, preserved_constraints, drop_failure_during_shrink inputs that determined the result.

Tie acceptance to a second run against unchanged shrinking inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: shrinking configuration validation only; declared policy does not prove running shrinking behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.property-fuzz.shrinking:evidence-replay. Given the property-fuzz.shrinking binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
