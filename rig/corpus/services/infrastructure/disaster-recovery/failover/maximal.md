# infrastructure.disaster-recovery.failover — maximal

Maximal adds a replayable evidence receipt for failover. The evidence must preserve the failover_trigger, fencing_strategy, allow_split_brain inputs that determined the result.

Anchor the review on a second run against unchanged failover inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: failover configuration validation only; declared policy does not prove running failover behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.disaster-recovery.failover:evidence-replay. Given the disaster-recovery.failover binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
