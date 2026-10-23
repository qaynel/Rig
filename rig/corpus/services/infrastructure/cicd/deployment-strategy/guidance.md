# deployment-strategy

Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Owned scope: `cicd.deployment-strategy`. Input: `rig-services/infrastructure.cicd.deployment-strategy.json`.

Coverage ceiling: Configuration validation only, so it confirms the rollout strategy, rollback trigger and the no-unchecked-rollout flag are declared; it does not show a canary or rollback ever ran.

minimal: strategy — "canary". Name the deployment strategy, such as canary or blue-green. An unnamed strategy has no measurable rollout, so declare which one ships.

mid: rollback trigger — "error rate above budget". State the measurable condition that triggers rollback, such as an error-rate threshold. Without a trigger a bad release keeps rolling, so write the number.

maximal: automatic full rollout without checks — false. Set automatic full rollout without checks to false. Skipping the staged checks defeats the strategy, so gate the final step on them.
