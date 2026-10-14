# infrastructure.cicd.deployment-strategy — behavior-oracle slice

Policy grade slice. This slice bounds deployment strategy to cicd.deployment-strategy. It uses `deployment-strategy-slice-behavior-oracle` and checks strategy (nonempty): strategy must name the concrete repository contract..

For deployment strategy, choose a repository example that satisfies strategy at the behavior-oracle floor, plus a failure where strategy must name the concrete repository contract. is false. For deployment strategy, wire `behavior-oracle` to `rig-services/infrastructure.cicd.deployment-strategy.json` and keep its verdict on strategy; missing evidence is a named gap, with ceiling deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Choose a repository-owned check that observes deployment strategy from rig-services/infrastructure.cicd.deployment-strategy.json..

Service-specific evidence cues:
Offer: Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.
minimal: strategy — "canary".
mid: rollback trigger — "error rate above budget".
maximal: automatic full rollout without checks — false.
