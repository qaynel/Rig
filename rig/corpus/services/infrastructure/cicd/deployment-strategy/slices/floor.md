# infrastructure.cicd.deployment-strategy — floor and mutation-floor slice

Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Policy grade slice `deployment-strategy-slice-floor`: Name the deployment strategy, such as canary or blue-green. An unnamed strategy has no measurable rollout, so declare which one ships.
