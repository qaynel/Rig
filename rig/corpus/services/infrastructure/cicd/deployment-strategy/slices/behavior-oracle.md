# infrastructure.cicd.deployment-strategy — behavior-oracle slice

This slice bounds deployment strategy to cicd.deployment-strategy. It uses `deployment-strategy-slice-behavior-oracle` and checks strategy (nonempty): strategy must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.cicd.deployment-strategy.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Select an approved repository-owned command to verify that behavior.
