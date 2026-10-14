# infrastructure.cicd.deployment-strategy — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for deployment strategy. The evidence must preserve the strategy, rollback_trigger, automatic_full_rollout_without_checks inputs that determined the result. Binding checks: deployment-strategy-evidence-receipt.

Use a second run against unchanged deployment strategy inputs. Record the strategy, rollback_trigger, automatic_full_rollout_without_checks inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this deployment strategy result is stale. The ceiling remains: deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Choose a repository-owned check that observes deployment strategy from rig-services/infrastructure.cicd.deployment-strategy.json.

Acceptance target: fixture:infrastructure.cicd.deployment-strategy:evidence-replay. Given the cicd.deployment-strategy binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.
minimal: strategy — "canary".
mid: rollback trigger — "error rate above budget".
maximal: automatic full rollout without checks — false.
