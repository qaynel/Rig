# infrastructure.cicd.deployment-strategy — mid

Select a deployment strategy with measurable rollout and rollback conditions. Configuration validates the declared controls; live canary outcomes need separately available deployment tooling.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: deployment-strategy-source-code-boundary, deployment-strategy-cicd-context.

Ground the decision in the existing repository's deployment strategy convention, then name the source path or command that establishes it. For deployment strategy, inspect the repository's actual spec, source, test, or configuration for rollback_trigger; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring cicd services outside the deployment strategy decision for cicd.deployment-strategy.

Acceptance target: policy:infrastructure.cicd.deployment-strategy:mid:deployment-strategy-source-code-boundary+deployment-strategy-cicd-context.

Declared predicates: deployment-strategy-source-code-boundary: `strategy` is nonempty (a string or array); deployment-strategy-cicd-context: `rollback_trigger` is nonempty (a string or array).
