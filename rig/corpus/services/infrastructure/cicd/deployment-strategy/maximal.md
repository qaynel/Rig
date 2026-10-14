# infrastructure.cicd.deployment-strategy — maximal

Maximal adds a replayable evidence receipt for deployment strategy. The evidence must preserve the strategy, rollback_trigger, automatic_full_rollout_without_checks inputs that determined the result.

Use a second run against unchanged deployment strategy inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cicd.deployment-strategy:evidence-replay. Given the cicd.deployment-strategy binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
