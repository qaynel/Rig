# infrastructure.cicd.deployment-strategy — property-floor slice

Policy grade slice. This slice bounds deployment strategy to cicd.deployment-strategy. It uses `deployment-strategy-slice-property-floor` and checks strategy (nonempty): strategy must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.cicd.deployment-strategy.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Owned scope: `cicd.deployment-strategy`.

Offer: Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Input: `rig-services/infrastructure.cicd.deployment-strategy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Select an approved repository-owned command to verify that behavior.

minimal: strategy — "canary".

mid: rollback trigger — "error rate above budget".

maximal: automatic full rollout without checks — false.
