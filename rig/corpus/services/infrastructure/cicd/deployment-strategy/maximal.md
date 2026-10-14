# infrastructure.cicd.deployment-strategy — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for deployment strategy. The evidence must preserve the strategy, rollback_trigger, automatic_full_rollout_without_checks inputs that determined the result. Binding checks: deployment-strategy-evidence-receipt.

Use a second run against unchanged deployment strategy inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cicd.deployment-strategy:evidence-replay. Given the cicd.deployment-strategy binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Owned scope: `cicd.deployment-strategy`.

Offer: Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Input: `rig-services/infrastructure.cicd.deployment-strategy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Select an approved repository-owned command to verify that behavior.

minimal: strategy — "canary".

mid: rollback trigger — "error rate above budget".

maximal: automatic full rollout without checks — false.
