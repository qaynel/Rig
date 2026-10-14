# infrastructure.disaster-recovery.rto-rpo — maximal

Maximal adds a replayable evidence receipt for rto rpo. The evidence must preserve the rto_minutes, rpo_minutes, claim_targets_without_exercise inputs that determined the result.

Anchor the review on a second run against unchanged rto rpo inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: rto rpo configuration validation only; declared policy does not prove running rto rpo behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.disaster-recovery.rto-rpo:evidence-replay. Given the disaster-recovery.rto-rpo binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
