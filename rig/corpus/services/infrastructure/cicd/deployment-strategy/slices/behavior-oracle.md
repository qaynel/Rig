# infrastructure.cicd.deployment-strategy — behavior-oracle slice

Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Policy grade slice `deployment-strategy-slice-behavior-oracle`: Name the deployment strategy, such as canary or blue-green. An unnamed strategy has no measurable rollout, so declare which one ships. Despite its name this slice is not a behavior oracle: it confirms the rollout strategy, rollback trigger and the no-unchecked-rollout flag are declared; it does not show a canary or rollback ever ran.
