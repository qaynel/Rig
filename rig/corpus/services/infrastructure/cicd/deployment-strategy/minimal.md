# infrastructure.cicd.deployment-strategy — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for deployment strategy. It checks strategy (nonempty): strategy must name the concrete repository contract.. Binding checks: deployment-strategy-source-code-boundary.

Read a repository-owned command or existing native check that can observe cicd.deployment-strategy; bind it to the input named in `rig-services/infrastructure.cicd.deployment-strategy.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside cicd.deployment-strategy is a failure.

Acceptance target: fixture:infrastructure.cicd.deployment-strategy:policy-boundary. Given source-code is present and cicd.deployment-strategy is selected, pass only when the repository binding evaluates cicd.deployment-strategy and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Owned scope: `cicd.deployment-strategy`.

Offer: Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Input: `rig-services/infrastructure.cicd.deployment-strategy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Select an approved repository-owned command to verify that behavior.

minimal: strategy — "canary".

mid: rollback trigger — "error rate above budget".

maximal: automatic full rollout without checks — false.
