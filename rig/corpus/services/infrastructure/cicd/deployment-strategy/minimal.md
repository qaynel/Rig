# infrastructure.cicd.deployment-strategy — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for deployment strategy. The minimal boundary for deployment strategy checks strategy (nonempty): strategy must name the concrete repository contract.. Binding checks: deployment-strategy-source-code-boundary.

Read a repository-owned command or existing native check that can observe cicd.deployment-strategy; bind it to the input named in `rig-services/infrastructure.cicd.deployment-strategy.json` and preserve the check's failure status. When adopting this in an existing repository, connect deployment strategy to the command that inspects strategy and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside cicd.deployment-strategy as a failure.

Acceptance target: fixture:infrastructure.cicd.deployment-strategy:policy-boundary. Given source-code is present and cicd.deployment-strategy is selected, pass only when the repository binding evaluates cicd.deployment-strategy and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern. The ceiling is deployment strategy configuration validation only; declared policy does not prove running deployment strategy behavior. Choose a repository-owned check that observes deployment strategy from rig-services/infrastructure.cicd.deployment-strategy.json..

Service-specific evidence cues:
Offer: Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.
minimal: strategy — "canary".
mid: rollback trigger — "error rate above budget".
maximal: automatic full rollout without checks — false.
