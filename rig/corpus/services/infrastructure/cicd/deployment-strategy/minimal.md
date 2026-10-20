# infrastructure.cicd.deployment-strategy — minimal

Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for deployment strategy. The minimal boundary for deployment strategy checks strategy (nonempty): strategy must name the concrete repository contract. Binding checks: deployment-strategy-source-code-boundary.

Read a repository-owned command or existing native check that can observe cicd.deployment-strategy; bind it to the input named in `rig-services/infrastructure.cicd.deployment-strategy.json` and preserve the check's failure status. When adopting this in an existing repository, connect deployment strategy to the command that inspects strategy and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside cicd.deployment-strategy as a failure.

Acceptance target: policy:infrastructure.cicd.deployment-strategy:minimal:deployment-strategy-source-code-boundary.

Declared predicates: deployment-strategy-source-code-boundary: `strategy` is nonempty (a string or array).
