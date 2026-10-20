# infrastructure.cicd.deployment-strategy — property-floor slice

Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Policy grade slice. This slice bounds deployment strategy to cicd.deployment-strategy. It uses `deployment-strategy-slice-property-floor` and checks strategy (nonempty): strategy must name the concrete repository contract.