# infrastructure.cicd.deployment-strategy — behavior-oracle slice

Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Policy grade slice. This slice bounds deployment strategy to cicd.deployment-strategy. It uses `deployment-strategy-slice-behavior-oracle` and checks strategy (nonempty): strategy must name the concrete repository contract.