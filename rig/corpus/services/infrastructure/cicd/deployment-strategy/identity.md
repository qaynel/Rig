# infrastructure.cicd.deployment-strategy — identity

Policy grade: deployment strategy owns cicd.deployment-strategy. Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Keep neighboring cicd services outside the deployment strategy decision for cicd.deployment-strategy. Inspect the configured input at `rig-services/infrastructure.cicd.deployment-strategy.json`; malformed input is still attributed to that path.

Disposition: executable. Tie acceptance to the limit: deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Choose a repository-owned check that observes deployment strategy from rig-services/infrastructure.cicd.deployment-strategy.json.

Acceptance target: policy:infrastructure.cicd.deployment-strategy:minimal:deployment-strategy-source-code-boundary.

Declared predicates: deployment-strategy-source-code-boundary: `strategy` is nonempty (a string or array).
