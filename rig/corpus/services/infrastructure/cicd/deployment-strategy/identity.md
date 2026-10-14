# infrastructure.cicd.deployment-strategy — identity

Policy grade: deployment strategy owns cicd.deployment-strategy. Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Keep neighboring cicd services outside the deployment strategy decision for cicd.deployment-strategy. Inspect the configured input at `rig-services/infrastructure.cicd.deployment-strategy.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Choose a repository-owned check that observes deployment strategy from rig-services/infrastructure.cicd.deployment-strategy.json.

Acceptance target: fixture:infrastructure.cicd.deployment-strategy:policy-boundary. Given source-code is present and cicd.deployment-strategy is selected, pass only when the repository binding evaluates cicd.deployment-strategy and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern.

Service-specific evidence cues:
Offer: Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.
minimal: strategy — "canary".
mid: rollback trigger — "error rate above budget".
maximal: automatic full rollout without checks — false.
